<?php

namespace App\Controller;

use App\Repository\CategoryRepository;
use App\Service\CategoryService;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/categories')]
class CategoryController extends BaseController
{
    public const array CATEGORY_GROUPS = ['groups' => ['category:read', 'category-lang:read', 'language:read']];

    public function __construct(
        private readonly CategoryRepository $repository,
        private readonly CategoryService $service,
    ) {}

    #[Route('', name: 'categories_fetch', methods: ['GET'])]
    public function fetch(Request $request): JsonResponse
    {
        try {
            $categories = $this->service->fetchByFilter($request->query->all() ?? []);
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json($categories, context: self::CATEGORY_GROUPS);
    }

    #[Route('/{id}', name: 'category_get', methods: ['GET'])]
    public function get(string $id): JsonResponse
    {
        try {
            $category = $this->repository->get($id);
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json($category, context: self::CATEGORY_GROUPS);
    }

    #[Route('', name: 'category_post', methods: ['POST'])]
    #[IsGranted('ROLE_EDITOR')]
    public function post(Request $request): JsonResponse
    {
        try {
            $this->service->create($this->getData($request));
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json(null);
    }

    #[Route('/{id}', name: 'category_put', methods: ['PUT'])]
    #[IsGranted('ROLE_EDITOR')]
    public function put(string $id, Request $request): JsonResponse
    {
        try {
            $this->service->put($this->repository->get($id), $this->getData($request));
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json(null);
    }

    #[Route('/{id}', name: 'category_patch', methods: ['PATCH'])]
    #[IsGranted('ROLE_EDITOR')]
    public function patch(string $id, Request $request): JsonResponse
    {
        try {
            $this->service->patch($this->repository->get($id), $this->getData($request));
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json(null);
    }

    #[Route('/{id}', name: 'category_delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_EDITOR')]
    public function delete(string $id): JsonResponse
    {
        try {
            $this->service->delete($this->repository->get($id));
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json(null);
    }

    #[Route('/{id}/swap', name: 'category_order_swap', methods: ['PATCH'])]
    #[IsGranted('ROLE_EDITOR')]
    public function swapCategory(string $id, Request $request): JsonResponse
    {
        try {
            $currentCategory = $this->repository->get($id);
            $swapCategory = $this->repository->get($this->getData($request)['swapId'] ?? null);
            $this->service->swapCategory($currentCategory, $swapCategory);
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json(null);
    }
}
