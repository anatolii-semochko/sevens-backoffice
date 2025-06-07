<?php

namespace App\Repository\PagesContent;

use App\Entity\PagesContent\PageContent;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class PageContentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PageContent::class);
    }

    public function findByPage(int $pageId): ?PageContent
    {
        return $this->createQueryBuilder('pc')
            ->where('pc.page = :pageId')
            ->setParameter('pageId', $pageId)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
