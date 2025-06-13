<?php

namespace App\Service\File;

use Imagick;

class FileService
{
    public const string FILE_DIR = '/shared/';
    public const string CATEGORY_LOGO = 'images/categories/logo';

    public function saveBlobImage(string $filePath, string $fileName, string $blob): string
    {
        $dir = rtrim(self::FILE_DIR . $filePath, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;

        if (!is_dir($dir) && !mkdir($dir, 0755, true) && !is_dir($dir)) {
            throw new \RuntimeException("Couldn't create directory: $dir");
        }

        // Витягнути base64-дані з data:image/...
        if (preg_match('/^data:image\/\w+;base64,/', $blob)) {
            $blob = substr($blob, strpos($blob, ',') + 1);
        } else {
            throw new \InvalidArgumentException('Expected blob format data:image/*;base64,...');
        }

        $binaryData = base64_decode($blob);
        if ($binaryData === false) {
            throw new \RuntimeException('File decoding error base64');
        }

        $image = new Imagick();
        $image->readImageBlob($binaryData);
        $image->setImageFormat('webp');
        $image->setImageCompressionQuality(80);

        // Якщо $fileName вже містить ".webp", не додавати ще раз
        $savedFileName = str_ends_with($fileName, '.webp') ? $fileName : $fileName . '.webp';
        $fullPath = $dir . $savedFileName;

        if (!is_writable($dir)) {
            throw new \RuntimeException("Directory {$dir} is not writable by PHP");
        }
        
        if (!$image->writeImage($fullPath)) {
            throw new \RuntimeException("File saving error $fullPath");
        }

        $image->clear();
        $image->destroy();

        return $savedFileName;
    }

    /**
     * Remove the file with the path
     */
    public function delete(string $filePath, string $fileName): void
    {
        $fullPath = rtrim($filePath, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $fileName;

        if (is_file($fullPath)) {
            @unlink($fullPath);
        }
    }

    public function saveResizedBlobImage(
        string $filePath,
        string $fileName,
        string $blob,
        int $maxWidth,
        int $maxHeight,
    ): string {
        $dir = rtrim(self::FILE_DIR . $filePath, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;

        if (!is_dir($dir) && !mkdir($dir, 0755, true) && !is_dir($dir)) {
            throw new \RuntimeException("Couldn't create directory: $dir");
        }

        if (preg_match('/^data:image\/\w+;base64,/', $blob)) {
            $blob = substr($blob, strpos($blob, ',') + 1);
        } else {
            throw new \InvalidArgumentException('Expected blob format data:image/*;base64,...');
        }

        $binaryData = base64_decode($blob);
        if ($binaryData === false) {
            throw new \RuntimeException('File decoding error base64');
        }

        $image = new Imagick();
        $image->readImageBlob($binaryData);
        $image->setImageFormat('webp');
        $image->setImageCompressionQuality(80);

        $image->thumbnailImage($maxWidth, $maxHeight, true); // зберігає пропорції

        $fullPath = $dir . $fileName;

        if (!is_writable($dir)) {
            throw new \RuntimeException("Directory {$dir} is not writable by PHP");
        }

        if (!$image->writeImage($fullPath)) {
            throw new \RuntimeException("File saving error $fullPath");
        }

        $image->clear();
        $image->destroy();

        return $fileName;
    }
}
