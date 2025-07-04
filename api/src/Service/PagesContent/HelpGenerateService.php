<?php

namespace App\Service\PagesContent;

use App\Repository\LanguageRepository;
use App\Service\LanguageService;
use Doctrine\ORM\EntityManagerInterface;

readonly class HelpGenerateService
{
    public function __construct(
        private EntityManagerInterface $em,
        private LanguageService $languageService,
        private LanguageRepository $languageRepository,
    ) {}

    public function generate(): string
    {
        $languages = $this->languageRepository->findAll();
        $count = count($languages);

        return "Generated $count files";
    }
}
