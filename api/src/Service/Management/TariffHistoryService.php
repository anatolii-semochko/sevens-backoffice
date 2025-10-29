<?php

declare(strict_types=1);

namespace App\Service\Management;

use App\Entity\Tariff\TariffHistory;
use App\Repository\Management\TariffHistoryRepository;
use App\Service\NodeServer;
use App\Service\NodeServer\NodeServerApiClient;
use App\Service\WalletService;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\NoResultException;
use Symfony\Component\Security\Core\User\UserInterface;

readonly class TariffHistoryService
{
    public function __construct(
        private TariffHistoryRepository $repository,
        private NodeServerApiClient $nodeApi,
        private EntityManagerInterface $em,
        private WalletService $walletService,
    ) {}

    /**
     * @throws \DateMalformedStringException
     * @throws NoResultException
     * @throws NonUniqueResultException
     */
    public function fetchByFilter(array $criteria): array
    {
        $page = max(1, (int) ($criteria['page'] ?? 1));
        $pageSize = max(1, min(100, (int) ($criteria['pageSize'] ?? 20)));
        $filter = $criteria['filter'] ?? 'last-month';
        $dateFrom = $criteria['dateFrom'] ?? null;
        $dateTo = $criteria['dateTo'] ?? null;

        $dateRange = $this->getDateRange($filter, $dateFrom, $dateTo);

        $offset = ($page - 1) * $pageSize;

        $items = $this->repository->createQueryBuilder('th')
            ->where('th.createdAt >= :dateFrom')
            ->andWhere('th.createdAt <= :dateTo')
            ->setParameter('dateFrom', $dateRange['from'])
            ->setParameter('dateTo', $dateRange['to'])
            ->orderBy('th.createdAt', 'DESC')
            ->setMaxResults($pageSize)
            ->setFirstResult($offset)
            ->getQuery()
            ->getResult();

        $total = $this->repository->createQueryBuilder('th')
            ->select('COUNT(th.id)')
            ->where('th.createdAt >= :dateFrom')
            ->andWhere('th.createdAt <= :dateTo')
            ->setParameter('dateFrom', $dateRange['from'])
            ->setParameter('dateTo', $dateRange['to'])
            ->getQuery()
            ->getSingleScalarResult();

        return [
            'items' => $items,
            'total' => (int) $total,
            'page' => $page,
            'pageSize' => $pageSize,
        ];
    }

    /**
     * @throws \DateMalformedStringException
     */
    private function getDateRange(string $filter, ?string $dateFrom, ?string $dateTo): array
    {
        $now = new \DateTimeImmutable();
        $to = $now;

        switch ($filter) {
            case 'last-day':
                $from = $now->modify('-1 day');
                break;
            case 'last-week':
                $from = $now->modify('-1 week');
                break;
            case 'last-month':
                $from = $now->modify('-1 month');
                break;
            case 'last-year':
                $from = $now->modify('-1 year');
                break;
            case 'custom':
                if ($dateFrom) {
                    $from = new \DateTimeImmutable($dateFrom);
                } else {
                    $from = $now->modify('-1 month');
                }
                if ($dateTo) {
                    $to = new \DateTimeImmutable($dateTo)->setTime(23, 59, 59);
                }
                break;
            default:
                $from = $now->modify('-1 month');
        }

        return [
            'from' => $from,
            'to' => $to,
        ];
    }

    /**
     * @throws NodeServer\NodeServerApiException
     */
    public function getCurrentTariffs(): array
    {
        return $this->nodeApi->getTariffs();
    }

    /**
     * @throws NodeServer\NodeServerApiException
     */
    public function getTransaction(
        string $authorityPublicKey,
        string $targetWallet,
        int $mint,
        int $setSale,
        int $buy,
        int $burn
    ): array {
        $transactionData = $this->nodeApi->getTariffTransaction(
            $authorityPublicKey,
            $targetWallet,
            $mint,
            $setSale,
            $buy,
            $burn
        );

        return [
            'transactionId' => $this->walletService->saveTransaction($transactionData['transaction']),
            'transaction' => $transactionData['transaction'],
        ];
    }

    /**
     * @throws NodeServer\NodeServerApiException
     */
    public function postTransaction(
        UserInterface $adminUser,
        string $targetWallet,
        int $mint,
        int $setSale,
        int $buy,
        int $burn,
        string $transactionId,
        string $txSignature
    ): void {
        $this->walletService->matchTransactionSignature($transactionId, $txSignature);
        $this->nodeApi->sendSignedTransaction($txSignature);

        $tariffHistory = new TariffHistory();
        $tariffHistory->setAdminUser($adminUser);
        $tariffHistory->setTargetWallet($targetWallet);
        $tariffHistory->setMint($mint);
        $tariffHistory->setSetSale($setSale);
        $tariffHistory->setBuy($buy);
        $tariffHistory->setBurn($burn);
        $this->em->persist($tariffHistory);
        $this->em->flush();
    }
}
