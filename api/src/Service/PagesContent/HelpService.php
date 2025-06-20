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
        $help->setUrl($data['url'] ?: null);
        $help->setOrder($data['order']);

        $this->em->persist($help);
        $this->em->flush();

        $this->indexHelps();
        
        return $help;
    }

    public function put(object $help, array $data): void
    {
        $help->setName($data['name']);
        $help->setUrl($data['url'] ?: null);

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

        $this->indexHelps();
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

    public function indexHelps(): int
    {
        // 1. Завантаження всіх Help-розділів
        $qb = $this->em->createQueryBuilder()
            ->select('h')
            ->from(Help::class, 'h');

        /** @var Help[] $allHelps */
        $allHelps = $qb->getQuery()->getResult();

        // 2. Побудова дерева
        $helps = [];
        foreach ($allHelps as $help) {
            $helps[$help->getId()] = $help;
        }

        // 3. Обнулення індексованих полів
        foreach ($helps as $help) {
            $help->setChildrenData(null);
            $help->setChildrenInside(null);
            $help->setPath(null);
            $help->setParents(null);
        }

        // 4. Індексація
        foreach ($helps as $help) {
            $id = $help->getId();
            $parentId = $help->getParentId();

            $parents = [];
            $path = [];
            $currentParentId = $parentId;

            // Побудова ланцюжка батьків
            while ($currentParentId && isset($helps[$currentParentId])) {
                $parent = $helps[$currentParentId];
                $parents[] = $currentParentId;
                $path[] = [
                    'id' => $parent->getId(),
                    'url' => $parent->getUrl(),
                    'name' => $parent->getName(),
                ];
                $currentParentId = $parent->getParentId();
            }

            // Запис батьків
            $help->setParents($parents ? implode(',', array_reverse($parents)) : null);
            $help->setPath($path ? json_encode(array_reverse($path), JSON_UNESCAPED_UNICODE) : null);
            $help->setLevel(count($parents) + 1);

            // Заповнення childrenData
            foreach ($helps as $child) {
                if ($child->getParentId() === $id) {
                    $currentChildren = array_filter(explode(',', $help->getChildrenData() ?? ''));
                    $currentChildren[] = $child->getId();
                    $help->setChildrenData(implode(',', array_unique($currentChildren)));
                }
            }

            // Заповнення childrenInside (усі нащадки)
            $ancestorId = $help->getParentId();
            while ($ancestorId && isset($helps[$ancestorId])) {
                $ancestor = $helps[$ancestorId];
                $inside = array_filter(explode(',', $ancestor->getChildrenInside() ?? ''));
                $inside[] = $help->getId();
                $ancestor->setChildrenInside(implode(',', array_unique($inside)));
                $ancestorId = $ancestor->getParentId();
            }
        }

        // 5. Збереження
        foreach ($helps as $help) {
            $this->em->persist($help);
        }

        $this->em->flush();

        return count($helps);
    }
}
