<?php

namespace App\EventListener;

use Symfony\Component\Console\ConsoleEvents;
use Symfony\Component\Console\Event\ConsoleCommandEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class BlockDoctrineMigrateCommandListener implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            ConsoleEvents::COMMAND => 'onConsoleCommand',
        ];
    }

    public function onConsoleCommand(ConsoleCommandEvent $event): void
    {
        $command = $event->getCommand();
        if ($command && in_array($command->getName(),['doctrine:migrations:migrate', 'doctrine:migrations:diff'])) {
            throw new \RuntimeException(
                '⚠️  Execution of "doctrine:migrations:migrate" is forbidden in this project.' .
                ' Migrations are managed in a separate repository.'
            );
        }
    }
}
