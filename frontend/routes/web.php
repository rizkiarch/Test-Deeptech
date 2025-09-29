<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->name('dashboard');

// Categories Routes
Route::get('/categories', function () {
    return Inertia::render('Categories/Index');
})->name('categories.index');

Route::get('/categories/create', function () {
    return Inertia::render('Categories/Create');
})->name('categories.create');

Route::get('/categories/{id}', function ($id) {
    return Inertia::render('Categories/Show', ['id' => $id]);
})->name('categories.show');

Route::get('/categories/{id}/edit', function ($id) {
    return Inertia::render('Categories/Edit', ['id' => $id]);
})->name('categories.edit');

// Products Routes
Route::get('/products', function () {
    return Inertia::render('Products/Index');
})->name('products.index');

Route::get('/products/create', function () {
    return Inertia::render('Products/Create');
})->name('products.create');

Route::get('/products/{id}', function ($id) {
    return Inertia::render('Products/Show', ['id' => $id]);
})->name('products.show');

Route::get('/products/{id}/edit', function ($id) {
    return Inertia::render('Products/Edit', ['id' => $id]);
})->name('products.edit');

// Transactions Routes
Route::get('/transactions', function () {
    return Inertia::render('Transactions/Index');
})->name('transactions.index');

Route::get('/transactions/create', function () {
    return Inertia::render('Transactions/Create');
})->name('transactions.create');

Route::get('/transactions/{id}', function ($id) {
    return Inertia::render('Transactions/Show', ['id' => $id]);
})->name('transactions.show');

Route::get('/transactions/{id}/edit', function ($id) {
    return Inertia::render('Transactions/Edit', ['id' => $id]);
})->name('transactions.edit');

Route::get('/transactions/bulk', function () {
    return Inertia::render('Transactions/Bulk');
})->name('transactions.bulk');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
