<?php
namespace App\Facades;

use Illuminate\Support\Facades\Facade;

class Fonnte extends Facade
{
    protected static function getFacadeAccessor()
    {
        return \App\Services\Fonnte::class;
    }
}
