<?php

namespace App\Controller\PagesContent;

use App\Entity\PagesContent\Page;
use App\Repository\PagesContent\PageRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/pages')]
class PageController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private PageRepository $repository,
        private SerializerInterface $serializer,
    ) {}

    #[Route('', name: 'pages_fetch', methods: ['GET'])]
    public function fetch(Request $request, SerializerInterface $serializer): JsonResponse
    {
        $criteria = $request->query->all();
        $pages = $this->repository->findBy($criteria);
        return $this->json($pages, 200, [], ['groups' => 'page:read']);
    }

    #[Route('/{id}', name: 'pages_get', methods: ['GET'])]
    public function get(Page $page): JsonResponse
    {
        return $this->json($page, 200, [], ['groups' => 'page:read']);
    }

    #[Route('', name: 'pages_post', methods: ['POST'])]
    public function post(Request $request): JsonResponse
    {
        $page = $this->serializer->deserialize($request->getContent(), Page::class, 'json');
        $this->em->persist($page);
        $this->em->flush();
        return $this->json($page, 201, [], ['groups' => 'page:read']);
    }

    #[Route('/{id}', name: 'pages_put', methods: ['PUT'])]
    public function put(Request $request, Page $page): JsonResponse
    {
        $this->serializer->deserialize($request->getContent(), Page::class, 'json', ['object_to_populate' => $page]);
        $this->em->flush();
        return $this->json($page, 200, [], ['groups' => 'page:read']);
    }

    #[Route('/{id}', name: 'pages_patch', methods: ['PATCH'])]
    public function patch(Request $request, Page $page): JsonResponse
    {
        $this->serializer->deserialize($request->getContent(), Page::class, 'json', ['object_to_populate' => $page]);
        $this->em->flush();
        return $this->json($page, 200, [], ['groups' => 'page:read']);
    }

    #[Route('/{id}', name: 'pages_delete', methods: ['DELETE'])]
    public function delete(Page $page): JsonResponse
    {
        $this->em->remove($page);
        $this->em->flush();
        return $this->json(null, 204);
    }
}
