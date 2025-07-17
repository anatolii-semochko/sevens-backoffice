<?php

namespace App\Entity\User;

class UserConstants
{
    const string ROLE_SUPER_ADMIN = 'ROLE_SUPER_ADMIN';
    const string ROLE_ADMIN = 'ROLE_ADMIN';
    const string ROLE_USER = 'ROLE_USER';
    const string ROLE_MODERATOR = 'ROLE_MODERATOR';
    const string ROLE_EDITOR = 'ROLE_EDITOR';
    const string ROLE_MANAGER = 'ROLE_MANAGER';
    const string ROLE_CUSTOMER_SUPPORT = 'ROLE_CUSTOMER_SUPPORT';

    public const array ROLES = [
        self::ROLE_SUPER_ADMIN => 'Super Admin',
        self::ROLE_ADMIN => 'Admin',
        self::ROLE_USER => 'User',
        self::ROLE_MODERATOR => 'Moderator',
        self::ROLE_EDITOR => 'Editor',
        self::ROLE_MANAGER => 'Manager',
        self::ROLE_CUSTOMER_SUPPORT => 'Customer Support',
    ];
}
