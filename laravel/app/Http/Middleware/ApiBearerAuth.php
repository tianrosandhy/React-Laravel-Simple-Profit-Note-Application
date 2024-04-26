<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Member;
use App\Models\MemberToken;

class ApiBearerAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $authHeader = explode(' ', $request->header('Authorization'));
        if (strtolower($authHeader[0]) !== 'bearer') {
            return errJson("Unauthorized", 401);
        }

        $bearerData = $authHeader[1] ?? null;
        if (strlen($bearerData) == 0) {
            return errJson("Unauthorized", 401);
        }

        // validate bearerData
        try {
            $bearerData = decrypt($bearerData);
        } catch (\Exception $e) {
            return errJson("Invalid authorization data", 401);
        }

        if (is_array($bearerData)) {
            if (isset($bearerData['member_id']) && isset($bearerData['token'])) {

                $check_db = MemberToken::where('member_id', $bearerData['member_id'])
                    ->where('token', $bearerData['token'])
                    ->where('expired_date', '>', now())
                    ->first();
                
                $member = Member::find($bearerData['member_id']);

                if ($check_db && $member) {
                    $request->attributes->add([
                        'member' => $member,
                        'token' => $check_db->token,
                    ]);
                    return $next($request);
                }
            }
        }

        return errJson("You need to login again", 401);
    }
}
