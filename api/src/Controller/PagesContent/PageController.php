<?php

namespace App\Controller\PagesContent;

use App\Controller\BaseController;
use App\Repository\PagesContent\PageRepository;
use App\Service\PagesContent\PageService;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/pages')]
class PageController extends BaseController
{
    private const array PAGE_GROUPS = ['groups' => ['page:read', 'page-seo:read', 'language:read']];
    
    public function __construct(
        private PageRepository $repository,
        private PageService $service,
    ) {}

    #[Route('', name: 'pages_fetch', methods: ['GET'])]
    public function fetch(Request $request): JsonResponse
    {
        try {
            $criteria = array_diff_key($request->query->all(), array_flip(['page', 'limit', 'offset']));
            $page = $request->query->getInt('page', 1);
            $limit = $request->query->getInt('limit', 10);
            $offset = ($page - 1) * $limit;
            $result = [
                'items' => $this->repository->findBy($criteria, null, $limit, $offset),
                'total' => $this->repository->count($criteria),
            ];
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json($result, context: self::PAGE_GROUPS);
    }

    #[Route('/{id}', name: 'pages_get', methods: ['GET'])]
    public function get(string $id): JsonResponse
    {
        try {
            $page = $this->repository->get($id);
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json($page, context: self::PAGE_GROUPS);
    }

    #[Route('', name: 'pages_post', methods: ['POST'])]
    public function post(Request $request): JsonResponse
    {
        try {
            $this->service->create($this->getData($request));
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json(null);
    }

    #[Route('/{id}', name: 'pages_put', methods: ['PUT'])]
    public function put(string $id, Request $request): JsonResponse
    {
        try {
            $this->service->patch($this->repository->get($id), $this->getData($request));
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json(null);
    }

    #[Route('/{id}', name: 'pages_patch', methods: ['PATCH'])]
    public function patch(string $id, Request $request): JsonResponse
    {
        try {
            $this->service->patch($this->repository->get($id), $this->getData($request));
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json(null);
    }

    #[Route('/{id}', name: 'pages_delete', methods: ['DELETE'])]
    public function delete(string $id): JsonResponse
    {
        try {
            $this->service->delete($this->repository->get($id));
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json(null);
    }
}
