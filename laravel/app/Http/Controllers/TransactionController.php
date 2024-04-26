<?php

namespace App\Http\Controllers;

use App\Models\Wallet;
use App\Models\Label;
use App\Models\Transaction;
use Illuminate\Http\Request;
use App\Http\Requests\GetTransactionRequest;
use App\Http\Requests\GenerateTransactionRequest;
use WalletService;
use LabelService;

class TransactionController extends Controller
{
    public function index(GetTransactionRequest $request)
    {
        $page = $request->get('page', 1);
        $per_page = $request->get('per_page', 50);

        $transactions = Transaction::orderBy('transaction_date', 'DESC')
            ->orderBy('id', 'DESC')
            ->when(strlen($request->wallet_id) > 0, function($qry) use($request) {
                return $qry->where('wallet_id', $request->wallet_id);
            })
            ->when(strlen($request->label_id) > 0, function($qry) use($request) {
                return $qry->where('label_id', $request->label_id);
            })
            ->when(strlen($request->start_transaction_date) > 0, function($qry) use($request) {
                return $qry->where('transaction_date', '>=', $request->start_transaction_date);
            })
            ->when(strlen($request->end_transaction_date) > 0, function($qry) use($request) {
                return $qry->where('transaction_date', '<=', $request->end_transaction_date);
            })
            ->paginate($per_page, ['*'], 'page', $page);

        return okJson($transactions, 'Your transaction mutation history');
    }

    public function create(GenerateTransactionRequest $request)
    {
        $used_wallet = WalletService::getUsedWallet($request->wallet_id);
        $used_label = LabelService::getUsedLabel($request->label_id);

        if (empty($used_wallet)) {
            return errJson("Invalid request or wallet not found");
        }

        $member_balance = intval($request->get('member')->balance);
        $wallet_balance = intval($used_wallet->balance);
        if ($request->type == 'expense' && ($wallet_balance < intval($request->amount) || $member_balance < intval($request->amount))) {
            return errJson("Insufficient balance");
        }

        if ($request->type == 'expense') {
            $wallet_balance = $wallet_balance - intval($request->amount);
            $member_balance = $member_balance - intval($request->amount);
        } else {
            $wallet_balance = $wallet_balance + intval($request->amount);
            $member_balance = $member_balance + intval($request->amount);
        }

        $transaction = new Transaction;
        $transaction->member_id = $request->get('member')->id;
        $transaction->wallet_id = $used_wallet->id ?? null;
        $transaction->label_id = $used_label->id ?? null;
        if ($request->type == 'expense') {
            $transaction->expense = intval($request->amount);
        } else {
            $transaction->income = intval($request->amount);
        }
        $transaction->transaction_date = isset($request->transaction_date) ? date('Y-m-d', strtotime($request->transaction_date)) : date('Y-m-d');
        $transaction->notes = $request->notes;
        $transaction->wallet_balance = $wallet_balance;
        $transaction->total_balance = $member_balance;
        $transaction->save();

        // update wallet master balance too
        $used_wallet->balance = $wallet_balance;
        $used_wallet->save();

        $request->get('member')->balance = $member_balance;
        $request->get('member')->save();

        if ($transaction->transaction_date <> date('Y-m-d')) {
            // must be recalculate :')
            WalletService::recalculateBalance($request->get('member')->id, $transaction->transaction_date);
        }

        return okJson([
            'transaction' => $transaction,
            'new_wallet_balance' => $wallet_balance,
            'new_total_balance' => $member_balance,
        ], 'Transaction record created successfully');
    }

    public function delete($transaction_id)
    {
        $transaction = Transaction::find($transaction_id);
        if (empty($transaction)) {
            return errJson("Transaction not found");
        }

        $wallet = Wallet::find($transaction->wallet_id);
        if (empty($wallet)) {
            return errJson("Wallet not found");
        }

        $member_balance = intval($request->get('member')->balance);
        $wallet_balance = intval($wallet->balance);

        if ($transaction->type == 'expense') {
            $wallet_balance = $wallet_balance + intval($transaction->expense);
            $member_balance = $member_balance + intval($transaction->expense);
        } else {
            $wallet_balance = $wallet_balance - intval($transaction->income);
            $member_balance = $member_balance - intval($transaction->income);
        }

        if ($wallet_balance < 0 || $member_balance < 0) {
            return errJson("Sorry, we cannot delete this transaction, because it will make your balance negative.");
        }

        $transaction->delete();

        // update wallet master balance too
        $wallet->balance = $wallet_balance;
        $wallet->save();

        $request->get('member')->balance = $member_balance;
        $request->get('member')->save();

        return okJson([
            'new_wallet_balance' => $wallet_balance,
            'new_total_balance' => $member_balance,
        ], 'Transaction deleted successfully');
    }

    public function report(Request $request)
    {
        $start_date = date('Y-m-01');
        $end_date = date('Y-m-t');

        if ($request->start_transaction_date) {
            $start_date = date('Y-m-d', strtotime($request->start_transaction_date));
        }
        if ($request->end_transaction_time) {
            $end_date = date('Y-m-d', strtotime($request->end_transaction_date));
        }
        if ($request->start_transaction_date && !$request->end_transaction_date) {
            $end_date = date('Y-m-t', strtotime($request->start_transaction_date));
        }
        if ($request->end_transaction_date && !$request->start_transaction_date) {
            $start_date = date('Y-m-0', strtotime($request->end_transaction_date));
        }

        $transactions = Transaction::orderBy('transaction_date', 'ASC')
            ->orderBy('id', 'ASC')
            ->where('transaction_date', '>=', $start_date)
            ->where('transaction_date', '<=', $end_date)
            ->get();

        $grouped_summary = [];
        $per_wallet_summary = [];
        $dates = [];
        $wallets = [];
        foreach ($transactions as $trans) {
            $date = $trans->transaction_date;
            if (!in_array($date, $dates)) {
                $dates[] = $date;
            }

            if (!isset($grouped_summary[$date])) {
                $grouped_summary[$date] = 0;
            }
            $grouped_summary[$date] = $trans->total_balance;
            if ($trans->wallet_id) {
                if (!in_array($trans->wallet_id, $wallets)) {
                    $wallets[] = $trans->wallet_id;
                }
                if (!isset($per_wallet_summary[$date][$trans->wallet_id])) {
                    $per_wallet_summary[$date][$trans->wallet_id] = 0;
                }
                $per_wallet_summary[$date][$trans->wallet_id] = $trans->wallet_balance;
            }
        }

        $labels = [];
        $summary = [];
        $wallets_summary = [];
        foreach ($wallets as $wallet_id) {
            $wallets_summary[$wallet_id] = [];
        }

        foreach ($dates as $date) {
            $labels[] = date('d M', strtotime($date));
            $summary[] = $grouped_summary[$date] ?? 0;
            foreach ($wallets as $wallet_id) {
                $wallets_summary[$wallet_id][] = $per_wallet_summary[$date][$wallet_id] ?? 0;
            }
        }

        return okJson([
            'labels' => $labels,
            'summary' => $summary,
            'wallet_ids' => $wallets,
            'wallets_summary' => (object)$wallets_summary,
        ], 'Transaction report');
    }
}