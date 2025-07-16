<?php

namespace App\Security;

use App\Entity\User\UserConstants;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\Authorization\AccessDeniedHandlerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class AccessDeniedHandler implements AccessDeniedHandlerInterface
{
    public function handle(Request $request, AccessDeniedException $accessDeniedException): JsonResponse
    {
        $role = $accessDeniedException->getAttributes() ?
            UserConstants::ROLES[$accessDeniedException->getAttributes()[0]] : null;

        return new JsonResponse([
            'message' => 'Access denied.' . ($role ? " \"$role\" permission is required." : ''),
        ], Response::HTTP_FORBIDDEN);
    }
}
