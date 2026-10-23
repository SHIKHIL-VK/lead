<?php

namespace App\Enums;

enum LeadStatus: string
{
    case New = 'New';
    case Contacted = 'Contacted';
    case Converted = 'Converted';

    /**
     * Get all enum values as a plain array.
     * Used for validation rules and dropdown options.
     */
    public static function values(): array
    {
        return array_map(fn (self $status) => $status->value, self::cases());
    }
}
