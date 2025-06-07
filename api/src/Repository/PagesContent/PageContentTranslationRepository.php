<?php

namespace App\Repository\PagesContent;

use App\Entity\PagesContent\PageContentTranslation;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class PageContentTranslationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PageContentTranslation::class);
    }

    public function findTranslation(int $pageContentId, int $languageId): ?PageContentTranslation
    {
        return $this->createQueryBuilder('pct')
            ->where('pct.pageContent = :pageContentId')
            ->andWhere('pct.language = :languageId')
            ->setParameter('pageContentId', $pageContentId)
            ->setParameter('languageId', $languageId)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findAllTranslationsForPageContent(int $pageContentId): array
    {
        return $this->createQueryBuilder('pct')
            ->where('pct.pageContent = :pageContentId')
            ->setParameter('pageContentId', $pageContentId)
            ->getQuery()
            ->getResult();
    }
}
