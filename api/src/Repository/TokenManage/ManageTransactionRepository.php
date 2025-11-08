<?php

declare(strict_types=1);

namespace App\Repository\TokenManage;

use App\Entity\TokenManage\ManageTransaction;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ManageTransaction>
 */
class ManageTransactionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ManageTransaction::class);
    }

    public function create(): ManageTransaction
    {
        return new ManageTransaction();
    }

    public function save(ManageTransaction $transaction): void
    {
        $this->getEntityManager()->persist($transaction);
        $this->getEntityManager()->flush();
    }
}
