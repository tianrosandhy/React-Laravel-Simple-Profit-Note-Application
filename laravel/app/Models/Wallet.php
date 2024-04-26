<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wallet extends Model
{
    use HasFactory;

    public $table = 'wallet';

    public $fillable = [
        'member_id',
        'title',
        'balance',
        'is_default',
    ];

    protected static function booted(): void
    {
        static::addGlobalScope(new Scopes\MemberScope);
    }
}
