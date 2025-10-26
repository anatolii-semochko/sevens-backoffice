<?php

namespace App\Repository\Wallet;

use App\Entity\Wallet\WalletTransaction;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<WalletTransaction>
 */
class WalletTransactionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, WalletTransaction::class);
    }

    /**
     * @throws \Exception
     */
    public function get(string $id): WalletTransaction
    {
        $transaction = $this->find($id);
        if (!$transaction) {
            throw new \Exception('Transaction not found');
        }

        return $transaction;
    }
}
