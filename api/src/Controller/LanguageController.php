<?php

namespace App\Controller;

use App\Repository\LanguageRepository;
use App\Service\LanguageService;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/languages')]
class LanguageController extends BaseController
{
    public const array LANGUAGE_GROUPS = ['groups' => 'language:read'];

    public function __construct(
        private readonly LanguageRepository $repository,
        private readonly LanguageService $service,
    ) {}

    #[Route('', name: 'language_fetch', methods: ['GET'])]
    public function fetch(Request $request): JsonResponse
    {
        try {
            $criteria = $request->query->all() ?? [];
            $languages = $this->repository->findBy($criteria, ['order' => 'ASC']);
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json($languages, context: self::LANGUAGE_GROUPS);
    }

    #[Route('/{id}', name: 'language_get', methods: ['GET'])]
    public function get(string $id): JsonResponse
    {
        try {
            $language = $this->repository->get($id);
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json($language, context: self::LANGUAGE_GROUPS);
    }

    #[Route('', name: 'language_post', methods: ['POST'])]
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

    #[Route('/{id}', name: 'language_put', methods: ['PUT'])]
    #[IsGranted('ROLE_EDITOR')]
    public function put(Request $request, string $id): JsonResponse
    {
        try {
            $this->service->save($this->repository->get($id), $this->getData($request));
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json(null);
    }

    #[Route('/{id}', name: 'language_patch', methods: ['PATCH'])]
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

    #[Route('/{id}', name: 'language_delete', methods: ['DELETE'])]
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

    #[Route('/{id}/swap', name: 'language_order_swap', methods: ['PATCH'])]
    #[IsGranted('ROLE_EDITOR')]
    public function swapOrder(string $id, Request $request): JsonResponse
    {
        try {
            $currentLanguage = $this->repository->get($id);
            $swapLanguage = $this->repository->get($this->getData($request)['swapId'] ?? null);
            $this->service->swapOrder($currentLanguage, $swapLanguage);
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json(null);
    }
}
