<?php

namespace App\Service;

use App\Entity\Category\Category;
use App\Entity\Category\CategoryLanguages;
use App\Entity\Language;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Uid\Uuid;

class CategoryService
{
    public function __construct(
        private EntityManagerInterface $em,
        private CategoryRepository $repository,
    ) {}
    
    public function fetchByFilter(array $criteria): array
    {
        $criteria['parent'] = $criteria['parent'] === 'root' ? null : $criteria['parent'];

        return $this->repository->findBy($criteria, ['order' => 'ASC']);
    }
    

    public function create(array $data): Category
    {
        $exists = $this->em->getRepository(Category::class)->findOneBy([
            'name' => $data['name'],
            'parent' => null,
        ]);
        if ($exists) {
            throw new \RuntimeException('Category with the same name and parent already exists.');
        }

        $category = new Category();
        $category->setId(Uuid::v4()->toRfc4122());
        $category->setUrl($data['url']);
        $category->setParent($this->getParentCategory($data));
        $category->setName($data['name']);
        $this->em->persist($category);
        $this->em->flush();

        return $category;
    }

    public function patch(object $category, array $data): void
    {
        $category->setUrl($data['url']);
        $category->setParent($this->getParentCategory($data));
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
    }
    
    private function getParentCategory(array $data): ?Object
    {
        $parentCategory = null;
        if (!empty($data['parent']['id'])) {
            $parentCategory = $this->repository->findOneBy([
                'id' => $data['parent']['id'],
            ]);
        }
        
        return $parentCategory;
    }
    
    public function delete(Object $page): void
    {
        $this->em->remove($page);
        $this->em->flush();
    }





//    public static function getCategoryPath ($category, $root = 'Root') {
//        @ $path = json_decode($category->path);
//        $path = [];
//        if (is_array($path)) foreach ($path as $step) {
//            $path[] = $step->title;
//        }
//        if ($root) $path[] = $root;
//        return implode(' > ', array_reverse($path));
//    }

//    // Admin Path Line Links
//    public static function getCategoriesAdminPathLinks ($service_category, $root_title) {
//        if ($service_category) {
//            $path[] = $service_category->title;
//            @ $path = json_decode($service_category->path);
//            if (is_array($path)) foreach ($path as $step) {
//                $path[] = '<a href="'.Url::to(['index','parent_id'=>$step->id]).'">'.$step->title.'</a>';
//            }
//            $path[] = '<a href="'.Url::to(['index']).'">'.$root_title.'</a>';
//            return implode(' > ', array_reverse($path));
//        } else {
//            return $root_title;
//        }
//    }

//    // Indexed Categories
//    static function indexing_categories ($main_parent_id = null) {
//        # All Categories
//        $query = "
//            SELECT `id`, `name`, `url`, `parent_id`
//            FROM ".Categories::tableName()."
//        ";
//        if ($main_parent_id = intval($main_parent_id)) $query.= "
//            WHERE main_parent_id = ".$main_parent_id."
//        ";
//        $all_categories = Yii::$app->db->createCommand($query)->queryAll();
//        # Обнуляем в массиве расчитываемые параметры
//        foreach ($all_categories as $category) {
//            $category['children'] = null;
//            $category['children_inside'] = null;
//            $category['path'] = [];
//            $categories[$category['id']] = $category;
//        }
//        foreach ($categories as $id=>$category) {
//            # Заполняем "parents"
//            $parents = [];
//            $parent_cat_id = $category['parent_id'];
//            while ($parent_cat_id != 0) {
//                $parents[] = $parent_cat_id;
//                $parent_cat = $categories[$parent_cat_id];
//                $parent_cat_id = $parent_cat['parent_id'];
//            }
//            @ $main_parent_id = intval($parent_cat['id']);
//            if (!$main_parent_id) $main_parent_id = $category['id'];
//            $categories[$id]['main_parent_id'] = $main_parent_id;
//            $parents = array_filter(array_reverse($parents));
//            $categories[$id]['parents']=implode(',',$parents);
//            // Activity Parent Category
//            if (count($parents) == 1) {
//                $categories[$id]['activity_parent_id'] = $category['id'];
//            } else if (count($parents) > 1) {
//                $categories[$id]['activity_parent_id'] = $parents[1];
//            } else {
//                $categories[$id]['activity_parent_id'] = 0;
//            }
//            # Заполняем поля "children"
//            foreach ($categories as $key=>$cat) {
//                if ($cat['id'] == $category['parent_id']) {
//                    $children = $categories[$key]['children'];
//                    $children = array_filter(explode(',',$children));
//                    $children[] = $category['id'];
//                    $children = implode(',',$children);
//                    $categories[$key]['children'] = $children;
//                }
//            }
//            # Заполняем "children_inside"
//            $parent_cat_id = $category['parent_id'];
//            while ($parent_cat_id != 0) {
//                $parent_cat = $categories[$parent_cat_id];
//                $children_inside = array_filter(explode(',',$parent_cat['children_inside']));
//                $children_inside[] = $category['id'];
//                $children_inside = implode(',',$children_inside);
//                $categories[$parent_cat_id]['children_inside'] = $children_inside;
//                $parent_cat_id = $parent_cat['parent_id'];
//            }
//            # Заполняем "path"
//            $parent_cat_id = $category['parent_id'];
//            while ($parent_cat_id!=0) {
//                $parent_cat = $categories[$parent_cat_id];
//                $path = $categories[$category['id']]['path'];
//                $path[] = [
//                    'id'   => $parent_cat['id'],
//                    'url'  => $parent_cat['url'],
//                    'name' => $parent_cat['name']
//                ];
//                $categories[$category['id']]['path'] = $path;
//                $parent_cat_id = $parent_cat['parent_id'];
//            }
//        }
//        # Записываем индексные изменения
//        foreach ($categories as $category) {
//            # Записываем изменения
//            $command = "
//                  main_parent_id     = '".$category['main_parent_id']."',
//                  activity_parent_id = ".($category['activity_parent_id'] ? "'".$category['activity_parent_id']."'" : 'null').",
//                  level              = ".(count(array_filter(explode(',',$category['parents'])))+1).",
//                  children           = '".$category['children']."',
//                  parents            = '".$category['parents']."',
//                  children_inside    = '".$category['children_inside']."',
//                  path               = '".json_encode($category['path'], JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE)."'
//            ";
//            Yii::$app->db->createCommand("
//                UPDATE ".Categories::tableName()."
//                SET ".$command."
//                WHERE id = ".$category['id']."
//            ")->execute();
//        }
//        return count($categories);
//    }
}
