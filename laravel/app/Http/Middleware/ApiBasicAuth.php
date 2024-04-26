<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiBasicAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // if (config('app.debug')) {
        //     return $next($request);
        // }

        $authHeader = explode(' ', $request->header('Authorization'));
        if (strtolower($authHeader[0]) !== 'basic') {
            return errJson("Unauthorized", 401);
        }

        $basicData = $authHeader[1] ?? null;
        if (strlen($basicData) == 0) {
            return errJson("Unauthorized", 401);
        }

        if ($basicData <> config('app.basic_key')) {
            return errJson("Unauthorized", 401);
        }

        return $next($request);
    }
}
