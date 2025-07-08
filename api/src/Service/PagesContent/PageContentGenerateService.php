<?php

namespace App\Service\PagesContent;

use App\Repository\LanguageRepository;
use App\Repository\PagesContent\PageContentRepository;
use App\Repository\PagesContent\PageContentTranslationRepository;

readonly class PageContentGenerateService
{
    public function __construct(
        private PageContentRepository $pageContentRepository,
        private PageContentTranslationRepository $pageContentTranslationRepository,
        private LanguageRepository $languageRepository,
    ) {}

    public function generate(): string
    {
        $languages = $this->languageRepository->findAll();
        $pageContents = $this->pageContentRepository->findAll();

        $data = [];
        foreach ($pageContents as $pageContent) {
            foreach ($languages as $language) {
                $locale = $language->getCode();

                if (!isset($data[$locale])) {
                    $data[$locale] = [];
                }
                $pageContentTranslation = $this->pageContentTranslationRepository->findOneBy([
                    'language' => $language,
                    'pageContent' => $pageContent,
                ]);
                $data[$locale][] = [
                    'term' => $pageContent->getTerm(),
                    'url' => $pageContent->getPage()?->getUrl(),
                    'translation' => $pageContentTranslation?->getTranslation() ?? $pageContent->getTerm(),
                ];
            }
        }
        $count = count($data);

        return "Generated $count files";
    }
}
