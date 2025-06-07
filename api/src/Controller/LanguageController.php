<?php

namespace App\Controller;

use App\Repository\LanguageRepository;
use App\Service\LanguageService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/languages')]
class LanguageController extends AbstractController
{
    public function __construct(
        private LanguageRepository $repository,
        private LanguageService $service,
    ) {}

    #[Route('', name: 'language_fetch', methods: ['GET'])]
    public function fetch(Request $request): JsonResponse
    {
        $criteria = $request->query->all() ?? [];
        $languages = $this->repository->findBy($criteria);
        return $this->json($languages, Response::HTTP_OK, [], ['groups' => 'language:read']);
    }

    #[Route('/{id}', name: 'language_get', methods: ['GET'])]
    public function get(string $id): JsonResponse
    {
        $language = $this->repository->find($id);
        return $language
            ? $this->json($language, Response::HTTP_OK, [], ['groups' => 'language:read'])
            : $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
    }

    #[Route('', name: 'language_post', methods: ['POST'])]
    public function post(Request $request): JsonResponse
    {
        $language = $this->service->create($this->getData($request));
        return $this->json($language, Response::HTTP_CREATED, [], ['groups' => 'language:read']);
    }

    #[Route('/{id}', name: 'language_put', methods: ['PUT'])]
    public function put(Request $request, string $id): JsonResponse
    {
        if (!$language = $this->repository->find($id)) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }
        $this->service->save($language, $this->getData($request));
        return $this->json($language, Response::HTTP_OK, [], ['groups' => 'language:read']);
    }

    #[Route('/{id}', name: 'language_patch', methods: ['PATCH'])]
    public function patch(Request $request, string $id): JsonResponse
    {
        if (!$language = $this->repository->find($id)) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }
        $this->service->patch($language, $this->getData($request));
        return $this->json($language, Response::HTTP_OK, [], ['groups' => 'language:read']);
    }

    #[Route('/{id}', name: 'language_delete', methods: ['DELETE'])]
    public function delete(string $id): JsonResponse
    {
        if (!$language = $this->repository->find($id)) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }
        $this->service->delete($language);

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/{id}/swap', name: 'language_order_swap', methods: ['PATCH'])]
    public function swapOrder(string $id, Request $request): JsonResponse
    {
        $currentLanguage = $this->repository->find($id);
        $swapLanguage = $this->repository->find($this->getData($request)['swapId'] ?? null);
        if (!$currentLanguage || !$swapLanguage) {
            return $this->json(['error' => 'Language not found'], 404);
        }
        $this->service->swapOrder($currentLanguage, $swapLanguage);

        return $this->json(null);
    }
    
    private function getData(Request $request): array
    {
        return json_decode($request->getContent(), true) ?? [];
    }
}
