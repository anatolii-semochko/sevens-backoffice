<?php

namespace App\Repository;

use App\Entity\User\User;
use App\Exception\NotFoundException;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\NonUniqueResultException;

/**
 * @extends ServiceEntityRepository<User>
 */
class UserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    public function get(string $id): User
    {
        $user = $this->find($id);
        if (!$user) {
            throw new NotFoundException('User not found');
        }

        return $user;
    }

    /**
     * Find a user by email or username.
     */
    public function findByLogin(string $login): ?User
    {
        $login = trim($login);
        if ($login === '') {
            return null;
        }

        try {
            return $this->createQueryBuilder('u')
                ->andWhere('u.email = :login OR u.userName = :login')
                ->setParameter('login', $login)
                ->getQuery()
                ->getOneOrNullResult();
        } catch (NonUniqueResultException $e) {
            return null;
        }
    }
}
