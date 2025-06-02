<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class LanguageController extends AbstractController
{
    private TestItemsRepository $testLanguageRepository;
    public function __construct()
    {
        $this->testLanguageRepository = new TestItemsRepository('languages');
    }
    
    #[Route('/languages', name: 'get_languages', methods: ['GET'])]
    public function get(): JsonResponse
    {
        return $this->json($this->testLanguageRepository->findAll());
    }
}
