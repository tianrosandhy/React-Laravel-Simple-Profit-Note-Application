<?php
namespace App\Services;

use App\Models\Member;
use App\Models\Wallet;
use App\Models\Transaction;
use App\Models\Scopes\MemberScope;
use Log;

class WalletService
{
    public function initDefaultWallet(Member $member)
    {
        $default_wallet = Wallet::withoutGlobalScope(MemberScope::class)
            ->where('member_id', $member->id)
            ->where('is_default', true)
            ->first();

        if (empty($default_wallet)) {
            $default_wallet = new Wallet;
            $default_wallet->member_id = $member->id;
            $default_wallet->title = "Your Wallet";
            $default_wallet->balance = 0;
            $default_wallet->is_default = true;
            $default_wallet->save();
        }
    }

    public function getUsedWallet($wallet_id=null)
    {
        $default_wallet = Wallet::where('is_default', true)->first();
        $wallet = null;
        if (!empty($wallet_id)) {
            $wallet = Wallet::find($wallet_id);
            if (empty($wallet)) {
                return null; //force error
            }
        }
        if (!empty($wallet)) {
            return $wallet;
        }
        return $default_wallet;
    }

    public function recalculateBalance($member_id=null, $transaction_date)
    {
        $transactions = Transaction::where('member_id', $member_id)
            ->where('transaction_date', '>=', date('Y-m-d', strtotime($transaction_date) - 86400))
            ->orderBy('transaction_date', 'asc')
            ->orderBy('id', 'asc')
            ->get();
        
        $i = 0;
        $wallet_balance = 0;
        $total_balance = 0;
        foreach ($transactions as $row) {
            if ($i == 0) {
                $wallet_balance = $row->wallet_balance;
                $total_balance = $row->total_balance;
            } else {
                if ($row->expense > 0) {
                    $wallet_balance = $wallet_balance - $row->expense;
                    $total_balance = $total_balance - $row->expense;
                } else {
                    $wallet_balance = $wallet_balance + $row->income;
                    $total_balance = $total_balance + $row->income;
                }
            }

            $old_wallet_balance = $row->wallet_balance;
            $old_total_balance = $row->total_balance;
            if ($wallet_balance <> $old_wallet_balance || $total_balance <> $old_total_balance) {
                $row->wallet_balance = $wallet_balance;
                $row->total_balance = $total_balance;
                $row->save();

                Log::info("Recalculate balance for transaction id: $row->id from wallet balance: $old_wallet_balance to $wallet_balance, from total balance: $old_total_balance to $total_balance");
            }
            $i++;
        }

    }
}