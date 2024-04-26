<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Foundation\AliasLoader;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->loadHelpers(__DIR__ . '/..');
        $this->registerAlias();
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }

    protected function loadHelpers($dir)
    {
        foreach (glob($dir . '/Helpers/*.php') as $filename) {
            require_once $filename;
        }
    }

    protected function registerAlias()
    {
        //automatically load alias
        $aliasData = [
            'AuthService' => \App\Facades\AuthService::class,
            'WalletService' => \App\Facades\WalletService::class,
            'LabelService' => \App\Facades\LabelService::class,
            'Fonnte' => \App\Facades\Fonnte::class,
        ];

        foreach ($aliasData as $al => $src) {
            AliasLoader::getInstance()->alias($al, $src);
        }
    }
}
