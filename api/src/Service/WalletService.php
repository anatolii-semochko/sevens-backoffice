<?php

namespace App\Service;

use App\Entity\Wallet\WalletTransaction;
use App\Entity\Wallet\WalletTransactionTypeEnum;
use App\Repository\Wallet\WalletTransactionRepository;
use App\Service\NodeServer\NodeServerApiClient;
use App\Service\NodeServer\NodeServerApiException;
use Doctrine\ORM\EntityManagerInterface;

readonly class WalletService
{
    public function __construct(
        private EntityManagerInterface $em,
        private NodeServerApiClient $nodeServerApiClient,
        private WalletTransactionRepository $walletTransactionRepository,
    ) {}

    public function saveTransaction(string $transaction): string
    {
        $walletTransaction = new WalletTransaction();
        $walletTransaction->setType(WalletTransactionTypeEnum::BACKOFFICE);
        $walletTransaction->setTransaction($transaction);
        $this->em->persist($walletTransaction);
        $this->em->flush();

        return $walletTransaction->getId();
    }

    /**
     * @throws NodeServerApiException
     */
    public function matchTransactionSignature(string $transactionId, string $txSignature): void
    {
        $transaction = $this->walletTransactionRepository->get($transactionId);
        try {
            $this->nodeServerApiClient->matchTransactionAndSignature($transaction->getTransaction(), $txSignature);
            $this->em->remove($transaction);
            $this->em->flush();
        } catch (NodeServerApiException $e) {
            $transaction->setError($e->getMessage());
            $transaction->setUsedAt(new \DateTime());
            $this->em->persist($transaction);
            $this->em->flush();
            throw new NodeServerApiException($e->getMessage());
        }
    }
}
