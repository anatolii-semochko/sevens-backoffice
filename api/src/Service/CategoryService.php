<?php

namespace App\Service;

use App\Entity\Category\Category;
use App\Entity\Category\CategoryLanguages;
use App\Entity\Language;
use App\Repository\CategoryRepository;
use App\Service\File\FileService;
use App\Service\File\LogoService;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Component\Uid\Uuid;

class CategoryService
{
    public function __construct(
        private EntityManagerInterface $em,
        private CategoryRepository $repository,
        private LogoService $logoService,
    ) {}
    
    public function fetchByFilter(array $criteria): array
    {
        if (!empty($criteria['parentId'])) {
            $criteria['parentId'] = $criteria['parentId'] === 'root' ? null : $criteria['parentId'];
        }
        
        return $this->repository->findBy($criteria, ['order' => 'ASC']);
    }

    /**
     * @throws Exception
     */
    public function create(array $data): Category
    {
        // TODO Пофіксати перевірку, чи можна створити
        // TODO сворити метод валідації для create nd patch
        $exists = $this->em->getRepository(Category::class)->findOneBy([
            'name' => $data['name'],
            'parentId' => $data['parentId'] ?? null,
        ]);
        if ($exists) {
            throw new \RuntimeException('Category with the same name and parent already exists.');
        }
        // TODO Дана перевірка невірна

        $category = new Category();
        $category->setId(Uuid::v4()->toRfc4122());
        $category->setUrl($data['url']);
        $category->setParentId($data['parentId'] ?? null);
        $category->setName($data['name']);
        $category->setOrder($data['order']);
        $this->em->persist($category);
        $this->em->flush();

        $this->indexCategories();

        if (!empty($data['logo'])) {
            $category->setLogo(
                $this->logoService->saveLogo(
                    FileService::CATEGORY_LOGO,
                    $category->getId(),
                    $category->getLogo(),
                    $data['logo'],
                ),
            );
            $this->em->persist($category);
            $this->em->flush();
        }
        
        return $category;
    }

    public function patch(object $category, array $data): void
    {
        // TODO - організувати правильний patch
        if (isset($data['active'])) {
            $category->setActive($data['active']);
            $this->em->persist($category);
            $this->em->flush();
        }
    }
    

    public function put(object $category, array $data): void
    {
        $category->setUrl($data['url']);
        $category->setParentId($data['parentId']);
        $category->setName($data['name']);

        $existingTranslations = $category->getTranslations()->toArray();
        $existingTranslationMap = [];
        foreach ($existingTranslations as $translation) {
            $existingTranslationMap[$translation->getId()] = $translation;
        }

        $incomingIds = [];
        foreach ($data['translations'] as $trData) {
            if (isset($trData['id']) && isset($existingTranslationMap[$trData['id']])) {
                // UPDATE
                $translation = $existingTranslationMap[$trData['id']];
                $translation->setName($trData['name'] ?? '');
                $translation->setTitle($trData['title'] ?? '');
                $translation->setLogoAlt($trData['logoAlt'] ?? '');
                $translation->setShortDescription($trData['shortDescription'] ?? '');
                $translation->setDescription($trData['description'] ?? '');
                $incomingIds[] = $translation->getId();
            } else {
                // CREATE
                $language = $this->em->getRepository(Language::class)->find($trData['language']['id']);
                if (!$language) continue;

                $translation = new CategoryLanguages();
                $translation->setCategory($category);
                $translation->setLanguage($language);
                $translation->setName($trData['name'] ?? '');
                $translation->setTitle($trData['title'] ?? '');
                $translation->setLogoAlt($trData['logoAlt'] ?? '');
                $translation->setShortDescription($trData['shortDescription'] ?? '');
                $translation->setDescription($trData['description'] ?? '');

                $this->em->persist($translation);
                $category->addTranslation($translation);
            }
        }

        // REMOVE translations not in request
        foreach ($existingTranslations as $translation) {
            if (!in_array($translation->getId(), $incomingIds)) {
                $category->removeTranslation($translation);
                $this->em->remove($translation);
            }
        }
        
        $this->em->persist($category);
        $this->em->flush();
        
        $this->indexCategories();
        
        $category->setLogo(
            $this->logoService->saveLogo(
                FileService::CATEGORY_LOGO,
                $category->getId(),
                $category->getLogo(),
                $data['logo'],
            ),
        );
        $this->em->persist($category);
        $this->em->flush();
    }

