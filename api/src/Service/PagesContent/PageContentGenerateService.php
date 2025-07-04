<?php

namespace App\Service\PagesContent;

use App\Repository\LanguageRepository;
use Doctrine\ORM\EntityManagerInterface;

readonly class PageContentGenerateService
{
    public function __construct(
        private EntityManagerInterface $em,
        private LanguageRepository $languageRepository,
    ) {}

    public function generate(): string
    {
        $languages = $this->languageRepository->findAll();
        $count = count($languages);

        return "Generated $count files";
    }
}
