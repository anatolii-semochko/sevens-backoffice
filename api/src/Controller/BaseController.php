<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;

class BaseController extends AbstractController
{
    public function getData(Request $request): array
    {
        return json_decode($request->getContent(), true) ?? [];
    }
}
