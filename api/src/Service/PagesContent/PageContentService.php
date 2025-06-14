<?php

namespace App\Service\PagesContent;

use App\Entity\Language;
use App\Entity\PagesContent\PageContent;
use App\Entity\PagesContent\PageContentTranslation;
use App\Repository\PagesContent\PageContentRepository;
use App\Repository\PagesContent\PageRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Uid\Uuid;

class PageContentService
{
    public function __construct(
        private EntityManagerInterface $em,
        private PageContentRepository $repository,
        private PageRepository $pageRepository,
    ) {}

    public function fetchByFilter(array $criteria): array
    {
        $allowedFields = ['term', 'pageUrl', 'translation'];
        
        $page = $criteria['page'] ?? 1;
        $limit = $criteria['limit'] ?? 10;
        $offset = ($page - 1) * $limit;

        $qb = $this->repository->createQueryBuilder('e')
            ->leftJoin('e.page', 'p');

        $paramIndex = 0;
        foreach ($criteria as $field => $value) {
            if (in_array($field, ['limit', 'offset', 'sort', 'order'])) {
                continue;
            }

            if (!in_array($field, $allowedFields)) {
                continue;
            }

            if (!empty($value)) {
                $paramName = 'param' . $paramIndex++;
                $likeValue = '%' . $value . '%';

                switch ($field) {
                    case 'pageUrl':
                        $qb->andWhere("p.url LIKE :$paramName");
                        $qb->setParameter($paramName, $likeValue);
                        break;

                    case 'translation':
                        $qb->andWhere(
                            "EXISTS (
                            SELECT 1 FROM App\Entity\PagesContent\PageContentTranslation tr
                            WHERE tr.pageContent = e.id AND tr.translation LIKE :$paramName
                        )"
                        );
                        $qb->setParameter($paramName, $likeValue);
                        break;

                    default:
                        $qb->andWhere("e.$field LIKE :$paramName");
                        $qb->setParameter($paramName, $likeValue);
                        break;
                }
            }
        }

        $qb->setFirstResult($offset)->setMaxResults($limit);
        $items = $qb->getQuery()->getResult();

        // COUNT
        $countQb = $this->repository->createQueryBuilder('e')
            ->select('COUNT(e.id)')
            ->leftJoin('e.page', 'p');

        $paramIndex = 0;
        foreach ($criteria as $field => $value) {
            if (in_array($field, ['limit', 'offset', 'sort', 'order'])) {
                continue;
            }

            if (!in_array($field, $allowedFields)) {
                continue;
            }

            if (!empty($value)) {
                $paramName = 'param' . $paramIndex++;
                $likeValue = '%' . $value . '%';

                switch ($field) {
                    case 'pageUrl':
                        $countQb->andWhere("p.url LIKE :$paramName");
                        $countQb->setParameter($paramName, $likeValue);
                        break;

                    case 'translation':
                        $countQb->andWhere(
                            "EXISTS (
                            SELECT 1 FROM App\Entity\PagesContent\PageContentTranslation tr
                            WHERE tr.pageContent = e.id AND tr.translation LIKE :$paramName
                        )"
                        );
                        $countQb->setParameter($paramName, $likeValue);
                        break;

                    default:
                        $countQb->andWhere("e.$field LIKE :$paramName");
                        $countQb->setParameter($paramName, $likeValue);
                        break;
                }
            }
        }

        $total = $countQb->getQuery()->getSingleScalarResult();

        return [
            'items' => $items,
            'total' => $total,
        ];
    }

    public function create(array $data): PageContent
    {
        $page = $this->pageRepository->find($data['page']['id'] ?? null);
       
        $pageContent = new PageContent();
        $pageContent->setId($data['id'] ?? Uuid::v4());
        $pageContent->setTerm($data['term']);
        $pageContent->setPage($page);
        
        $this->em->persist($pageContent);
        $this->em->flush();

        return $pageContent;
    }

    public function patch(object $pageContent, array $data): void
    {
        $pageContent->setTerm($data['term']);
        $pageContent->setPage(empty($data['page']['id']) ? null : $this->pageRepository->find($data['page']['id']));

        $existingTranslations = $pageContent->getTranslations()->toArray();
        $existingTranslationMap = [];
        foreach ($existingTranslations as $translation) {
            $existingTranslationMap[$translation->getId()] = $translation;
        }

        $incomingIds = [];
        foreach ($data['translations'] as $trData) {
            if (isset($trData['id']) && isset($existingTranslationMap[$trData['id']])) {
                // UPDATE
                $translation = $existingTranslationMap[$trData['id']];
                $translation->setTranslation($trData['translation'] ?? null);
                $incomingIds[] = $translation->getId();
            } else {
                // CREATE
                $language = $this->em->getRepository(Language::class)->find($trData['language']['id']);
                if (!$language) continue;

                $translation = new PageContentTranslation();
                $translation->setPageContent($pageContent);
                $translation->setLanguage($language);
                $translation->setTranslation($trData['translation'] ?? null);
                $this->em->persist($translation);
                $pageContent->addTranslation($translation);
            }
        }

        // REMOVE translations not in request
        foreach ($existingTranslations as $translation) {
            if (!in_array($translation->getId(), $incomingIds)) {
                $pageContent->removeTranslation($translation);
                $this->em->remove($translation);
            }
        }

        $this->em->flush();
    }
    
    public function delete(Object $page): void
    {
        $this->em->remove($page);
        $this->em->flush();
    }
}
