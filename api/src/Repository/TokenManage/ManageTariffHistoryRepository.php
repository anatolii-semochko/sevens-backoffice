<?php

declare(strict_types=1);

namespace App\Repository\TokenManage;

use App\Entity\TokenManage\ManageTariffHistory;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @extends ServiceEntityRepository<ManageTariffHistory>
 */
class ManageTariffHistoryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ManageTariffHistory::class);
    }

    public function create(): ManageTariffHistory
    {
        return new ManageTariffHistory();
    }

    public function save(ManageTariffHistory $tariffHistory): void
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
    public function getLatest(): ?ManageTariffHistory
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
        float $mint,
        float $setSale,
        int $buy,
        float $burn
    ): ManageTariffHistory {
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
