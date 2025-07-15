<?php

namespace App\Utils;

use Exception;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Validation;

class Validate
{
    public function isEmail(?string $email): bool
    {
        return !Validation::createValidator()->validate($email, [
            new NotBlank(),
            new Email(['mode' => 'strict']),
        ]);
    }

    /**
     * @throws Exception
     */
    public function checkEmail(?string $email): void
    {
        $violations = Validation::createValidator()->validate($email, [
            new NotBlank(),
            new Email(['mode' => 'strict']),
        ]);
        if (count($violations) > 0) {
            foreach ($violations as $violation) {
                throw new Exception("Email: {$violation->getMessage()}");
            }
        }
    }

    /**
     * @throws Exception
     */
    public function checkPassword(?string $password): void
    {
        $string = trim($password);
        if (strlen($string) < 8) {
            throw new Exception('Password must be at least 8 characters long');
        }
        if (!preg_match('/[A-Z]/', $string)) {
            throw new Exception('Password must include at least one upper case letter');
        }
        if (!preg_match('/[a-z]/', $password)) {
            throw new Exception('Password must include at least one lower case letter');
        }
        if (!preg_match('/\d/', $password)) {
            throw new Exception('Password must include at least one number');
        }
    }
}
