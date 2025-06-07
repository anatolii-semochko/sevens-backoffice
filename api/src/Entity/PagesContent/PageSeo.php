<?php

namespace App\Entity\PagesContent;

use App\Entity\Language;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: \App\Repository\PagesContent\PageSeoRepository::class)]
#[ORM\Table(name: 'pages_seo')]
class PageSeo
{
    #[ORM\Id]
    #[ORM\Column(type: 'string', length: 36, unique: true)]
    #[Groups(['page-seo:read'])]
    private Uuid $id;

    #[ORM\ManyToOne(targetEntity: Page::class, inversedBy: 'seo')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    #[Groups(['page-seo:read'])]
    private ?Page $page = null;

    #[ORM\ManyToOne(targetEntity: Language::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['page-seo:read'])]
    private ?Language $language = null;

    #[ORM\Column(length: 100)]
    #[Groups(['page-seo:read'])]
    private string $breadcrumbs;

    #[ORM\Column(length: 70)]
    #[Groups(['page-seo:read'])]
    private string $title;

    #[ORM\Column(length: 255)]
    #[Groups(['page-seo:read'])]
    private string $keywords;

    #[ORM\Column(length: 160)]
    #[Groups(['page-seo:read'])]
    private string $description;
    
    public function __construct()
    {
        $this->id = Uuid::v4();
    }

    public function getId(): ?Uuid { return $this->id; }
    public function getPage(): ?Page { return $this->page; }
    public function setPage(?Page $page): void { $this->page = $page; }

    public function getLanguage(): ?Language { return $this->language; }
    public function setLanguage(?Language $language): void { $this->language = $language; }

    public function getBreadcrumbs(): string { return $this->breadcrumbs; }
    public function setBreadcrumbs(string $breadcrumbs): void { $this->breadcrumbs = $breadcrumbs; }

    public function getTitle(): string { return $this->title; }
    public function setTitle(string $title): void { $this->title = $title; }

    public function getKeywords(): string { return $this->keywords; }
    public function setKeywords(string $keywords): void { $this->keywords = $keywords; }

    public function getDescription(): string { return $this->description; }
    public function setDescription(string $description): void { $this->description = $description; }
}
