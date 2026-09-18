<?php

use App\Http\Controllers\StoreController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->controller(StoreController::class)->group(function () {
    Route::get('/create-store/page', 'create_store_page')->name('create-store.page');
    Route::post('/create-store', 'store')->name('create-store.store');
    Route::get('/update/store/page', 'update_store_page')->name('update.store.page');
    Route::patch('/update/store/submit', 'update')->name('update.store.submit');
    Route::get('/vendor/dashboard', 'vendor_store_dashboard')->name('vendor.dashboard');
});

Route::controller(StoreController::class)->group(function () {
    Route::get('/store/{slug?}', 'view_vendor_store')->name('view.vendor.store');
});
