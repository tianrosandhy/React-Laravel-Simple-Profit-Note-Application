<?php
namespace App\Services;

use App\Models\Member;
use App\Models\MemberToken;
use App\Models\Otp;
use Exception;
use Fonnte;

class AuthService
{
    public function activeMember($whatsapp_number)
    {
        $member = Member::where('whatsapp_number', normalizePhone($whatsapp_number))->first();
        if (!empty($member)) {
            if ($member->status == 'BLOCKED') {
                return null;
            }    
        }
        return $member;
    }

    public function sendOtp(Member $member)
    {
        $pending_otp_requested_count = Otp::where('member_id', $member->id)->count();
        $last_otp = Otp::where('member_id', $member->id)->orderBy('created_at', 'desc')->first();

        if ($pending_otp_requested_count > config('otp.max_attempts')) {
            $block_duration = config('otp.block_duration');
            $last_otp_age = now()->diffInMinutes($last_otp->created_at);
            $remaining_block_duration = $block_duration - $last_otp_age;
            if ($remaining_block_duration > 0) {
                return "Sorry, you have reached the maximum number of OTP requests. Please try again in $remaining_block_duration minutes";
            }             
        }

        if (!empty($last_otp)) {
            $last_otp_age = time() - strtotime($last_otp->created_at);
            if ($last_otp_age < config('otp.wait_duration') * 60) {
                return "Please wait for " . ((config('otp.wait_duration') * 60) - $last_otp_age) . " seconds before requesting another OTP";
            }
        }

        try {
            $otp_code = '';
            for ($i=1; $i<=config('otp.digits'); $i++) {
                $otp_code .= rand(0, 9);
            }

            if (config('app.env') <> 'local') {
                $message = "Your OTP is: $otp_code . Please keep this OTP confidential and do not share it with anyone.";
                Fonnte::sendMessage($member->whatsapp_number, $message);    
            }
        } catch (Exception $e) {
            return "Sorry, we cannot call the OTP server right now";
        }

        $otp = new Otp;
        $otp->member_id = $member->id;
        $otp->whatsapp_number = $member->whatsapp_number;
        $otp->scope = ($member->status == 'ACTIVE' ? 'LOGIN' : 'REGISTER');
        $otp->expired_date = now()->addMinutes(config('otp.otp_age'));
        $otp->otp = $otp_code;
        $otp->save();

        return null;
    }

    public function validateOtp(Member $member, $otpcode)
    {
        $cache_key = "otp_failures_{$member->whatsapp_number}";
        $failures = cache($cache_key, 0);
        if ($failures >= config('otp.max_consecutive_failures')) {
            return "You have reached the maximum number of consecutive failures. Please try again later";
        }

        $otp = Otp::where('whatsapp_number', $member->whatsapp_number)
            ->where('otp', $otpcode)
            ->where('expired_date', '>', now())
            ->first();

        \Log::info("OTP DATA : ", [
            'otp' => $otp,
            'otpcode' => $otpcode,
            'env' => config('app.env'),
        ]);

        if (empty($otp)) {
            if (config('app.env') == 'local' && $otpcode == '123456') {

            } else {
                $failures++;
                cache([$cache_key => $failures], now()->addMinutes(360));
                return "Invalid OTP";    
            }
        }

        // clear all OTP requested after logged in.
        Otp::where('whatsapp_number', $member->whatsapp_number)->delete();

        $member->status = 'ACTIVE';
        $member->save();

        return null;
    }

    public function generateToken($member)
    {
        $unique_token = randomString(40);
        $payload = [
            'member_id' => $member->id, 
            'token' => $unique_token,
        ];
        $str_token = encrypt($payload);

        $mt = new MemberToken;
        $mt->member_id = $member->id;
        $mt->token = $unique_token;
        $mt->expired_date = now()->addDays(1);
        $mt->save();

        return $str_token;
    }

    public function logoutAllDevice($member)
    {
        MemberToken::where('member_id', $member->id)->delete();
    }

    public function logout(Member $member, $token="")
    {
        $mt = MemberToken::where('member_id', $member->id)
            ->where('token', $token)
            ->first();

        if (!empty($mt)) {
            $mt->delete();
        }        
    }
}