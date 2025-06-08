<?php

namespace App\Controller\PagesContent;

use App\Repository\PagesContent\PageRepository;
use App\Service\PagesContent\PageService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/pages')]
class PageController extends AbstractController
{
    private const array PAGE_GROUPS = ['groups' => ['page:read', 'page-seo:read', 'language:read']];
    
    public function __construct(
        private PageRepository $repository,
        private PageService $service,
    ) {}

    #[Route('', name: 'pages_fetch', methods: ['GET'])]
    public function fetch(Request $request): JsonResponse
    {
        $criteria = $request->query->all();
        $pages = $this->repository->findBy($criteria);
        return $this->json($pages, 200, [], self::PAGE_GROUPS);
    }

    #[Route('/{id}', name: 'pages_get', methods: ['GET'])]
    public function get(string $id): JsonResponse
    {
        $page = $this->repository->find($id);
        return $page
            ? $this->json($page, Response::HTTP_OK, [], self::PAGE_GROUPS)
            : $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
    }

    #[Route('', name: 'pages_post', methods: ['POST'])]
    public function post(Request $request): JsonResponse
    {   
        $page = $this->service->create($this->getData($request));
        return $this->json($page, 201, [], ['groups' => 'page:read']);
    }

    #[Route('/{id}', name: 'pages_put', methods: ['PUT'])]
    public function put(string $id, Request $request): JsonResponse
    {
        if (!$page = $this->repository->find($id)) {
            return $this->json(['error' => 'Page not found'], Response::HTTP_NOT_FOUND);
        }
        $this->service->patch($page, $this->getData($request));
        return $this->json($page, Response::HTTP_OK, [], self::PAGE_GROUPS);
    }

    #[Route('/{id}', name: 'pages_patch', methods: ['PATCH'])]
    public function patch(string $id, Request $request): JsonResponse
    {
        if (!$page = $this->repository->find($id)) {
            return $this->json(['error' => 'Page not found'], Response::HTTP_NOT_FOUND);
        }
        $this->service->patch($page, $this->getData($request));
        return $this->json($page, Response::HTTP_OK, [], self::PAGE_GROUPS);
    }

    #[Route('/{id}', name: 'pages_delete', methods: ['DELETE'])]
    public function delete(string $id): JsonResponse
    {
        if (!$page = $this->repository->find($id)) {
            return $this->json(['error' => 'Page not found'], Response::HTTP_NOT_FOUND);
        }
        $this->service->delete($page);

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }

    private function getData(Request $request): array
    {
        return json_decode($request->getContent(), true) ?? [];
    }
}
