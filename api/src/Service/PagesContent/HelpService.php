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
        $help->setParentId($data['parentId']);
        $help->setName($data['name']);
        $help->setUrl($data['url']);
        $help->setOrder($data['order']);

        $this->em->persist($help);
        $this->em->flush();
        
        return $help;
    }

    public function put(object $help, array $data): void
    {
        $help->setName($data['name']);
        $help->setUrl($data['url']);

        if (isset($data['contents']) && is_array($data['contents'])) {
            foreach ($data['contents'] as $content) {
                if (empty($content['language']['id'])) {
                    continue;
                }

                $language = $this->em->getRepository(Language::class)->find($content['language']['id']);
                if (!$language) {
                    continue; // unknown language
                }

                // Check if this $help already has seo for this language
                $existingContent = null;
                foreach ($help->getContents() as $existing) {
                    if ($existing->getLanguage()?->getId() === $language->getId()) {
                        $existingContent = $existing;
                        break;
                    }
                }

                // If SEO exists, update it, otherwise create new
                if (!$existingContent) {
                    $existingContent = new HelpContent();
                    $existingContent->setHelp($help);
                    $existingContent->setLanguage($language);
                    $help->addContent($existingContent);
                    $this->em->persist($existingContent);
                }

                if (isset($content['title'])) {
                    $existingContent->setTitle($content['title']);
                }
                if (isset($content['seoKeywords'])) {
                    $existingContent->setSeoKeywords($content['seoKeywords']);
                }
                if (isset($content['seoDescription'])) {
                    $existingContent->setSeoDescription($content['seoDescription']);
                }
                if (isset($content['shortDescription'])) {
                    $existingContent->setShortDescription($content['shortDescription']);
                }
                if (isset($content['description'])) {
                    $existingContent->setDescription($content['description']);
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
    
    public function swapHelp(Object $currentHelp, Object $swapHelp): void
    {
        $currentOrder = $currentHelp->getOrder();
        $swapOrder = $swapHelp->getOrder();
        $currentHelp->setOrder(0);
        $this->em->flush();
        $swapHelp->setOrder($currentOrder);
        $this->em->flush();
        $currentHelp->setOrder($swapOrder);
        $this->em->flush();
    }
}
