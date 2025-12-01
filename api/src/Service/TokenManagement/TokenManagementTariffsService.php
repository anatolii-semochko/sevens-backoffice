<?php

declare(strict_types=1);

namespace App\Service\TokenManagement;

use App\Entity\TokenManage\ManageTariffHistory;
use App\Exception\NotFoundException;
use App\Repository\TokenManage\ManageTariffHistoryRepository;
use App\Service\NodeServer;
use App\Service\NodeServer\NodeServerApiClient;
use App\Service\WalletService;
use App\Utils\Filters;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\NoResultException;
use Symfony\Component\Security\Core\User\UserInterface;

readonly class TokenManagementTariffsService
{
    public function __construct(
        private ManageTariffHistoryRepository $repository,
        private NodeServerApiClient           $nodeApi,
        private EntityManagerInterface        $em,
        private WalletService                 $walletService,
    ) {}

    /**
     * @return array
     * @throws NodeServer\NodeServerApiException
     */
    public function getCurrentTariffs(): array
    {
        $tariffs = $this->nodeApi->getTariffs();
        if (!$tariffs) {
            throw new NotFoundException('Tariffs are not available');
        }

        return $tariffs;
    }

    /**
     * @throws \DateMalformedStringException
     * @throws NoResultException
     * @throws NonUniqueResultException
     */
    public function fetchByFilter(array $criteria): array
    {
        $page = max(1, (int) ($criteria['page'] ?? 1));
        $pageSize = max(1, min(100, (int) ($criteria['pageSize'] ?? 20)));

        // Use universal date filter helper
        $dateRange = Filters::dateFilter('createdAt', $criteria);

        $offset = ($page - 1) * $pageSize;

        // Build query with conditional date filtering
        $qb = $this->repository->createQueryBuilder('th');

        if ($dateRange !== null) {
            $qb->where('th.createdAt >= :dateFrom')
               ->andWhere('th.createdAt <= :dateTo')
               ->setParameter('dateFrom', $dateRange['from'])
               ->setParameter('dateTo', $dateRange['to']);
        }

        $items = $qb->orderBy('th.createdAt', 'DESC')
            ->setMaxResults($pageSize)
            ->setFirstResult($offset)
            ->getQuery()
            ->getResult();

        // Build count query with conditional date filtering
        $countQb = $this->repository->createQueryBuilder('th')
            ->select('COUNT(th.id)');

        if ($dateRange !== null) {
            $countQb->where('th.createdAt >= :dateFrom')
                    ->andWhere('th.createdAt <= :dateTo')
                    ->setParameter('dateFrom', $dateRange['from'])
                    ->setParameter('dateTo', $dateRange['to']);
        }

        $total = $countQb->getQuery()->getSingleScalarResult();

        return [
            'items' => $items,
            'total' => (int) $total,
            'page' => $page,
            'pageSize' => $pageSize,
        ];
    }


    /**
     * @throws NodeServer\NodeServerApiException
     */
    public function getTariffsTransaction(
        string $authorityPublicKey,
        string $targetWallet,
        float $mint,
        float $setSale,
        int $buy,
        float $burn,
        bool $paused
    ): array {
        $transaction = $this->nodeApi->getTariffTransaction(
            $authorityPublicKey,
            $targetWallet,
            $mint,
            $setSale,
            $buy,
            $burn,
            $paused
        );

        return [
            'transactionId' => $this->walletService->saveTransaction($transaction),
            'transaction' => $transaction,
        ];
    }

    /**
     * @throws NodeServer\NodeServerApiException
     */
    public function postTransaction(
        UserInterface $adminUser,
        string $targetWallet,
        float $mint,
        float $setSale,
        int $buy,
        float $burn,
        bool $paused,
        string $transactionId,
        string $txSignature
    ): void {
        $this->walletService->matchTransactionSignature($transactionId, $txSignature);
        $this->nodeApi->sendSignedTransaction($txSignature);

        $tariffHistory = new ManageTariffHistory();
        $tariffHistory->setAdminUser($adminUser);
        $tariffHistory->setTargetWallet($targetWallet);
        $tariffHistory->setMint($mint);
        $tariffHistory->setSetSale($setSale);
        $tariffHistory->setBuy($buy);
        $tariffHistory->setBurn($burn);
        $tariffHistory->setPaused($paused);
        $this->em->persist($tariffHistory);
        $this->em->flush();
    }
}
