<?php

declare(strict_types=1);

namespace App\Controller;

use App\Service\TokenManageService;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/token-manage')]
#[IsGranted('ROLE_ADMIN')]
class TokenManageController extends BaseController
{
    public const array MANAGE_TRANSACTION_GROUPS = [
        'groups' => [
            'manage-transaction:read',
            'user:read',
        ]
    ];

    public function __construct(
        private readonly TokenManageService $service,
    ) {}

    #[Route('/transactions', name: 'token_manage_transactions_fetch', methods: ['GET'])]
    public function getTransactions(Request $request): JsonResponse
    {
        try {
            return $this->json(
                $this->service->fetchByFilter($request->query->all() ?? []),
                context: self::MANAGE_TRANSACTION_GROUPS
            );
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }
    }
}
