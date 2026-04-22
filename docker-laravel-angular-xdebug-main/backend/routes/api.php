<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\UserController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::get('/productos', [ProductoController::class, 'listarProductos']);

Route::get('/usuarios/{id}', [UserController::class, 'obtenerUsuario']);
Route::put('/usuarios/{id}', [UserController::class, 'actualizarUsuario']);
Route::delete('/usuarios/{id}', [UserController::class, 'eliminarUsuario']);
