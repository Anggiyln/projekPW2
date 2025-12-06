<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BarangController;
use App\Http\Controllers\TransaksiController;
use App\Http\Controllers\UserController;


// === ROUTE LOGIN API ===
Route::post('/login', [AuthController::class, 'login']);
// === ROUTE register API ===
Route::post('/register', [AuthController::class, 'register']); 
// === ROUTE YANG BUTUH LOGIN ===
Route::middleware('auth:sanctum')->group(function () {

    // Barang
    Route::get('/barang', [BarangController::class, 'index']);
    Route::post('/barang', [BarangController::class, 'store']);
    Route::put('/barang/{id}', [BarangController::class, 'update']);
    Route::delete('/barang/{id}', [BarangController::class, 'destroy']);

    // Transaksi
    Route::post('/barang-masuk',  [TransaksiController::class, 'masuk']);
    Route::post('/barang-keluar', [TransaksiController::class, 'keluar']);

     // RIWAYAT TRANSAKSI
    Route::get('/riwayat-masuk',  [TransaksiController::class, 'riwayatMasuk']);
    Route::get('/riwayat-keluar', [TransaksiController::class, 'riwayatKeluar']);

    // MANAJEMEN USER (KHUSUS ADMIN, dicek di controller)
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
});
