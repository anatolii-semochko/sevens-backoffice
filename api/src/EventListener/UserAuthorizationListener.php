<?php
namespace App\EventListener;

use App\Entity\User\User;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ControllerEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Doctrine\ORM\EntityManagerInterface;
use DateTimeImmutable;

readonly class UserAuthorizationListener implements EventSubscriberInterface
{
    public function __construct(
        private TokenStorageInterface $tokenStorage,
        private EntityManagerInterface $em,
        private int $invalidationSeconds,
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [KernelEvents::CONTROLLER => 'onKernelController'];
    }

    public function onKernelController(ControllerEvent $event): void
    {
        if (!$event->isMainRequest()) {
            return;
        }

        $route = $event->getRequest()->attributes->get('_route');
        if (in_array($route, ['user_login', 'user_logout'], true)) {
            return;
        }

        $token = $this->tokenStorage->getToken();
        if (!$token) {
            return;
        }

        $user = $token->getUser();
        if ($user instanceof User) {
            $now = new DateTimeImmutable();
            $last = $user->getLastActivityAt();
            $invalidationTime = $now->modify('-' . $this->invalidationSeconds . ' seconds')->getTimestamp();
            if ($last && $last->getTimestamp() < $invalidationTime) {
                $user->setAuthorized(false);
            }

            if (!$user->isAuthorized()) {
                $this->em->flush();
                $event->setController(fn() => new JsonResponse(null, 401));
                return;
            }

            $user->setLastActivityAt($now);
            $this->em->flush();
        }
    }
}
