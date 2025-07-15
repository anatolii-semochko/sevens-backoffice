<?php

namespace App\EventListener;

use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTDecodedEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Events;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use DateTimeImmutable;

readonly class JwtInvalidationListener implements EventSubscriberInterface
{
    public function __construct(
        private UserRepository $userRepository,
        private EntityManagerInterface $em,
        private int $invalidationSeconds,
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [Events::JWT_DECODED => 'onJwtDecoded'];
    }

    public function onJwtDecoded(JWTDecodedEvent $event): void
    {
        $payload = $event->getPayload();
        if (empty($payload['username']) || empty($payload['iat'])) {
            return;
        }

        $user = $this->userRepository->findOneBy(['email' => $payload['username']]);
        if (!$user) {
            $event->markAsInvalid();
            return;
        }

        $now = new DateTimeImmutable();
        $lastActivity = $user->getLastActivityAt();
        $invalidationTime = $now->modify('-' . $this->invalidationSeconds . ' seconds')->getTimestamp();
        if ($lastActivity && $lastActivity->getTimestamp() < $invalidationTime) {
            $user->setAuthorized(false);
        }

        if (!$user->isAuthorized()) {
            $this->em->flush();
            $event->markAsInvalid();
            return;
        }

        $user->setLastActivityAt($now);
        $this->em->flush();
    }
}
