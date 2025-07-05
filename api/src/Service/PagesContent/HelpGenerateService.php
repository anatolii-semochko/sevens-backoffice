<?php

namespace App\Service\PagesContent;

use App\Repository\Help\HelpContentRepository;
use App\Repository\Help\HelpRepository;
use App\Repository\LanguageRepository;

readonly class HelpGenerateService
{
    public function __construct(
        private string $helpTranslationsFolder,
        private LanguageRepository $languageRepository,
        private HelpRepository $helpRepository,
        private HelpContentRepository $helpContentRepository,
    ) {}

    public function generate(): string
    {
        $helps = $this->helpRepository->findAll();
        $languages = $this->languageRepository->findAll();

        foreach ($languages as $language) {
            $data = [];
            $locale = $language->getCode();
            foreach ($helps as $help) {
                $helpContent = $this->helpContentRepository->findOneBy([
                    'language' => $language,
                    'help' => $help,
                ]);
                $data[$help->getName()] = [
                    'pageUrl' => $help->getPageUrl(),
                    'title' => $helpContent?->getTitle(),
                    'shortDescription' => $helpContent?->getShortDescription(),
                ];
            }
            $this->saveFile($locale, $data);
        }

        return 'Generated ' . count($languages) . ' files';
    }

    private function saveFile(string $locale, array $data): void
    {
        $filePath = $this->helpTranslationsFolder . DIRECTORY_SEPARATOR . "help.{$locale}.json";
        if (file_exists($filePath)) {
            unlink($filePath);
        }
        file_put_contents($filePath, json_encode($data));
    }
}
