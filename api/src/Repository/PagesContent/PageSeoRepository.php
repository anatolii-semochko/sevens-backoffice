<?php

namespace App\Repository\PagesContent;

use App\Entity\PagesContent\PageSeo;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class PageSeoRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PageSeo::class);
    }

    public function findSeo(int $pageId, int $languageId): ?PageSeo
    {
        return $this->createQueryBuilder('seo')
            ->where('seo.page = :pageId')
            ->andWhere('seo.language = :languageId')
            ->setParameter('pageId', $pageId)
            ->setParameter('languageId', $languageId)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