    public function swapCategory(Object $currentCategory, Object $swapCategory): void
    {
        $currentOrder = $currentCategory->getOrder();
        $swapOrder = $swapCategory->getOrder();
        $currentCategory->setOrder(0);
        $this->em->flush();
        $swapCategory->setOrder($currentOrder);
        $this->em->flush();
        $currentCategory->setOrder($swapOrder);
        $this->em->flush();
    }
    
    public function delete(Object $page): void
    {
        $this->em->remove($page);
        $this->em->flush();
    }

    public function indexCategories(?string $filterMainParentId = null): int
    {
        // 1. Завантаження всіх категорій (можна додати фільтр)
        $qb = $this->em->createQueryBuilder()
            ->select('c')
            ->from(Category::class, 'c');

        if ($filterMainParentId) {
            $qb->where('c.mainParentId = :mainParentId')
                ->setParameter('mainParentId', $filterMainParentId);
        }

        /** @var Category[] $allCategories */
        $allCategories = $qb->getQuery()->getResult();

        // 2. Побудова дерева для зручності
        $categories = [];
        foreach ($allCategories as $cat) {
            $categories[$cat->getId()] = $cat;
        }

        foreach ($categories as $id => $category) {
            $category->setChildren(null);
            $category->setChildrenInside(null);
            $category->setPath(null);
            $category->setParents(null);
        }

        // 3. Розрахунок залежностей
        foreach ($categories as $category) {
            $id = $category->getId();
            $parentId = $category->getParentId();

            $parents = [];
            $path = [];
            $currentParentId = $parentId;
            $mainParentId = null;

            // Побудова ланцюжка батьків
            while ($currentParentId && isset($categories[$currentParentId])) {
                $parent = $categories[$currentParentId];
                $parents[] = $currentParentId;
                $path[] = [
                    'id' => $parent->getId(),
                    'url' => $parent->getUrl(),
                    'name' => $parent->getName(),
                ];
                $mainParentId = $parent->getId();
                $currentParentId = $parent->getParentId();
            }

            // Основна батьківська категорія
            if (!$mainParentId) {
                $mainParentId = $id;
            }

            $category->setMainParentId($mainParentId);

            $parents = array_reverse($parents);
            $category->setParents(implode(',', $parents));
            $category->setPath(json_encode($path, JSON_UNESCAPED_UNICODE));

            // Activity parent
            if (count($parents) === 1) {
                $category->setActivityParentId($category->getId());
            } elseif (count($parents) > 1) {
                $category->setActivityParentId($parents[1]);
            } else {
                $category->setActivityParentId(null);
            }

            // Заповнення children
            foreach ($categories as $c) {
                if ($c->getParentId() === $category->getId()) {
                    $currentChildren = array_filter(explode(',', $category->getChildren() ?? ''));
                    $currentChildren[] = $c->getId();
                    $category->setChildren(implode(',', array_unique($currentChildren)));
                }
            }

            // Заповнення children_inside
            $ancestorId = $category->getParentId();
            while ($ancestorId && isset($categories[$ancestorId])) {
                $ancestor = $categories[$ancestorId];
                $childrenInside = array_filter(explode(',', $ancestor->getChildrenInside() ?? ''));
                $childrenInside[] = $category->getId();
                $ancestor->setChildrenInside(implode(',', array_unique($childrenInside)));
                $ancestorId = $ancestor->getParentId();
            }

            // Level (глибина)
            $category->setLevel(count($parents) + 1);
        }

        // 4. Збереження всіх змін
        foreach ($categories as $category) {
            $this->em->persist($category);
        }

        $this->em->flush();

        return count($categories);
    }
}
