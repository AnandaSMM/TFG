<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\AlquilerController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::get('/productos', [ProductoController::class, 'listarProductos']);
Route::get('/usuarios/{id}', [UserController::class, 'obtenerUsuario']);
Route::put('/usuarios/{id}', [UserController::class, 'actualizarUsuario']);
Route::delete('/usuarios/{id}', [UserController::class, 'eliminarUsuario']);
Route::get('/productos/{id}', [ProductoController::class, 'obtenerProducto']);

Route::get('/categorias', [CategoriaController::class, 'listarTodo']);
Route::post('/categorias', [CategoriaController::class, 'crearCategoria']);
Route::get('/categorias/{id}/productos', [CategoriaController::class, 'productosPorCategoria']);
Route::post('/productos/{id}/categorias', [CategoriaController::class, 'asignarCategorias']);
Route::get('/productos/{id}/categorias', [CategoriaController::class, 'categoriasPorProducto']);

Route::post('/productos/{id}/alquilar', [AlquilerController::class, 'alquilar']);