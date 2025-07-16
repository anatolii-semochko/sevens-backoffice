<?php

namespace App\Service\PagesContent;

use App\Entity\Help\Help;
use App\Entity\Help\HelpContent;
use App\Entity\Language;
use App\Repository\Help\HelpRepository;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Component\Uid\Uuid;

readonly class HelpService
{
    public function __construct(
        private EntityManagerInterface $em,
        private HelpRepository $repository,
    ) {}

    public function fetchByFilter(array $criteria): array
    {
        if (array_key_exists('parentId', $criteria)) {
            $criteria['parent'] = $criteria['parentId'] === 'root' ? null : $criteria['parentId'];
            unset($criteria['parentId']);
        }

        return $this->repository->fetchByFilter($criteria);
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

    /**
     * @throws Exception
     */
    public function put(Help $help, array $data): void
    {
        $help->setName($data['name']);
        $help->setUrl($data['url'] ?: null);

        if ($help->getChildrenData() && !$help->getUrl()) {
            throw new \Exception('Help must have url if it has children');
        }

        if (isset($data['contents']) && is_array($data['contents'])) {
            foreach ($data['contents'] as $content) {
                if (empty($content['language']['id'])) {
                    continue;
                }

                $language = $this->em->getRepository(Language::class)->find($content['language']['id']);
                if (!$language) {
                    continue;
                }

                $existingContent = null;
                foreach ($help->getContents() as $existing) {
                    if ($existing->getLanguage()?->getId() === $language->getId()) {
                        $existingContent = $existing;
                        break;
                    }
                }

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

    public function delete(Help $help): void
    {
        $this->em->remove($help);
        $this->em->flush();
    }

    public function swapHelp(Help $currentHelp, Help $swapHelp): void
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
        $qb = $this->em->createQueryBuilder()
            ->select('h')
            ->from(Help::class, 'h');

        /** @var Help[] $allHelps */
        $allHelps = $qb->getQuery()->getResult();

        $helps = [];
        foreach ($allHelps as $help) {
            $helps[$help->getId()] = $help;
        }

        foreach ($helps as $help) {
            $help->setChildrenData(null);
            $help->setChildrenInside(null);
            $help->setPath(null);
            $help->setParents(null);
        }

        foreach ($helps as $help) {
            $id = $help->getId();
            $parentId = $help->getParentId();

            $parents = [];
            $path = [];
            $currentParentId = $parentId;

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

            $help->setParents($parents ? implode(',', array_reverse($parents)) : null);
            $help->setPath($path ? json_encode(array_reverse($path), JSON_UNESCAPED_UNICODE) : null);
            $help->setLevel(count($parents) + 1);

            foreach ($helps as $child) {
                if ($child->getParentId() === $id) {
                    $currentChildren = array_filter(explode(',', $help->getChildrenData() ?? ''));
                    $currentChildren[] = $child->getId();
                    $help->setChildrenData(implode(',', array_unique($currentChildren)));
                }
            }

            $ancestorId = $help->getParentId();
            while ($ancestorId && isset($helps[$ancestorId])) {
                $ancestor = $helps[$ancestorId];
                $inside = array_filter(explode(',', $ancestor->getChildrenInside() ?? ''));
                $inside[] = $help->getId();
                $ancestor->setChildrenInside(implode(',', array_unique($inside)));
                $ancestorId = $ancestor->getParentId();
            }
        }

        foreach ($helps as $help) {
            $this->em->persist($help);
        }

        $this->em->flush();

        return count($helps);
    }
}
