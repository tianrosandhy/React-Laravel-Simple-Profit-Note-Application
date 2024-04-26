<?php
namespace App\Facades;

use Illuminate\Support\Facades\Facade;

class WalletService extends Facade
{
    protected static function getFacadeAccessor()
    {
        return \App\Services\WalletService::class;
    }
}
