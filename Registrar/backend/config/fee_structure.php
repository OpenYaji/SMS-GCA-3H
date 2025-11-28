<?php

class FeeStructure
{

    public static function getFeesByGrade($gradeName)
    {
        $fees = [
            'Nursery' => [
                'registration' => 1500,
                'miscellaneous' => 3000,
                'tuition' => 10000,
                'full_payment' => 14500,
                'quarterly_tuition' => 2500,
                'monthly_tuition' => 1000
            ],
            'Kinder 1' => [
                'registration' => 1500,
                'miscellaneous' => 3000,
                'tuition' => 10000,
                'full_payment' => 14500,
                'quarterly_tuition' => 2500,
                'monthly_tuition' => 1000
            ],
            'Kinder 2' => [
                'registration' => 1500,
                'miscellaneous' => 3000,
                'tuition' => 10000,
                'full_payment' => 14500,
                'quarterly_tuition' => 2500,
                'monthly_tuition' => 1000
            ],
            'Grade 1' => [
                'registration' => 2000,
                'miscellaneous' => 4500,
                'tuition' => 12000,
                'full_payment' => 18500,
                'quarterly_tuition' => 2400,
                'monthly_tuition' => 1200
            ],
            'Grade 2' => [
                'registration' => 2000,
                'miscellaneous' => 4500,
                'tuition' => 12000,
                'full_payment' => 18500,
                'quarterly_tuition' => 2400,
                'monthly_tuition' => 1200
            ],
            'Grade 3' => [
                'registration' => 2000,
                'miscellaneous' => 4500,
                'tuition' => 12000,
                'full_payment' => 18500,
                'quarterly_tuition' => 2400,
                'monthly_tuition' => 1200
            ],
            'Grade 4' => [
                'registration' => 2000,
                'miscellaneous' => 5000,
                'tuition' => 13000,
                'full_payment' => 20000,
                'quarterly_tuition' => 2600,
                'monthly_tuition' => 1300
            ],
            'Grade 5' => [
                'registration' => 2000,
                'miscellaneous' => 5000,
                'tuition' => 13000,
                'full_payment' => 20000,
                'quarterly_tuition' => 2600,
                'monthly_tuition' => 1300
            ],
            'Grade 6' => [
                'registration' => 2000,
                'miscellaneous' => 5000,
                'tuition' => 13000,
                'full_payment' => 20000,
                'quarterly_tuition' => 2600,
                'monthly_tuition' => 1300
            ]
        ];

        return $fees[$gradeName] ?? $fees['Grade 1']; // default to Grade 1 if not found
    }

    public static function calculateDownPayment($gradeName, $paymentMode)
    {
        $fees = self::getFeesByGrade($gradeName);

        $downPayments = [
            'full' => $fees['registration'] + $fees['miscellaneous'] + $fees['tuition'],
            'quarterly' => $fees['registration'] + $fees['miscellaneous'] + $fees['quarterly_tuition'],
            'monthly' => $fees['registration'] + $fees['miscellaneous'] + $fees['monthly_tuition']
        ];

        return $downPayments[$paymentMode] ?? 0;
    }

    public static function getRequiredDocuments($studentType)
    {
        $type = strtolower(trim($studentType));

        if (strpos($type, 'new') !== false) {
            return ['Birth Certificate', 'Report Card', 'Good Moral Certificate', 'Certificate of Completion', 'Form 137'];
        } elseif (strpos($type, 'old') !== false) {
            return ['Report Card'];
        } elseif (strpos($type, 'transf') !== false) {
            return ['Good Moral Certificate', 'Birth Certificate', 'Certificate of Completion', 'Form 137'];
        } elseif (strpos($type, 'return') !== false) {
            return ['Report Card'];
        }

        return [];
    }
}
