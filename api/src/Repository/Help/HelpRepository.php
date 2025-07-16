<?php

namespace App\Repository\Help;

use App\Entity\Help\Help;
use App\Exception\NotFoundException;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Help>
 */
class HelpRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Help::class);
    }

    public function fetchByFilter(array $criteria): array
    {
        $qb = $this->createQueryBuilder('h');

        foreach ($criteria as $field => $value) {
            if ($field === 'parent') {
                if ($value === null) {
                    $qb->andWhere('h.parentId IS NULL');
                } else {
                    $qb->andWhere('h.parentId = :parent')
                        ->setParameter('parent', $value);
                }
            } else {
                $qb->andWhere("h.$field = :$field")
                    ->setParameter($field, $value);
            }
        }

        $qb->addOrderBy("CASE WHEN h.url IS NULL OR h.url = '' THEN 1 ELSE 0 END", 'ASC')
            ->addOrderBy("CASE WHEN h.url IS NULL OR h.url = '' THEN 999999 ELSE h.order END", 'ASC')
            ->addOrderBy("CASE WHEN h.url IS NULL OR h.url = '' THEN h.name ELSE '' END", 'ASC');

        return $qb->getQuery()->getResult();
    }

    public function get(string $id): Help
    {
        $help = $this->find($id);
        if (!$help->getId()) {
            throw new NotFoundException('Help not found');
        }

        return $help;
    }
}
