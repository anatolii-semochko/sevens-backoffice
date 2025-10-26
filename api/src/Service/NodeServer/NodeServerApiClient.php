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
        return $this->get('/tariffs', null);
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
        int $burn
    ): array {
        return $this->get('/tariffs/get-transaction', [
            'authorityPublicKey' => $authorityPublicKey,
            'targetWallet' => $targetWallet,
            'mint' => $mint,
            'setSale' => $setSale,
            'buy' => $buy,
            'burn' => $burn,
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
    public function matchTransactionAndSignature(string $transaction, string $txSignature): array
    {
        return $this->post('/transaction/match', [
            'transaction' => $transaction,
            'txSignature' => $txSignature,
        ]);
    }
}
