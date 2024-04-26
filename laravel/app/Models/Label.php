<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Label extends Model
{
    use HasFactory;

    public $table = 'label';

    public $fillable = [
        'member_id',
        'title',
        'color',
    ];

    protected static function booted(): void
    {
        static::addGlobalScope(new Scopes\MemberScope);
    }
}
