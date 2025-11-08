<?php

declare(strict_types=1);

namespace App\Service\TokenManagement;

use App\Repository\TokenManage\ManageTransactionRepository;
use App\Utils\Filters;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\NoResultException;

readonly class TokenManagementService
{
    public function __construct(
        private ManageTransactionRepository $repository,
    ) {}

    /**
     * @throws NoResultException
     * @throws NonUniqueResultException
     * @throws \DateMalformedStringException
     */
    public function fetchByFilter(array $criteria): array
    {
        $page = max(1, (int) ($criteria['page'] ?? 1));
        $pageSize = max(1, min(100, (int) ($criteria['pageSize'] ?? 50)));
        $dateRange = Filters::dateFilter('createdAt', $criteria);
        $offset = ($page - 1) * $pageSize;

        // Build query with conditional date filtering
        $qb = $this->repository->createQueryBuilder('mt');

        if ($dateRange !== null) {
            $qb->where('mt.createdAt >= :dateFrom')
               ->andWhere('mt.createdAt <= :dateTo')
               ->setParameter('dateFrom', $dateRange['from'])
               ->setParameter('dateTo', $dateRange['to']);
        }

        $items = $qb->orderBy('mt.createdAt', 'DESC')
            ->setMaxResults($pageSize)
            ->setFirstResult($offset)
            ->getQuery()
            ->getResult();

        // Build count query with conditional date filtering
        $totalQb = $this->repository->createQueryBuilder('mt')
            ->select('COUNT(mt.id)');

        if ($dateRange !== null) {
            $totalQb->where('mt.createdAt >= :dateFrom')
                    ->andWhere('mt.createdAt <= :dateTo')
                    ->setParameter('dateFrom', $dateRange['from'])
                    ->setParameter('dateTo', $dateRange['to']);
        }

        $total = (int) $totalQb->getQuery()->getSingleScalarResult();

        // Build income sum query with conditional date filtering
        $incomeSumQb = $this->repository->createQueryBuilder('mt')
            ->select('SUM(mt.income)');

        if ($dateRange !== null) {
            $incomeSumQb->where('mt.createdAt >= :dateFrom')
                        ->andWhere('mt.createdAt <= :dateTo')
                        ->setParameter('dateFrom', $dateRange['from'])
                        ->setParameter('dateTo', $dateRange['to']);
        }

        $incomeSum = (float) $incomeSumQb->getQuery()->getSingleScalarResult();

        return [
            'items' => $items,
            'total' => $total,
            'incomeSum' => $incomeSum,
            'page' => $page,
            'pageSize' => $pageSize,
        ];
    }
}
