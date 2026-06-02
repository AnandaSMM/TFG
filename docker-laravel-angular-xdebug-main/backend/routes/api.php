<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\AlquilerController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\InstalacionController;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::middleware('auth:sanctum')->get('/productos', [ProductoController::class, 'listarProductos']);
Route::get('/usuarios/{id}', [UserController::class, 'obtenerUsuario']);
Route::put('/usuarios/{id}', [UserController::class, 'actualizarUsuario']);
Route::get('/usuarios/{id}/stats', [UserController::class, 'infoUsuario']);
Route::delete('/usuarios/{id}', [UserController::class, 'eliminarUsuario']);
Route::post('/usuarios/foto/{id}', [UserController::class, 'actualizarFoto']);
Route::get('/productos/{id}', [ProductoController::class, 'obtenerProducto']);
Route::get('/productos/{id}/simple', [ProductoController::class, 'obtenerProductoSinImagenes']);

Route::get('/categorias', [CategoriaController::class, 'listarTodo']);
Route::post('/categorias', [CategoriaController::class, 'crearCategoria']);
Route::get('/categorias/{id}/productos', [CategoriaController::class, 'productosPorCategoria']);
Route::post('/productos/{id}/categorias', [CategoriaController::class, 'asignarCategorias']);
Route::get('/productos/{id}/categorias', [CategoriaController::class, 'categoriasPorProducto']);

Route::middleware('auth:sanctum')->post('/productos/{id}/alquilar', [AlquilerController::class, 'alquilar']);
Route::middleware('auth:sanctum')->get('/reservas', [AlquilerController::class, 'listarReservados']);
Route::middleware('auth:sanctum')->get('/prestados',[AlquilerController::class, 'listarProductosPrestados']);
Route::middleware('auth:sanctum')->get('/productos/{productoId}/reservas', [AlquilerController::class, 'listarReservasProducto']);
Route::middleware('auth:sanctum')->put('/alquileres/{id}/cancelar',[AlquilerController::class, 'cancelarAlquiler']);
Route::middleware('auth:sanctum')->put('/alquileres/{id}/devolucion', [AlquilerController::class, 'confirmarDevolucion']);

//google login
Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirect']);
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback']);

Route::get('/instalaciones', [InstalacionController::class, 'index']);
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});