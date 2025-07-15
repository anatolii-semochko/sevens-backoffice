<?php

namespace App\Service;

use App\Entity\User\User;
use App\Service\File\FileService;
use App\Service\File\LogoService;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Validation;

readonly class UserService
{
    public function __construct(
        private EntityManagerInterface $em,
        private LogoService $logoService,
    ) {}

    /**
     * @throws \Exception
     */
    public function create(array $data): User
    {
        $user = new User();
        $user->setId($data['id'] ?? Uuid::v4()->toRfc4122());
        $user->setActive(false);
        $this->checkEmail($data['email']);
        $user->setEmail(trim($data['email']));
        $user->setUserName(trim($data['userName']) ?? throw new Exception('User name is missing'));
        $user->setFullName(trim($data['fullName']) ?? throw new Exception('Full name is missing'));
        $user->setPasswordHash($this->getPasswordHash($data['password']));
        $user->setRoles($data['roles'] ?? []);

        $this->em->persist($user);
        $this->em->flush();

        if (!empty($data['avatar'])) {
            $user->setAvatar(
                $this->logoService->saveLogo(
                    FileService::USER_AVATAR,
                    $user->getId(),
                    $user->getAvatar(),
                    $data['avatar'],
                )
            );
            $this->em->persist($user);
            $this->em->flush();
        }

        return $user;
    }

    /**
     * @throws \Exception
     */
    public function save(User $user, array $data): void
    {
        if (isset($data['email'])) {
            $this->checkEmail($data['email']);
            $user->setEmail($data['email']);
        }
        if (isset($data['password']) && $data['password']) {
            $user->setPasswordHash($this->getPasswordHash($data['password']));
        }
        if (isset($data['userName'])) {
            $user->setUserName($data['userName']);
        } else {
            throw new Exception('User name is missing');
        }
        if (isset($data['fullName'])) {
            $user->setFullName($data['fullName']);
        } else {
            throw new Exception('Full name is missing');
        }
        if (isset($data['roles'])) {
            $user->setRoles($data['roles']);
        }
        if (array_key_exists('avatar', $data)) {
            $user->setAvatar(
                $this->logoService->saveLogo(
                    FileService::USER_AVATAR,
                    $user->getId(),
                    $user->getAvatar(),
                    $data['avatar'],
                )
            );
        }

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
                $user->setAvatar(
                    $this->logoService->saveLogo(
                        FileService::USER_AVATAR,
                        $user->getId(),
                        $user->getAvatar(),
                        $value,
                    )
                );
                continue;
            }
            if ($key === 'password') {
                $user->setPasswordHash($this->getPasswordHash($value));
                continue;
            }
            if ($key === 'email') {
                $this->checkEmail($value);
            }
            $setter = 'set' . ucfirst($key);
            if (method_exists($user, $setter)) {
                $user->$setter($value);
            }
        }

        $this->em->flush();
    }

    /**
     * @throws Exception
     */
    public function delete(User $user): void
    {
        if ($user->getAvatar()) {
            $this->logoService->saveLogo(
                FileService::USER_AVATAR,
                $user->getId(),
                $user->getAvatar(),
            );
        }
        $this->em->remove($user);
        $this->em->flush();
    }

    /**
     * @throws Exception
     */
    private function checkEmail(?string $email): void
    {
        $validator = Validation::createValidator();

        $violations = $validator->validate($email, [
            new NotBlank(),
            new Email(['mode' => 'strict']),
        ]);
        if (count($violations) > 0) {
            foreach ($violations as $violation) {
                throw new Exception("Email: {$violation->getMessage()}");
            }
        }
    }

    public function getPasswordHash(string $password): string
    {
        return password_hash($password, PASSWORD_DEFAULT);
    }
}
