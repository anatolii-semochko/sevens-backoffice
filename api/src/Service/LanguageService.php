<?php

namespace App\Service;

use App\Entity\Language;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Uid\Uuid;

class LanguageService
{
    public function __construct(
        private EntityManagerInterface $em,
    ) {}

    public function create(array $data): Language
    {
        $language = new Language();
        $language->setId($data['id'] ?? Uuid::v4());
        $language->setCode($data['code']);
        $language->setName($data['name']);
        $language->setActive($data['active'] ?? true);
        $language->setMain($data['main'] ?? false);
        $language->setOrder($data['order']);

        $this->em->persist($language);
        $this->em->flush();
        
        return $language;
    }

    public function save(Object $language, array $data): void
    {
        $language->setCode($data['code']);
        $language->setName($data['name']);
        $language->setActive($data['active']);
        $language->setMain($data['main']);
        $language->setOrder($data['order']);

        $this->em->flush();
    }

    public function patch(Object $language, array $data): void
    {
        foreach ($data as $key => $value) {
            $setter = 'set' . ucfirst($key);
            if (method_exists($language, $setter)) {
                $language->$setter($value);
            }
        }

        $this->em->flush();
    }
    
    public function delete(Object $language): void
    {
        $this->em->remove($language);
        $this->em->flush();
    }
    
    public function swapOrder(Object $currentLanguage, Object $swapLanguage): void
    {
        $currentOrder = $currentLanguage->getOrder();
        $swapOrder = $swapLanguage->getOrder();
        $currentLanguage->setOrder(0);
        $this->em->flush();
        $swapLanguage->setOrder($currentOrder);
        $this->em->flush();
        $currentLanguage->setOrder($swapOrder);
        $this->em->flush();
    }
}
