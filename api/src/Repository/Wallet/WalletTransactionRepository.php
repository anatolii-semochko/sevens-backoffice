<?php

namespace App\Repository\Wallet;

use App\Entity\Wallet\WalletTransaction;
use App\Exception\NotFoundException;
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

    public function get(string $id): WalletTransaction
    {
        $transaction = $this->find($id);
        if (!$transaction) {
            throw new NotFoundException('Transaction not found');
        }

        return $transaction;
    }
}
