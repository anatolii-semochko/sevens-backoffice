<?php

declare(strict_types=1);

namespace App\Controller;

use App\Repository\Management\TariffHistoryRepository;
use App\Service\Management\TariffHistoryService;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/tariff-history')]
#[IsGranted('ROLE_ADMIN')]
class TariffHistoryController extends BaseController
{
    public const array TARIFF_HISTORY_GROUPS = [
        'groups' => [
            'tariff-history:read',
            'user:read',
        ]
    ];

    public function __construct(
        private readonly TariffHistoryRepository $repository,
        private readonly TariffHistoryService $service,
    ) {}

    #[Route('', name: 'tariff_history_fetch', methods: ['GET'])]
    public function fetch(Request $request): JsonResponse
    {
        try {
            return $this->json(
                $this->service->fetchByFilter($request->query->all() ?? []),
                context: self::TARIFF_HISTORY_GROUPS
            );
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }
    }

    #[Route('/current', name: 'tariff_get_current', methods: ['GET'])]
    public function getCurrent(): JsonResponse
    {
        try {
            return $this->json($this->service->getCurrentTariffs());
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }
    }

    #[Route('/{id}', name: 'tariff_history_get', methods: ['GET'])]
    public function get(string $id): JsonResponse
    {
        try {
            $tariffHistory = $this->repository->find($id);

            if (!$tariffHistory) {
                throw new \Exception('Management history not found', 404);
            }

            return $this->json($tariffHistory, context: self::TARIFF_HISTORY_GROUPS);
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }
    }

    #[Route('/transaction/get', name: 'tariff_get_transaction', methods: ['POST'])]
    public function getTransaction(Request $request): JsonResponse
    {
        try {
            $payload = $request->getPayload();
            $transaction = $this->service->getTransaction(
                $payload->get('authorityPublicKey'),
                $payload->get('targetWallet'),
                (int) $payload->get('mint'),
                (int) $payload->get('setSale'),
                (int) $payload->get('buy'),
                (int) $payload->get('burn'),
            );

            return $this->json($transaction);
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }
    }

    #[Route('/transaction/post', name: 'tariff_post_transaction', methods: ['POST'])]
    public function postTransaction(Request $request): JsonResponse
    {
        try {
            $payload = $request->getPayload();
            $this->service->postTransaction(
                $this->getUser(),
                $payload->get('targetWallet'),
                (int) $payload->get('mint'),
                (int) $payload->get('setSale'),
                (int) $payload->get('buy'),
                (int) $payload->get('burn'),
                $payload->get('transactionId'),
                $payload->get('txSignature'),
            );

            return $this->json(null);
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }
    }
}
