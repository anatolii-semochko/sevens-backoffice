<?php

declare(strict_types=1);

namespace App\Service\TokenManagement;

use App\Repository\TokenManage\ManageTransactionRepository;
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
     */
    public function fetchByFilter(array $criteria): array
    {
        $page = max(1, (int) ($criteria['page'] ?? 1));
        $pageSize = max(1, min(100, (int) ($criteria['pageSize'] ?? 50)));

        $offset = ($page - 1) * $pageSize;

        $qb = $this->repository->createQueryBuilder('mt')
            ->orderBy('mt.createdAt', 'DESC')
            ->setMaxResults($pageSize)
            ->setFirstResult($offset);

        $items = $qb->getQuery()->getResult();

        $totalQb = $this->repository->createQueryBuilder('mt')
            ->select('COUNT(mt.id)');

        $total = (int) $totalQb->getQuery()->getSingleScalarResult();

        $incomeSumQb = $this->repository->createQueryBuilder('mt')
            ->select('SUM(mt.income)');

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
