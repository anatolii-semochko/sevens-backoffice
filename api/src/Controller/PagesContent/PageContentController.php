<?php
namespace App\Controller\PagesContent;

use App\Entity\PagesContent\PageContent;
use App\Repository\PagesContent\PageContentRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/pages-content')]
class PageContentController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private PageContentRepository $repository,
    ) {}

    #[Route('', methods: ['GET'])]
    public function fetch(Request $request): Response
    {
        $criteria = [];
        if ($term = $request->query->get('term')) {
            $criteria['term'] = $term;
        }
        if ($pageId = $request->query->get('page_id')) {
            $criteria['page'] = $pageId;
        }

        $items = $this->repository->findBy($criteria);

        return $this->json($items, 200, [], ['groups' => 'page-content:read']);
    }

    #[Route('/{id}', methods: ['GET'])]
    public function get(string $id): Response
    {
        $item = $this->repository->find($id);
        if (!$item) {
            return $this->json(['error' => 'PageContent not found'], 404);
        }
        return $this->json($item, 200, [], ['groups' => 'page-content:read']);
    }

    #[Route('', methods: ['POST'])]
    public function post(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        $pageContent = new PageContent();

        // Встановлення Page треба реалізувати, наприклад, через репозиторій Page
        $pageContent->setTerm($data['term'] ?? '');

        $this->em->persist($pageContent);
        $this->em->flush();

        return $this->json($pageContent, 201, [], ['groups' => 'page-content:read']);
    }

    #[Route('/{id}', methods: ['PUT'])]
    public function put(string $id, Request $request): Response
    {
        $pageContent = $this->repository->find($id);
        if (!$pageContent) {
            return $this->json(['error' => 'PageContent not found'], 404);
        }

        $data = json_decode($request->getContent(), true);
        if (isset($data['term'])) $pageContent->setTerm($data['term']);
        // Встановлення Page за потребою

        $this->em->flush();

        return $this->json($pageContent, 200, [], ['groups' => 'page-content:read']);
    }

    #[Route('/{id}', methods: ['PATCH'])]
    public function patch(string $id, Request $request): Response
    {
        $pageContent = $this->repository->find($id);
        if (!$pageContent) {
            return $this->json(['error' => 'PageContent not found'], 404);
        }

        $data = json_decode($request->getContent(), true);
        if (isset($data['term'])) $pageContent->setTerm($data['term']);

        $this->em->flush();

        return $this->json($pageContent, 200, [], ['groups' => 'page-content:read']);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(string $id): Response
    {
        $pageContent = $this->repository->find($id);
        if (!$pageContent) {
            return $this->json(['error' => 'PageContent not found'], 404);
        }

        $this->em->remove($pageContent);
        $this->em->flush();

        return $this->json(null, 204);
    }
}
