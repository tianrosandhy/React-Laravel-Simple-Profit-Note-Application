<?php

namespace App\Http\Controllers;

use App\Models\Wallet;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    public function index()
    {
        $page = request()->get('page', 1);
        $per_page = request()->get('per_page', 100);

        $wallets = Wallet::paginate($per_page, ['*'], 'page', $page);

        return okJson($wallets, "Wallets data");
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
        ]);

        $label = Wallet::create([
            'member_id' => request()->get('member')->id,
            'title' => $request->title,
            'balance' => 0,
            'is_default' => false,
        ]);

        return okJson($label, "Wallet created");
    }

    public function show($id)
    {
        $label = Wallet::findOrFail($id);

        return okJson($label, "Wallet data");
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string',
        ]);

        $label = Wallet::findOrFail($id);
        $label->update([
            'title' => $request->title,
        ]);

        return okJson($label, "Wallet data updated");
    }

    public function destroy($id)
    {
        $label = Wallet::findOrFail($id);

        if ($label->is_default) {
            return errJson("Cannot delete default wallet");
        }
        if ($label->balance > 0) {
            return errJson("This wallet still contain balance. set balance to 0 first before delete this wallet data.");
        }

        $label->delete();
        return okJson(null, "Wallet deleted");
    }
}