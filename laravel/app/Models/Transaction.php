<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    public $table = 'transaction';

    protected static function booted(): void
    {
        static::addGlobalScope(new Scopes\MemberScope);
    }

}
