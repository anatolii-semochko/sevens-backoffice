<?php

declare(strict_types=1);

namespace App\Repository\Management;

use App\Entity\Tariff\TariffHistory;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @extends ServiceEntityRepository<TariffHistory>
 */
class TariffHistoryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TariffHistory::class);
    }

    public function create(): TariffHistory
    {
        return new TariffHistory();
    }

    public function save(TariffHistory $tariffHistory): void
    {
        $this->getEntityManager()->persist($tariffHistory);
        $this->getEntityManager()->flush();
    }

    /**
     * Get all tariff history ordered by date
     */
    public function getAll(): array
    {
        return $this->createQueryBuilder('th')
            ->orderBy('th.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Get tariff history by admin user
     */
    public function getByAdminUser(UserInterface $adminUser): array
    {
        return $this->createQueryBuilder('th')
            ->where('th.adminUser = :adminUser')
            ->setParameter('adminUser', $adminUser)
            ->orderBy('th.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Get latest tariff entry
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function getLatest(): ?TariffHistory
    {
        return $this->createQueryBuilder('th')
            ->orderBy('th.createdAt', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Create a new tariff history entry
     */
    public function createEntry(
        UserInterface $adminUser,
        string $targetWallet,
        int $mint,
        int $setSale,
        int $buy,
        int $burn
    ): TariffHistory {
        $tariffHistory = $this->create();
        $tariffHistory->setAdminUser($adminUser);
        $tariffHistory->setTargetWallet($targetWallet);
        $tariffHistory->setMint($mint);
        $tariffHistory->setSetSale($setSale);
        $tariffHistory->setBuy($buy);
        $tariffHistory->setBurn($burn);

        $this->save($tariffHistory);

        return $tariffHistory;
    }
}
