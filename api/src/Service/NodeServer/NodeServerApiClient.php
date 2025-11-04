<?php

namespace App\Service\NodeServer;

readonly class NodeServerApiClient extends NodeServerApi
{
    /**
     * Get tariffs from blockchain
     * @throws NodeServerApiException
     */
    public function getTariffs(): array
    {
        return $this->get('/manage/tariffs', null);
    }

    /**
     * @throws NodeServerApiException
     */
    public function getTariffTransaction(
        string $authorityPublicKey,
        string $targetWallet,
        int $mint,
        int $setSale,
        int $buy,
        int $burn,
        bool $paused
    ): string {
        return $this->get('/manage/tariffs/transaction', [
            'authorityPublicKey' => $authorityPublicKey,
            'targetWallet' => $targetWallet,
            'mint' => $mint,
            'setSale' => $setSale,
            'buy' => $buy,
            'burn' => $burn,
            'paused' => $paused,
        ]);
    }

    /**
     * @throws NodeServerApiException
     */
    public function sendSignedTransaction(string $txSignature): array
    {
        return $this->post('/transaction/send', [
            'txSignature' => $txSignature,
        ]);
    }

    /**
     * @throws NodeServerApiException
     */
    public function matchTransactionAndSignature(string $transaction, string $txSignature): void
    {
        $this->post('/transaction/match', [
            'transaction' => $transaction,
            'txSignature' => $txSignature,
        ]);
    }
}
