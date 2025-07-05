<?php

namespace App\Repository\PagesContent;

use App\Entity\PagesContent\PageContentTranslation;
use App\Exception\NotFoundException;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<PageContentTranslation>
 */
class PageContentTranslationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PageContentTranslation::class);
    }

    public function get(string $id): PageContentTranslation
    {
        $term = $this->find($id);
        if (!$term->getId()) {
            throw new NotFoundException('Term translation not found');
        }

        return $term;
    }
}
