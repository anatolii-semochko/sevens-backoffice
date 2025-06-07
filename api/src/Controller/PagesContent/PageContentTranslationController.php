<?php
namespace App\Controller\PagesContent;

use App\Entity\PagesContent\PageContentTranslation;
use App\Repository\PagesContent\PageContentTranslationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/pages-content-translations')]
class PageContentTranslationController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private PageContentTranslationRepository $repository,
    ) {}

    #[Route('', methods: ['GET'])]
    public function fetch(Request $request): Response
    {
        $criteria = [];

        if ($contentId = $request->query->get('page_content_id')) {
            $criteria['pageContent'] = $contentId;
        }
        if ($langId = $request->query->get('lang_id')) {
            $criteria['langId'] = $langId;
        }

        $items = $this->repository->findBy($criteria);

        return $this->json($items, 200, [], ['groups' => 'page-content-translation:read']);
    }

    #[Route('/{id}', methods: ['GET'])]
    public function get(string $id): Response
    {
        $item = $this->repository->find($id);
        if (!$item) {
            return $this->json(['error' => 'PageContentTranslation not found'], 404);
        }

        return $this->json($item, 200, [], ['groups' => 'page-content-translation:read']);
    }

    #[Route('', methods: ['POST'])]
    public function post(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['page_content_id']) || !isset($data['lang_id']) || !isset($data['translation'])) {
            return $this->json(['error' => 'page_content_id, lang_id and translation are required'], 400);
        }

        $content = $this->em->getRepository('App\Entity\PagesContent\PageContent')->find($data['page_content_id']);
        if (!$content) {
            return $this->json(['error' => 'PageContent not found'], 404);
        }

        $translation = new PageContentTranslation();
        $translation->setPageContent($content);
        $translation->setLangId($data['lang_id']);
        $translation->setTranslation($data['translation']);

        $this->em->persist($translation);
        $this->em->flush();

        return $this->json($translation, 201, [], ['groups' => 'page-content-translation:read']);
    }

    #[Route('/{id}', methods: ['PUT'])]
    public function put(string $id, Request $request): Response
    {
        $translation = $this->repository->find($id);
        if (!$translation) {
            return $this->json(['error' => 'PageContentTranslation not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['page_content_id'])) {
            $content = $this->em->getRepository('App\Entity\PagesContent\PageContent')->find($data['page_content_id']);
            if (!$content) {
                return $this->json(['error' => 'PageContent not found'], 404);
            }
            $translation->setPageContent($content);
        }

        $translation->setLangId($data['lang_id'] ?? $translation->getLangId());
        $translation->setTranslation($data['translation'] ?? $translation->getTranslation());

        $this->em->flush();

        return $this->json($translation, 200, [], ['groups' => 'page-content-translation:read']);
    }

    #[Route('/{id}', methods: ['PATCH'])]
    public function patch(string $id, Request $request): Response
    {
        $translation = $this->repository->find($id);
        if (!$translation) {
            return $this->json(['error' => 'PageContentTranslation not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['page_content_id'])) {
            $content = $this->em->getRepository('App\Entity\PagesContent\PageContent')->find($data['page_content_id']);
            if (!$content) {
                return $this->json(['error' => 'PageContent not found'], 404);
            }
            $translation->setPageContent($content);
        }

        if (isset($data['lang_id'])) {
            $translation->setLangId($data['lang_id']);
        }

        if (isset($data['translation'])) {
            $translation->setTranslation($data['translation']);
        }

        $this->em->flush();

        return $this->json($translation, 200, [], ['groups' => 'page-content-translation:read']);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(string $id): Response
    {
        $translation = $this->repository->find($id);
        if (!$translation) {
            return $this->json(['error' => 'PageContentTranslation not found'], 404);
        }

        $this->em->remove($translation);
        $this->em->flush();

        return $this->json(null, 204);
    }
}
