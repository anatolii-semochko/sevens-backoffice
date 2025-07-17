<?php

namespace App\Controller;

use App\Entity\User\User;
use App\Entity\User\UserConstants;
use App\Repository\UserRepository;
use App\Service\User\AuthService;
use App\Service\User\UserService;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/users')]
class UserController extends BaseController
{
    public const array USER_GROUPS = ['groups' => 'user:read'];

    public function __construct(
        private readonly AuthService $authService,
        private readonly UserService $service,
        private readonly UserRepository $repository,
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

    #[Route('/me', name: 'user_me', methods: ['GET'])]
    public function me(): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            throw new BadRequestException('User not found');
        }

        return $this->json($user, context: self::USER_GROUPS);
    }

    #[Route('/user-profile', name: 'user_profile_patch', methods: ['PATCH'])]
    public function myProfile(Request $request): JsonResponse
    {
        try {
            $this->service->saveMyProfile(
                $this->getUser()->getId(),
                $this->getData($request),
            );
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json(null);
    }

    #[Route('/roles-list', name: 'user_roles_list', methods: ['GET'])]
    public function roles(): JsonResponse
    {
        return $this->json(UserConstants::ROLES, context: self::USER_GROUPS);
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
    #[IsGranted('ROLE_SUPER_ADMIN')]
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
    #[IsGranted('ROLE_SUPER_ADMIN')]
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
    #[IsGranted('ROLE_SUPER_ADMIN')]
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
    #[IsGranted('ROLE_SUPER_ADMIN')]
    public function delete(string $id): JsonResponse
    {
        try {
            $this->service->delete($this->repository->get($id));
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json(null);
    }

    #[Route('/login', name: 'user_login', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        try {
            $data = $this->getData($request);
            $token = $this->authService->login(
                $data['login'] ?? $data['email'] ?? null,
                $data['password'] ?? null,
            );
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json(['token' => $token]);
    }

    #[Route('/logout', name: 'user_logout', methods: ['POST'])]
    public function logout(): JsonResponse
    {
        try {
            $this->authService->logout($this->getUser());
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json(null);
    }
}
