<?php

namespace App\Repository\PagesContent;

use App\Entity\PagesContent\Page;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class PageRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Page::class);
    }
    
    public function findOneByTerm(string $term): ?Page
    {
        return $this->createQueryBuilder('p')
            ->where('p.term = :term')
            ->setParameter('term', $term)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
