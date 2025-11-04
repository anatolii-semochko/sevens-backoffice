<?php

declare(strict_types=1);

namespace App\Controller\TokenManagement;

use App\Controller\BaseController;
use App\Service\NodeServer\NodeServerApiClient;
use App\Service\TokenManagement\TokenManagementTariffsService;
use App\Service\TokenManagement\TokenManagementService;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/token-management')]
#[IsGranted('ROLE_ADMIN')]
class TokenManageController extends BaseController
{
    public const array TARIFF_HISTORY_GROUPS = [
        'groups' => [
            'tariff-history:read',
            'user:read',
        ]
    ];

    public const array MANAGE_TRANSACTION_GROUPS = [
        'groups' => [
            'manage-transaction:read',
            'user:read',
        ]
    ];

    public function __construct(
        private readonly NodeServerApiClient           $nodeApi,
        private readonly TokenManagementTariffsService $tokenManagementTariffsService,
        private readonly TokenManagementService        $tokenManageService,
    ) {}

    #[Route('/current-tariffs', name: 'get_current_tariffs', methods: ['GET'])]
    public function getCurrentTariffs(): JsonResponse
    {
        try {
            return $this->json($this->tokenManagementTariffsService->getCurrentTariffs());
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }
    }

    #[Route('/tariffs-history', name: 'tariffs-history', methods: ['GET'])]
    public function fetch(Request $request): JsonResponse
    {
        try {
            return $this->json(
                $this->tokenManagementTariffsService->fetchByFilter($request->query->all() ?? []),
                context: self::TARIFF_HISTORY_GROUPS
            );
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }
    }

    #[Route('/get-tariffs-transaction', name: 'tariff_get_transaction', methods: ['POST'])]
    public function getTariffsTransaction(Request $request): JsonResponse
    {
        try {
            $payload = $request->getPayload();
            $transaction = $this->tokenManagementTariffsService->getTariffsTransaction(
                $payload->get('authorityPublicKey'),
                $payload->get('targetWallet'),
                (int) $payload->get('mint'),
                (int) $payload->get('setSale'),
                (int) $payload->get('buy'),
                (int) $payload->get('burn'),
                (bool) $payload->get('paused'),
            );

            return $this->json($transaction);
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }
    }

    #[Route('/post-tariffs-transaction', name: 'tariff_post_transaction', methods: ['POST'])]
    public function postTransaction(Request $request): JsonResponse
    {
        try {
            $payload = $request->getPayload();
            $this->tokenManagementTariffsService->postTransaction(
                $this->getUser(),
                $payload->get('targetWallet'),
                (int) $payload->get('mint'),
                (int) $payload->get('setSale'),
                (int) $payload->get('buy'),
                (int) $payload->get('burn'),
                (bool) $payload->get('paused'),
                $payload->get('transactionId'),
                $payload->get('txSignature'),
            );

            return $this->json(null);
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }
    }

    #[Route('/token-transactions', name: 'token_manage_transactions_fetch', methods: ['GET'])]
    public function getTokenTransactions(Request $request): JsonResponse
    {
        try {
            return $this->json(
                $this->tokenManageService->fetchByFilter($request->query->all() ?? []),
                context: self::MANAGE_TRANSACTION_GROUPS,
            );
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }
    }
}
