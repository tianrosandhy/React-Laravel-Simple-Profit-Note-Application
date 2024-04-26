<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        apiPrefix: 'api',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function(ValidationException $e, Request $request) {
            if ($request->is('api/*')) {
                return errJson($e->getMessage(), 400, "INVALID_PARAM", $e->errors());
            }
        });
        $exceptions->render(function(NotFoundHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return errJson("Data not found", 404, "NOT_FOUND");
            }
        });
    })->create();
