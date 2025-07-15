<?php

namespace App\Service\User;

use App\Entity\User\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;

readonly class AuthService
{
    public function __construct(
        private EntityManagerInterface $em,
        private JWTTokenManagerInterface $jwtManager,
        private UserRepository $repository,
    ) {}

    public function login(?string $login, ?string $password): string
    {
        $login = trim($login);
        $password = trim($password);

        if (!$login) {
            throw new BadRequestException('Login is required');
        }

        if (!$password) {
            throw new BadRequestException('Password required');
        }

        $user = $this->repository->findByLogin($login);
        if (!$user || !password_verify($password, $user->getPasswordHash())) {
            throw new BadRequestException('Invalid credentials');
        }

        if (!$user->isActive()) {
            throw new BadRequestException('User account is inactive');
        }

        $user->setAuthorized(true);
        $user->setLastActivityAt(new \DateTimeImmutable());
        $this->em->flush();

        return $this->jwtManager->create($user);
    }

    public function logout(?User $user): void
    {
        if ($user instanceof User) {
            $user->setAuthorized(false);
            $this->em->flush();
        }
    }
}
