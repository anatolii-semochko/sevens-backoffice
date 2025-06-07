<?php
namespace App\Controller\PagesContent;

use App\Entity\PagesContent\PageSeo;
use App\Repository\PagesContent\PageSeoRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/pages-seo')]
class PageSeoController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private PageSeoRepository $repository,
    ) {}

    #[Route('', methods: ['GET'])]
    public function fetch(Request $request): Response
    {
        $criteria = [];
        if ($pageId = $request->query->get('page_id')) {
            $criteria['page'] = $pageId;
        }
        if ($langId = $request->query->get('lang_id')) {
            $criteria['langId'] = $langId;
        }

        $items = $this->repository->findBy($criteria);

        return $this->json($items, 200, [], ['groups' => 'page-seo:read']);
    }

    #[Route('/{id}', methods: ['GET'])]
    public function get(string $id): Response
    {
        $item = $this->repository->find($id);
        if (!$item) {
            return $this->json(['error' => 'PageSeo not found'], 404);
        }
        return $this->json($item, 200, [], ['groups' => 'page-seo:read']);
    }

    #[Route('', methods: ['POST'])]
    public function post(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        $pageSeo = new PageSeo();
        $pageSeo->setPage(null); // треба буде потім встановити посилання на Page
        $pageSeo->setLangId($data['langId'] ?? '');
        $pageSeo->setBreadcrumbs($data['breadcrumbs'] ?? '');
        $pageSeo->setTitle($data['title'] ?? '');
        $pageSeo->setKeywords($data['keywords'] ?? '');
        $pageSeo->setDescription($data['description'] ?? '');

        // Тут можна додати логіку пошуку Page за id, якщо треба

        $this->em->persist($pageSeo);
        $this->em->flush();

        return $this->json($pageSeo, 201, [], ['groups' => 'page-seo:read']);
    }

    #[Route('/{id}', methods: ['PUT'])]
    public function put(string $id, Request $request): Response
    {
        $pageSeo = $this->repository->find($id);
        if (!$pageSeo) {
            return $this->json(['error' => 'PageSeo not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['langId'])) $pageSeo->setLangId($data['langId']);
        if (isset($data['breadcrumbs'])) $pageSeo->setBreadcrumbs($data['breadcrumbs']);
        if (isset($data['title'])) $pageSeo->setTitle($data['title']);
        if (isset($data['keywords'])) $pageSeo->setKeywords($data['keywords']);
        if (isset($data['description'])) $pageSeo->setDescription($data['description']);

        $this->em->flush();

        return $this->json($pageSeo, 200, [], ['groups' => 'page-seo:read']);
    }

    #[Route('/{id}', methods: ['PATCH'])]
    public function patch(string $id, Request $request): Response
    {
        $pageSeo = $this->repository->find($id);
        if (!$pageSeo) {
            return $this->json(['error' => 'PageSeo not found'], 404);
        }

        $data = json_decode($request->getContent(), true);
        if (isset($data['langId'])) $pageSeo->setLangId($data['langId']);
        if (isset($data['breadcrumbs'])) $pageSeo->setBreadcrumbs($data['breadcrumbs']);
        if (isset($data['title'])) $pageSeo->setTitle($data['title']);
        if (isset($data['keywords'])) $pageSeo->setKeywords($data['keywords']);
        if (isset($data['description'])) $pageSeo->setDescription($data['description']);

        $this->em->flush();

        return $this->json($pageSeo, 200, [], ['groups' => 'page-seo:read']);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(string $id): Response
    {
        $pageSeo = $this->repository->find($id);
        if (!$pageSeo) {
            return $this->json(['error' => 'PageSeo not found'], 404);
        }

        $this->em->remove($pageSeo);
        $this->em->flush();

        return $this->json(null, 204);
    }
}
