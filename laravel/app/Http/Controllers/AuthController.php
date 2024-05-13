<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuthRegisterRequest;
use App\Http\Requests\AuthWhatsappNumberRequest;
use App\Http\Requests\AuthOTPValidateRequest;
use App\Models\Member;
use Illuminate\Http\Request;
use AuthService;
use WalletService;

class AuthController extends Controller
{
    public function register(AuthRegisterRequest $request)
    {
        $whatsapp_number = normalizePhone($request->whatsapp_number);
        $member = Member::where('whatsapp_number', $whatsapp_number)->first();
        if (empty($member)) {
            $member = new Member;
        } else {
            if ($member->status == 'ACTIVE') {
                return errJson("Sorry, your account is already active");
            }
        }

        $member->whatsapp_number = $whatsapp_number;
        $member->full_name = $request->full_name;
        $member->merchant_title = $request->merchant_title ?? ($request->full_name . ' Store');
        $member->status = 'PENDING';
        $member->save();

        $err = AuthService::sendOtp($member);
        if (!empty($err)) {
            return errJson($err);
        }

        return okJson([
            'member_id' => $member->id,
            'status' => 'PENDING',
            'otp' => true,
        ], 'Member registered successfully. Please check the OTP sent to your device to activate your account');
    }

    public function login(AuthWhatsappNumberRequest $request)
    {
        $whatsapp_number = normalizePhone($request->whatsapp_number);
        $member = AuthService::activeMember($whatsapp_number);
        if (empty($member)) {
            return errJson("Sorry, we cannot find your account");
        }

        $err = AuthService::sendOtp($member);
        if (!empty($err)) {
            return errJson($err);
        }

        $success_message = 'Please check the OTP sent to your device to login';
        if (config('app.env') == 'local') {
            $success_message = 'OTP Send [Dummy]. Please insert 123456 as your OTP.';
        }

        return okJson([
            'member_id' => $member->id,
            'status' => $member->status,
            'otp' => true,
        ], $success_message);
    }

    public function resendOtp(AuthWhatsappNumberRequest $request)
    {
        $whatsapp_number = normalizePhone($request->whatsapp_number);
        $member = AuthService::activeMember($whatsapp_number);
        if (empty($member)) {
            return errJson("Sorry, we cannot find your account");
        }

        $err = AuthService::sendOtp($member);
        if (!empty($err)) {
            return errJson($err);
        }

        return okJson([
            'member_id' => $member->id,
            'status' => $member->status,
            'otp' => true,
        ], 'Please check the OTP sent to your device to continue');
    }

    public function validateOtp(AuthOTPValidateRequest $request)
    {
        $whatsapp_number = normalizePhone($request->whatsapp_number);
        $member = AuthService::activeMember($whatsapp_number);
        if (empty($member)) {
            return errJson("Sorry, we cannot find your account");
        }

        $err = AuthService::validateOtp($member, $request->otp);
        if (!empty($err)) {
            return errJson($err);
        }

        // logged in handler
        $token = AuthService::generateToken($member);

        // init empty default wallet if not exists
        WalletService::initDefaultWallet($member);
        
        return okJson([
            'member_id' => $member->id,
            'token' => $token,
            'status' => $member->status,
        ]);
    }

    public function profile(Request $request)
    {
        $member = $request->get('member');
        return okJson($member, "Profile data");
    }

    public function logout(Request $request)
    {
        if ($request->all) {
            AuthService::logoutAllDevice($request->get('member'));
        } else {
            AuthService::logout($request->get('member'), $request->get('token'));
        }
        return okJson();
    }
}
