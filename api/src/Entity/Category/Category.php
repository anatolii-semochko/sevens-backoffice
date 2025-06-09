<?php

namespace App\Entity\Category;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
#[ORM\Table(name: "categories")]
#[ORM\UniqueConstraint(name: "unique", columns: ["name", "parent_id"])]
#[ORM\UniqueConstraint(name: "url_activity_unique", columns: ["activity_parent_id", "url"])]
#[ORM\UniqueConstraint(name: "url_main_unique", columns: ["main_parent_id", "url"])]
class Category
{
    #[ORM\Id]
    #[ORM\Column(type: "string", length: 36)]
    #[Groups(['category:read'])]
    private string $id;

    #[ORM\ManyToOne(targetEntity: self::class)]
    #[ORM\JoinColumn(name: "parent_id", referencedColumnName: "id", nullable: true, onDelete: "SET NULL")]
    #[Groups(['category:read'])]
    private ?Category $parent = null;

    #[ORM\ManyToOne(targetEntity: self::class)]
    #[ORM\JoinColumn(name: "main_parent_id", referencedColumnName: "id", nullable: true, onDelete: "SET NULL")]
    #[Groups(['category:read'])]
    private ?Category $mainParent = null;

    #[ORM\ManyToOne(targetEntity: self::class)]
    #[ORM\JoinColumn(name: "activity_parent_id", referencedColumnName: "id", nullable: true, onDelete: "SET NULL")]
    #[Groups(['category:read'])]
    private ?Category $activityParent = null;

    #[ORM\Column(name: "`order`", type: "integer", options: ["unsigned" => true])]
    #[Groups(['category:read'])]
    private int $order = 0;

    #[ORM\Column(type: "smallint", options: ["unsigned" => true])]
    #[Groups(['category:read'])]
    private int $level = 0;

    #[ORM\Column(type: "string", length: 64)]
    #[Groups(['category:read'])]
    private string $name;

    #[ORM\Column(type: "string", length: 32, nullable: true)]
    #[Groups(['category:read'])]
    private ?string $url = null;

    #[ORM\Column(type: "string", length: 32, nullable: true)]
    #[Groups(['category:read'])]
    private ?string $logo = null;

    #[ORM\Column(type: "string", length: 1024, nullable: true)]
    #[Groups(['category:read'])]
    private ?string $parents = null;

    #[ORM\Column(type: "text", nullable: true)]
    #[Groups(['category:read'])]
    private ?string $children = null;

    #[ORM\Column(type: "text", nullable: true)]
    #[Groups(['category:read'])]
    private ?string $childrenInside = null;

    #[ORM\Column(type: "text", nullable: true)]
    #[Groups(['category:read'])]
    private ?string $path = null;

    #[ORM\OneToMany(mappedBy: "category", targetEntity: CategoryLanguages::class, cascade: ["persist", "remove"])]
    #[Groups(['category:read'])]
    private Collection $translations;

    public function __construct()
    {
        $this->translations = new ArrayCollection();
    }

    public function getId(): string { return $this->id; }
    public function setId(string $id): void { $this->id = $id; }

    public function getParent(): ?Category { return $this->parent; }
    public function setParent(?Category $parent): void { $this->parent = $parent; }

    public function getMainParent(): ?Category { return $this->mainParent; }
    public function setMainParent(?Category $mainParent): void { $this->mainParent = $mainParent; }

    public function getActivityParent(): ?Category { return $this->activityParent; }
    public function setActivityParent(?Category $activityParent): void { $this->activityParent = $activityParent; }

    public function getOrder(): int { return $this->order; }
    public function setOrder(int $order): void { $this->order = $order; }

    public function getLevel(): int { return $this->level; }
    public function setLevel(int $level): void { $this->level = $level; }

    public function getName(): string { return $this->name; }
    public function setName(string $name): void { $this->name = trim($name); }

    public function getUrl(): ?string { return $this->url; }
    public function setUrl(?string $url): void { $this->url = trim($url); }

    public function getLogo(): ?string { return $this->logo; }
    public function setLogo(?string $logo): void { $this->logo = trim($logo); }

    public function getParents(): ?string { return $this->parents; }
    public function setParents(?string $parents): void { $this->parents = $parents; }

    public function getChildren(): ?string { return $this->children; }
    public function setChildren(?string $children): void { $this->children = $children; }

    public function getChildrenInside(): ?string { return $this->childrenInside; }
    public function setChildrenInside(?string $childrenInside): void { $this->childrenInside = $childrenInside; }

    public function getPath(): ?string { return $this->path; }
    public function setPath(?string $path): void { $this->path = $path; }

    public function getTranslations(): Collection { return $this->translations; }
    public function addTranslation(CategoryLanguages $translation): void {
        if (!$this->translations->contains($translation)) {
            $this->translations[] = $translation;
            $translation->setCategory($this);
        }
    }
    public function removeTranslation(CategoryLanguages $translation): void {
        $this->translations->removeElement($translation);
    }
}
