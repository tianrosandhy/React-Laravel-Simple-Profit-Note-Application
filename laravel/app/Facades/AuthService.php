<?php
namespace App\Facades;

use Illuminate\Support\Facades\Facade;

class AuthService extends Facade
{
    protected static function getFacadeAccessor()
    {
        return \App\Services\AuthService::class;
    }
}
