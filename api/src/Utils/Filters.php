<?php

namespace App\Utils;

class Filters
{
    /**
     * Universal date filter helper
     *
     * @param string $propertyName - The property name to filter on (e.g., 'createdAt')
     * @param array $request - Request parameters containing 'filter', 'dateFrom', 'dateTo'
     * @return array|null - Returns ['from' => DateTimeImmutable, 'to' => DateTimeImmutable] or null for not-limited
     * @throws \DateMalformedStringException
     */
    public static function dateFilter(string $propertyName, array $request): ?array
    {
        $filter = $request['filter'] ?? 'this-month';
        $dateFrom = $request['dateFrom'] ?? null;
        $dateTo = $request['dateTo'] ?? null;

        return self::getDateRange($filter, $dateFrom, $dateTo);
    }

    /**
     * Calculate date range based on filter type
     *
     * @param string $filter - Filter type (today, last-day, this-week, last-week, this-month, last-month, custom, not-limited)
     * @param string|null $dateFrom - Custom start date (used when filter is 'custom')
     * @param string|null $dateTo - Custom end date (used when filter is 'custom')
     * @return array|null - Returns ['from' => DateTimeImmutable, 'to' => DateTimeImmutable] or null for not-limited
     * @throws \DateMalformedStringException
     */
    private static function getDateRange(string $filter, ?string $dateFrom, ?string $dateTo): ?array
    {
        $timezone = new \DateTimeZone('UTC');
        $now = new \DateTimeImmutable('now', $timezone);
        $to = $now;

        switch ($filter) {
            case 'today':
                $from = $now->setTime(0, 0, 0);
                $to = $now->setTime(23, 59, 59);
                break;

            case 'last-day':
                // Last 24 hours (1 day ago to now)
                $from = $now->modify('-1 day')->setTime(0, 0, 0);
                $to = $now->setTime(23, 59, 59);
                break;

            case 'this-week':
                // From Monday of current week to now
                $dayOfWeek = (int) $now->format('N'); // 1 (Monday) to 7 (Sunday)
                $daysFromMonday = $dayOfWeek - 1;
                $from = $now->modify("-{$daysFromMonday} days")->setTime(0, 0, 0);
                $to = $now->setTime(23, 59, 59);
                break;

            case 'last-week':
                // 7 days period (last 7 days including today)
                $from = $now->modify('-7 days')->setTime(0, 0, 0);
                $to = $now->setTime(23, 59, 59);
                break;

            case 'this-month':
                $from = $now->modify('first day of this month')->setTime(0, 0, 0);
                $to = $now->setTime(23, 59, 59);
                break;

            case 'last-month':
                // 30 days period (last 30 days including today)
                $from = $now->modify('-30 days')->setTime(0, 0, 0);
                $to = $now->setTime(23, 59, 59);
                break;

            case 'not-limited':
                // Return null to indicate no date filtering should be applied
                return null;

            case 'custom':
                if ($dateFrom) {
                    $from = new \DateTimeImmutable($dateFrom, $timezone);
                    $from = $from->setTime(0, 0, 0);
                } else {
                    $from = $now->modify('-1 month')->setTime(0, 0, 0);
                }
                if ($dateTo) {
                    $to = new \DateTimeImmutable($dateTo, $timezone);
                    $to = $to->setTime(23, 59, 59);
                } else {
                    $to = $now->setTime(23, 59, 59);
                }
                break;

            default:
                $from = $now->modify('-1 month')->setTime(0, 0, 0);
                $to = $now->setTime(23, 59, 59);
        }

        return [
            'from' => $from,
            'to' => $to,
        ];
    }
}
