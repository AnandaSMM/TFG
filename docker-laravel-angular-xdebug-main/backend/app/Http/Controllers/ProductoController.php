<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use Illuminate\Http\JsonResponse;

class ProductoController extends Controller
{
    public function listarProductos(): JsonResponse
    {
        try {
            $productos = Producto::with('imagenes')->get();

            return response()->json([
                'total' => $productos->count(),
                'data' => $productos
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
        
}