<?php
namespace App\Facades;

use Illuminate\Support\Facades\Facade;

class LabelService extends Facade
{
    protected static function getFacadeAccessor()
    {
        return \App\Services\LabelService::class;
    }
}
