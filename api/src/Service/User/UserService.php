<?php

namespace App\Service\User;

use App\Entity\User\User;
use App\Service\File\FileService;
use App\Service\File\LogoService;
use App\Utils\Validate;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Component\Uid\Uuid;

readonly class UserService
{
    public function __construct(
        private EntityManagerInterface $em,
        private LogoService $logoService,
        private Validate $validate,
    ) {}

    /**
     * @throws Exception
     */
    public function create(array $data): User
    {
        $this->validate->checkPassword($data['password'] ?? null);

        $user = new User();
        $user->setId($data['id'] ?? Uuid::v4()->toRfc4122());
        $this->fillUser($user, $data);
        $user->setAuthorized(false);

        $this->em->persist($user);
        $this->em->flush();

        return $user;
    }

    /**
     * @throws Exception
     */
    public function save(User $user, array $data): void
    {
        $this->fillUser($user, $data);
        $this->em->persist($user);
        $this->em->flush();
    }

    /**
     * @throws Exception
     */
    public function patch(User $user, array $data): void
    {
        foreach ($data as $key => $value) {
            if (in_array($key, ['id', 'roles', 'createdAt', 'lastActivityAt'])) {
                continue;
            }
            if ($key === 'avatar') {
                $this->setAvatar($user, ['avatar' => $value]);
                continue;
            }
            if ($key === 'password') {
                if ($value) {
                    $this->validate->checkPassword($value);
                    $user->setPasswordHash($this->getPasswordHash($value));
                }
                continue;
            }
            if ($key === 'email') {
                $this->validate->checkEmail($value);
            }
            $setter = 'set' . ucfirst($key);
            if (method_exists($user, $setter)) {
                $user->$setter($value);
            }
        }

        $this->em->persist($user);
        $this->em->flush();
    }

    /**
     * @throws Exception
     */
    public function delete(User $user): void
    {
        if ($user->getAvatar()) {
            $this->setAvatar($user, ['avatar' => null]);
        }
        $this->em->remove($user);
        $this->em->flush();
    }

    /**
     * @throws Exception
     */
    private function fillUser(User $user, array $data): void
    {
        if (empty($data['loginName']) || !trim($data['loginName'])) {
            throw new Exception('User name is missing');
        }
        if (empty($data['fullName']) || !trim($data['fullName'])) {
            throw new Exception('Full name is missing');
        }
        $this->validate->checkEmail($data['email'] ?? null);
        if (!empty($data['password'])) {
            $this->validate->checkPassword($data['password']);
        }

        $user->setEmail(trim($data['email']));
        $user->setLoginName(trim($data['loginName']));
        $user->setFullName(trim($data['fullName']));
        $user->setActive($data['active'] ?? false);
        $this->setAvatar($user, $data);
        $user->setRoles($data['roles'] ?? []);

        if (!empty($data['password'])) {
            $this->validate->checkPassword($data['password']);
            $user->setPasswordHash($this->getPasswordHash($data['password']));
        }
    }

    /**
     * @throws Exception
     */
    private function setAvatar(User $user, array $data): void
    {
        $user->setAvatar(
            $this->logoService->saveLogo(
                FileService::USER_AVATAR,
                $user->getId(),
                $user->getAvatar(),
                $data['avatar'],
            )
        );
    }

    public function getPasswordHash(string $password): string
    {
        return password_hash($password, PASSWORD_DEFAULT);
    }
}
