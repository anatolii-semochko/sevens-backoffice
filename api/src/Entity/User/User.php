<?php

namespace App\Entity\User;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Uuid;
use DateTimeImmutable;

#[ORM\Entity]
#[ORM\Table(name: 'admin_users')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\Column(type: 'string', length: 36)]
    #[Groups(['user:read'])]
    private string $id;

    #[ORM\Column(type: 'string', length: 32, unique: true)]
    #[Groups(['user:read'])]
    private string $userName;

    #[ORM\Column(type: 'string', length: 180, unique: true)]
    #[Assert\NotBlank(message: 'Email is required.')]
    #[Assert\Email(message: 'Please enter a valid email address.', mode: 'strict')]
    #[Groups(['user:read'])]
    private string $email;

    #[ORM\Column(type: 'string', length: 64)]
    private string $passwordHash;

    #[ORM\Column(type: 'string', length: 64)]
    #[Groups(['user:read'])]
    private string $fullName;

    #[ORM\Column(type: 'boolean')]
    #[Groups(['user:read'])]
    private bool $active = true;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    #[Groups(['user:read'])]
    private ?string $avatar = null;

    #[ORM\Column(type: 'json')]
    #[Groups(['user:read'])]
    private array $roles = [];

    #[ORM\Column(type: 'datetime_immutable')]
    #[Groups(['user:read'])]
    private DateTimeImmutable $createdAt;

    #[ORM\Column(type: 'datetime_immutable', nullable: true)]
    #[Groups(['user:read'])]
    private ?DateTimeImmutable $lastActivityAt = null;

    #[ORM\Column(type: 'boolean')]
    #[Groups(['user:read'])]
    private bool $authorized = true;

    public function __construct()
    {
        $this->id = Uuid::v4()->toRfc4122();
        $this->createdAt = new DateTimeImmutable();
    }

    public function getUserIdentifier(): string { return $this->email; }
    public function getPassword(): string { return $this->passwordHash; }
    public function eraseCredentials(): void {}

    public function getId(): string { return $this->id; }
    public function setId(string $id): void { $this->id = $id; }

    public function getUserName(): string { return $this->userName; }
    public function setUserName(string $userName): void { $this->userName = $userName; }

    public function getEmail(): string { return $this->email; }
    public function setEmail(string $email): void { $this->email = $email; }

    public function getPasswordHash(): string { return $this->passwordHash; }
    public function setPasswordHash(string $passwordHash): void { $this->passwordHash = $passwordHash; }

    public function getFullName(): string { return $this->fullName; }
    public function setFullName(string $fullName): void { $this->fullName = $fullName; }

    public function isActive(): bool { return $this->active; }
    public function setActive(bool $active): void { $this->active = $active; }

    public function getAvatar(): ?string { return $this->avatar; }
    public function setAvatar(?string $avatar): void { $this->avatar = $avatar; }

    public function getCreatedAt(): DateTimeImmutable { return $this->createdAt; }
    public function setCreatedAt(DateTimeImmutable $createdAt): void { $this->createdAt = $createdAt; }

    public function getLastActivityAt(): ?DateTimeImmutable { return $this->lastActivityAt; }
    public function setLastActivityAt(?DateTimeImmutable $lastActivityAt): void {
        $this->lastActivityAt = $lastActivityAt;
    }

    public function isAuthorized(): bool { return $this->authorized; }
    public function setAuthorized(bool $authorized): void { $this->authorized = $authorized; }

    public const array ROLES = [
        'ROLE_SUPER_ADMIN' => 'Super Admin',
        'ROLE_ADMIN' => 'Admin',
        'ROLE_USER' => 'User',
        'ROLE_MODERATOR' => 'Moderator',
        'ROLE_EDITOR' => 'Editor',
        'ROLE_MANAGER' => 'Manager',
        'ROLE_CUSTOMER_SUPPORT' => 'Customer Support',
    ];
    public function getRoles(): array { return $this->roles; }
    public function setRoles(array $roles): void { $this->roles = $roles; }
    public function getRolesList(): array
    {
        return self::ROLES;
    }
    public function isSuperAdmin(): bool { return in_array('ROLE_SUPER_ADMIN', $this->roles); }
    public function isAdmin(): bool { return in_array('ROLE_ADMIN', $this->roles); }
    public function isUser(): bool { return in_array('ROLE_USER', $this->roles); }
    public function isModerator(): bool { return in_array('ROLE_MODERATOR', $this->roles); }
    public function isEditor(): bool { return in_array('ROLE_EDITOR', $this->roles); }
    public function isManager(): bool { return in_array('ROLE_MANAGER', $this->roles); }
    public function isCustomerSupport(): bool { return in_array('ROLE_CUSTOMER_SUPPORT', $this->roles); }
}
