<?php

namespace App\Controller\PagesContent;

use App\Entity\PagesContent\Language;
use App\Repository\PagesContent\LanguageRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use function App\Controller\uuid_create;

#[Route('/languages')]
class LanguageController extends AbstractController
{
    public function __construct(
        private LanguageRepository $repository,
        private EntityManagerInterface $em
    ) {}

    #[Route('', name: 'language_fetch', methods: ['GET'])]
    public function fetch(Request $request): JsonResponse
    {
        $criteria = $request->query->all();
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
        $data = json_decode($request->getContent(), true);
        $language = new Language();
        $language->setId($data['id'] ?? uuid_create());
        $language->setCode($data['code']);
        $language->setName($data['name']);
        $language->setActive($data['active'] ?? true);
        $language->setMain($data['main'] ?? false);

        $this->em->persist($language);
        $this->em->flush();

        return $this->json($language, Response::HTTP_CREATED, [], ['groups' => 'language:read']);
    }

    #[Route('/{id}', name: 'language_put', methods: ['PUT'])]
    public function put(Request $request, string $id): JsonResponse
    {
        $language = $this->repository->find($id);
        if (!$language) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        $language->setCode($data['code']);
        $language->setName($data['name']);
        $language->setActive($data['active']);
        $language->setMain($data['main']);

        $this->em->flush();
        return $this->json($language, Response::HTTP_OK, [], ['groups' => 'language:read']);
    }

    #[Route('/{id}', name: 'language_patch', methods: ['PATCH'])]
    public function patch(Request $request, string $id): JsonResponse
    {
        $language = $this->repository->find($id);
        if (!$language) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        foreach ($data as $key => $value) {
            $setter = 'set' . ucfirst($key);
            if (method_exists($language, $setter)) {
                $language->$setter($value);
            }
        }

        $this->em->flush();
        return $this->json($language, Response::HTTP_OK, [], ['groups' => 'language:read']);
    }

    #[Route('/{id}', name: 'language_delete', methods: ['DELETE'])]
    public function delete(string $id): JsonResponse
    {
        $language = $this->repository->find($id);
        if (!$language) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }

        $this->em->remove($language);
        $this->em->flush();

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}
