<?php

namespace App\Controller;

use App\Repository\UserRepository;
use App\Service\UserService;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/users')]
class UserController extends BaseController
{
    public const array USER_GROUPS = ['groups' => 'user:read'];

    public function __construct(
        private UserRepository $repository,
        private UserService $service,
    ) {}

    #[Route('', name: 'user_fetch', methods: ['GET'])]
    public function fetch(Request $request): JsonResponse
    {
        try {
            $criteria = $request->query->all() ?? [];
            $users = $this->repository->findBy($criteria, ['email' => 'ASC']);
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json($users, context: self::USER_GROUPS);
    }

    #[Route('/{id}', name: 'user_get', methods: ['GET'])]
    public function get(string $id): JsonResponse
    {
        try {
            $user = $this->repository->get($id);
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json($user, context: self::USER_GROUPS);
    }

    #[Route('', name: 'user_post', methods: ['POST'])]
    public function post(Request $request): JsonResponse
    {
        try {
            $this->service->create($this->getData($request));
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json(null);
    }

    #[Route('/{id}', name: 'user_put', methods: ['PUT'])]
    public function put(string $id, Request $request): JsonResponse
    {
        try {
            $this->service->save($this->repository->get($id), $this->getData($request));
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json(null);
    }

    #[Route('/{id}', name: 'user_patch', methods: ['PATCH'])]
    public function patch(string $id, Request $request): JsonResponse
    {
        try {
            $this->service->patch($this->repository->get($id), $this->getData($request));
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json(null);
    }

    #[Route('/{id}', name: 'user_delete', methods: ['DELETE'])]
    public function delete(string $id): JsonResponse
    {
        try {
            $this->service->delete($this->repository->get($id));
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json(null);
    }
}
