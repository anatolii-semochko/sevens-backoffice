<?php

namespace App\Controller;

use App\Repository\TestRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class TestItemsRepository
{
    private const string TEST_ITEMS_FILE = '../var/items.json';
    private string $itemName;
    private array $items;

    public function __construct(string $itemName)
    {
        $this->itemName = $itemName;
        $this->items = $this->getItems();
    }

    private function getItems(): array
    {
        if (!is_file(self::TEST_ITEMS_FILE)) {
            throw new \RuntimeException('File not found');
        }
        return json_decode(file_get_contents(self::TEST_ITEMS_FILE), true);
    }

    private function setItems($data): void
    {
        $this->items[$this->itemName] = $data;
        file_put_contents(self::TEST_ITEMS_FILE, json_encode($this->items));
    }
    
    public function findAll(): array
    {
        return $this->items[$this->itemName] ?? [];
    }
}
