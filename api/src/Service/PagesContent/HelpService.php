<?php

namespace App\Service\PagesContent;

use App\Entity\Help\Help;
use App\Entity\Help\HelpContent;
use App\Entity\Language;
use App\Repository\Help\HelpRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Uid\Uuid;

class HelpService
{
    public function __construct(
        private EntityManagerInterface $em,
        private HelpRepository $repository,
    ) {}

    public function fetchByFilter(array $criteria): array
    {
        if (!empty($criteria['parentId'])) {
            $criteria['parentId'] = $criteria['parentId'] === 'root' ? null : $criteria['parentId'];
        }

        return $this->repository->findBy($criteria, ['order' => 'ASC']);
    }
    

    public function create(array $data): Help
    {
        $help = new Help();
        $help->setId($data['id'] ?? Uuid::v4());
        $help->setUrl($data['url']);

        $this->em->persist($help);
        $this->em->flush();
        
        return $help;
    }

    public function patch(object $help, array $data): void
    {
        if (isset($data['url'])) {
            $help->setUrl($data['url']);
        }

        if (isset($data['seo']) && is_array($data['seo'])) {
            foreach ($data['seo'] as $seoData) {
                if (empty($seoData['language']['id'])) {
                    continue;
                }

                $language = $this->em->getRepository(Language::class)->find($seoData['language']['id']);
                if (!$language) {
                    continue; // unknown language
                }

                // Check if this $help already has seo for this language
                $existingSeo = null;
                foreach ($help->getSeo() as $existing) {
                    if ($existing->getLanguage()?->getId() === $language->getId()) {
                        $existingSeo = $existing;
                        break;
                    }
                }

                // If SEO exists, update it, otherwise create new
                if (!$existingSeo) {
                    $existingSeo = new HelpContent();
                    $existingSeo->setPage($help);
                    $existingSeo->setLanguage($language);
                    $help->addSeo($existingSeo);
                    $this->em->persist($existingSeo);
                }

                if (isset($seoData['breadcrumbs'])) {
                    $existingSeo->setBreadcrumbs($seoData['breadcrumbs']);
                }
                if (isset($seoData['title'])) {
                    $existingSeo->setTitle($seoData['title']);
                }
                if (isset($seoData['keywords'])) {
                    $existingSeo->setKeywords($seoData['keywords']);
                }
                if (isset($seoData['description'])) {
                    $existingSeo->setDescription($seoData['description']);
                }
            }
        }

        $this->em->flush();
    }
    
    public function delete(Object $help): void
    {
        $this->em->remove($help);
        $this->em->flush();
    }
}
