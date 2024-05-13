<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\LabelController;
use App\Http\Controllers\TransactionController;

Route::middleware([
    \App\Http\Middleware\ApiBasicAuth::class,
])->group(function() {

    Route::get('/', function() {
        return okJson();
    });

    Route::post('/auth/register', [AuthController::class, 'register'])->name('api.auth.register');
    Route::post('/auth/login', [AuthController::class, 'login'])->name('api.auth.login');
    Route::post('/auth/resend-otp', [AuthController::class, 'resendOtp'])->name('api.auth.resend-otp');
    Route::post('/auth/validate-otp', [AuthController::class, 'validateOtp'])->name('api.auth.validate-otp');
});

Route::middleware([
    \App\Http\Middleware\ApiBearerAuth::class,
])->group(function() {

    Route::get('/auth/profile', [AuthController::class, 'profile'])->name('api.auth.profile');
    Route::post('/auth/logout', [AuthController::class, 'logout'])->name('api.auth.logout');

    Route::apiResource('wallets', WalletController::class);
    Route::apiResource('labels', LabelController::class);

    Route::get('/transactions', [TransactionController::class, 'index'])->name('api.transactions.index');
    Route::get('/transactions/report', [TransactionController::class, 'report'])->name('api.transactions.report');
    Route::post('/transactions/new', [TransactionController::class, 'create'])->name('api.transactions.new');
    Route::get('/transactions/{transaction_id}', [TransactionController::class, 'detail'])->name('api.transactions.detail');
    Route::match(['put', 'patch'], '/transactions/{transaction_id}', [TransactionController::class, 'update'])->name('api.transactions.update');    
    Route::delete('/transactions/{transaction_id}', [TransactionController::class, 'delete'])->name('api.transactions.delete');
});