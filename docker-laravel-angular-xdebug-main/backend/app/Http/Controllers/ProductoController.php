<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductoController extends Controller
{
    public function listarProductos(Request $request): JsonResponse
    {
        try {
            $buscar = $request->query('buscar');
            $categorias = $request->query('categorias', []);

            $query = Producto::with(['imagenes', 'usuario:id,nombre', 'categorias']);

            if (!empty($buscar)) {
                $query->where(function ($q) use ($buscar) {
                    $q->where('nombre', 'like', '%' . $buscar . '%')
                    ->orWhere('localidad', 'like', '%' . $buscar . '%')
                    ->orWhere('descripcion', 'like', '%' . $buscar . '%');
                });
            }

            if (!empty($categorias) && is_array($categorias)) {
                $query->whereHas('categorias', function ($q) use ($categorias) {
                    $q->whereIn('categorias.id', $categorias);
                });
            }

            $productos = $query->paginate(12);

            return response()->json($productos);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function obtenerProducto($id)
    {
        try {
            $producto = Producto::with(['imagenes', 'usuario:id,nombre'])->find($id);
            if (!$producto) {
                return response()->json([
                    'message' => 'Producto no encontrado'
                ], 404);
            }
            return response()->json([
                'data' => $producto
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener el producto',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
}