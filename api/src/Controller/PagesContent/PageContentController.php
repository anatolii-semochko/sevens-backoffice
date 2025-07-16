<?php
namespace App\Controller\PagesContent;

use App\Controller\BaseController;
use App\Repository\PagesContent\PageContentRepository;
use App\Service\PagesContent\PageContentGenerateService;
use App\Service\PagesContent\PageContentService;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

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
        readonly private PageContentRepository $repository,
        readonly private PageContentService $service,
        readonly private PageContentGenerateService $pageContentGenerateService,
    ) {}

    #[Route('', methods: ['GET'])]
    public function fetch(Request $request): Response
    {
        try {
            $result = $this->service->fetchByFilter($request->query->all() ?? []);
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
    #[IsGranted('ROLE_EDITOR')]
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
    #[IsGranted('ROLE_EDITOR')]
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
    #[IsGranted('ROLE_EDITOR')]
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
    #[IsGranted('ROLE_EDITOR')]
    public function delete(string $id): Response
    {
        try {
            $this->service->delete($this->repository->get($id));
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json(null);
    }

    #[Route('/generate', methods: ['POST'])]
    #[IsGranted('ROLE_EDITOR')]
    public function generate(): Response
    {
        try {
            $result = $this->pageContentGenerateService->generate();
        } catch (\Exception $e) {
            throw new BadRequestException($e->getMessage(), $e->getCode(), $e);
        }

        return $this->json(['message' => $result]);
    }
}
