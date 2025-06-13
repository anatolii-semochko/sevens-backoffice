<?php
namespace App\Service\File;

use Exception;
use Symfony\Component\HttpFoundation\File\Exception\FileException;

class LogoService
{
    public const array LOGO_SIZES = [
        'small' => [30, 30],
        'medium' => [120, 120],
        'large' => [500, 500],
    ];

    public function __construct(
        private FileService $fileService,
    ) {}

    /**
     * @throws Exception
     */
    public function saveLogo(string $logoPath, string $id, ?string $currentValue, $blob): ?string
    {
        if ($blob === $currentValue) {
            return $currentValue;
        }

        $ext = 'webp';
        try {
            if ($blob) {
                // Створення унікального імені без розширення
                $uuid = $id . substr(md5(uniqid((string) microtime(), true)), 0, 6);

                // Збереження файлів різних розмірів
                foreach (self::LOGO_SIZES as $label => [$maxWidth, $maxHeight]) {
                    $fileName = "{$label}-{$uuid}.{$ext}";
                    $this->fileService->saveResizedBlobImage(FileService::CATEGORY_LOGO, $fileName, $blob, $maxWidth, $maxHeight);
                }

                return "{$uuid}.{$ext}";
            } else {
                // Видалення старих файлів
                if ($currentValue) {
                    foreach (array_keys(self::LOGO_SIZES) as $label) {
                        $fileName = "{$label}-{$currentValue}.{$ext}";
                        $this->fileService->delete(FileService::CATEGORY_LOGO, $fileName);
                    }
                }
                return null;
            }
        } catch (FileException $e) {
            throw new Exception($e->getMessage());
        }
    }
}
