<?php

namespace App\Controller;

use App\Entity\User\User;
use App\Repository\UserRepository;
use App\Service\UserService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;

#[Route('/users')]
class UserController extends BaseController
{
    public const array USER_GROUPS = ['groups' => 'user:read'];

    public function __construct(
        private readonly EntityManagerInterface $em, //////////////////// TODO - MOVE TO SERVICE !!!!!!!!!!!!!!!!!!!!!!!!!
        private readonly JWTTokenManagerInterface $jwtManager,
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

    #[Route('/roles-list', name: 'user_roles_list', methods: ['GET'])]
    public function roles(): JsonResponse
    {
        return $this->json(User::ROLES, context: self::USER_GROUPS);
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

    #[Route('/login', name: 'user_login', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        $data = $this->getData($request);
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;
        if (!$email || !$password) {
            throw new BadRequestException('Email and password required');
        }

        $user = $this->repository->findOneBy(['email' => $email]);
        if (!$user || !password_verify($password, $user->getPasswordHash())) {
            throw new BadRequestException('Invalid credentials');
        }

        $user->setAuthorized(true);
        $user->setLastActivityAt(new \DateTimeImmutable());
        $this->em->flush();

        $token = $this->jwtManager->create($user);

        return $this->json(['token' => $token]);
    }

    #[Route('/logout', name: 'user_logout', methods: ['POST'])]
    public function logout(): JsonResponse
    {
        $user = $this->getUser();
        if ($user instanceof \App\Entity\User\User) {
            $user->setAuthorized(false);
            $this->em->flush();
        }

        return $this->json(null);
    }
}
