<?php

namespace App\Controller\PagesContent;

use App\Controller\BaseController;
use App\Repository\Help\HelpRepository;
use App\Service\PagesContent\HelpService;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/help')]
class HelpController extends BaseController
{
    private const array HELP_GROUPS = ['groups' => ['help:read', 'help-content:read', 'language:read']];
    
    public function __construct(
        private HelpRepository $repository,
        private HelpService $service,
    ) {}

    #[Route('', name: 'help_fetch', methods: ['GET'])]
    public function fetch(Request $request): JsonResponse
    {
        try {
            $result = $this->service->fetchByFilter($request->query->all() ?? []);
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json($result, context: self::HELP_GROUPS);
    }

    #[Route('/{id}', name: 'help_get', methods: ['GET'])]
    public function get(string $id): JsonResponse
    {
        try {
            $help = $this->repository->get($id);
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json($help, context: self::HELP_GROUPS);
    }

    #[Route('', name: 'help_post', methods: ['POST'])]
    public function post(Request $request): JsonResponse
    {
        try {
            $this->service->create($this->getData($request));
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json(null);
    }

    #[Route('/{id}', name: 'help_put', methods: ['PUT'])]
    public function put(string $id, Request $request): JsonResponse
    {
        try {
            $this->service->patch($this->repository->get($id), $this->getData($request));
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json(null);
    }

    #[Route('/{id}', name: 'help_patch', methods: ['PATCH'])]
    public function patch(string $id, Request $request): JsonResponse
    {
        try {
            $this->service->patch($this->repository->get($id), $this->getData($request));
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json(null);
    }

    #[Route('/{id}', name: 'help_delete', methods: ['DELETE'])]
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
