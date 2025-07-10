<?php

namespace App\Repository;

use App\Entity\User\User;
use App\Exception\NotFoundException;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class UserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    public function get(string $id): object
    {
        $user = $this->find($id);
        if (!$user) {
            throw new NotFoundException('User not found');
        }

        return $user;
    }
}
