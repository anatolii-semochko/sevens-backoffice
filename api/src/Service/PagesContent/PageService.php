<?php

namespace App\Service\PagesContent;

use App\Entity\Language;
use App\Entity\PagesContent\Page;
use App\Entity\PagesContent\PageSeo;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Uid\Uuid;

class PageService
{
    public function __construct(
        private EntityManagerInterface $em,
    ) {}

    public function create(array $data): Page
    {
        $page = new Page();
        $page->setId($data['id'] ?? Uuid::v4());
        $page->setUrl($data['url']);

        $this->em->persist($page);
        $this->em->flush();
        
        return $page;
    }

    public function patch(object $page, array $data): void
    {
        if (isset($data['url'])) {
            $page->setUrl($data['url']);
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

                // Check if this Page already has seo for this language
                $existingSeo = null;
                foreach ($page->getSeo() as $existing) {
                    if ($existing->getLanguage()?->getId() === $language->getId()) {
                        $existingSeo = $existing;
                        break;
                    }
                }

                // If SEO exists, update it, otherwise create new
                if (!$existingSeo) {
                    $existingSeo = new PageSeo();
                    $existingSeo->setPage($page);
                    $existingSeo->setLanguage($language);
                    $page->addSeo($existingSeo);
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
    
    public function delete(Object $page): void
    {
        $this->em->remove($page);
        $this->em->flush();
    }
}
