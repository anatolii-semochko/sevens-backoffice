<?php

namespace App\Repository\Help;

use App\Entity\Help\Help;
use App\Exception\NotFoundException;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class HelpRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Help::class);
    }

    public function get(string $id): Object
    {
        $help = $this->find($id);
        if (!$help->getId()) {
            throw new NotFoundException('Help not found');
        }

        return $help;
    }

//    public function save(Help $entity, bool $flush = false): void
//    {
//        $this->getEntityManager()->persist($entity);
//        if ($flush) {
//            $this->getEntityManager()->flush();
//        }
//    }
//
//    public function remove(Help $entity, bool $flush = false): void
//    {
//        $this->getEntityManager()->remove($entity);
//        if ($flush) {
//            $this->getEntityManager()->flush();
//        }
//    }

    // Додаткові методи запиту за потреби...
}
