<?php
namespace App\Controller\PagesContent;

use App\Controller\BaseController;
use App\Repository\PagesContent\PageContentRepository;
use App\Service\PagesContent\PageContentService;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/pages-content')]
class PageContentController extends BaseController
{
    public const array CONTENT_GROUPS = ['groups' => [
        'page:read',
        'page-content:read',
        'page-content-translations:read',
        'language:read',
    ]];

    public function __construct(
        private PageContentRepository $repository,
        private PageContentService $service,
    ) {}

    #[Route('', methods: ['GET'])]
    public function fetch(Request $request): Response
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

        return $this->json($result, context: self::CONTENT_GROUPS);
    }

    #[Route('/{id}', methods: ['GET'])]
    public function get(string $id): Response
    {
        try {
            $pageContent = $this->repository->get($id);
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json($pageContent, context: self::CONTENT_GROUPS);
    }

    #[Route('', methods: ['POST'])]
    public function post(Request $request): Response
    {
        try {
            $data = $this->getData($request);
            $pageContent = $this->service->create($data);
            $this->service->patch($pageContent, $data);
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json(null);
    }

    #[Route('/{id}', methods: ['PUT'])]
    public function put(string $id, Request $request): Response
    {
        try {
            $this->service->patch($this->repository->get($id), $this->getData($request));
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json(null);
    }

    #[Route('/{id}', methods: ['PATCH'])]
    public function patch(string $id, Request $request): Response
    {
        try {
            $pageContent = $this->repository->get($id);
            $this->service->patch($pageContent, $this->getData($request));
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json(null);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(string $id): Response
    {
        try {
            $this->service->delete($this->repository->get($id));
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json(null);
    }
}
