<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ImagenProducto;
use App\Models\Producto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductoController extends Controller
{
    public function listarProductos(Request $request): JsonResponse
    {
        try {
            $buscar     = $request->query('buscar');
            $categorias = $request->query('categorias', []);
            $usuarioId  = $request->user()?->id;

            $query = Producto::with(['imagenes', 'usuario:id,nombre', 'categorias']);

            if ($usuarioId) {
                $query->where('usuario_id', '!=', $usuarioId);
            }

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

            return response()->json($query->paginate(12));

        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function obtenerProducto($id): JsonResponse
    {
        try {
            $producto = Producto::with(['imagenes', 'usuario:id,nombre'])->find($id);

            if (!$producto) {
                return response()->json(['message' => 'Producto no encontrado'], 404);
            }

            return response()->json(['data' => $producto]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener el producto',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    public function obtenerProductoSinImagenes($id): JsonResponse
    {
        $producto = Producto::with(['usuario:id,nombre'])
            ->select(['id','usuario_id','nombre','descripcion','precio_venta','precio_alquiler_dia','disponible','localidad'])
            ->find($id);

        if (!$producto) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }

        return response()->json(['data' => $producto]);
    }

    public function misProductos(Request $request): JsonResponse
    {
        $productos = Producto::with(['imagenes', 'categorias'])
            ->where('usuario_id', $request->user()->id)
            ->get();

        return response()->json(['data' => $productos]);
    }

    public function crearProducto(Request $request): JsonResponse
    {
        $request->validate([
            'nombre'              => 'required|string|max:255',
            'descripcion'         => 'nullable|string',
            'precio_alquiler_dia' => 'required|numeric|min:0',
            'precio_venta'        => 'nullable|numeric|min:0',
            'localidad'           => 'nullable|string|max:255',
            'disponible'          => 'nullable',
            'imagenes'            => 'nullable|array',
            'imagenes.*'          => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $producto = Producto::create([
            'usuario_id'          => $request->user()->id,
            'nombre'              => $request->nombre,
            'descripcion'         => $request->descripcion,
            'precio_alquiler_dia' => $request->precio_alquiler_dia,
            'precio_venta'        => $request->precio_venta ?: null,
            'localidad'           => $request->localidad,
            'disponible'          => filter_var($request->disponible, FILTER_VALIDATE_BOOLEAN),
            'vendido'             => false,
        ]);

        if ($request->hasFile('imagenes')) {
            foreach ($request->file('imagenes') as $imagen) {
                $path = $imagen->store('productos', 'public');
                $producto->imagenes()->create(['imagen' => $path]);
            }
        }

        return response()->json([
            'message'  => 'Producto creado correctamente',
            'producto' => $producto->load('imagenes')
        ], 201);
    }

    public function actualizarProducto(Request $request, $id): JsonResponse
    {
        $producto = Producto::where('id', $id)
            ->where('usuario_id', $request->user()->id)
            ->first();

        if (!$producto) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }

        $request->validate([
            'nombre'              => 'string|max:255',
            'descripcion'         => 'nullable|string',
            'precio_alquiler_dia' => 'numeric|min:0',
            'precio_venta'        => 'nullable|numeric|min:0',
            'localidad'           => 'nullable|string|max:255',
            'disponible'          => 'nullable',
            'imagenes'            => 'nullable|array',
            'imagenes.*'          => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $producto->update([
            'nombre'              => $request->nombre              ?? $producto->nombre,
            'descripcion'         => $request->descripcion,
            'precio_alquiler_dia' => $request->precio_alquiler_dia ?? $producto->precio_alquiler_dia,
            'precio_venta'        => $request->precio_venta        ?: null,
            'localidad'           => $request->localidad,
            'disponible'          => $request->has('disponible')
                                        ? filter_var($request->disponible, FILTER_VALIDATE_BOOLEAN)
                                        : $producto->disponible,
        ]);

        if ($request->hasFile('imagenes')) {
            foreach ($request->file('imagenes') as $imagen) {
                $path = $imagen->store('productos', 'public');
                $producto->imagenes()->create(['imagen' => $path]);
            }
        }

        return response()->json([
            'message'  => 'Producto actualizado correctamente',
            'producto' => $producto->load('imagenes')
        ]);
    }

    public function eliminarProducto(Request $request, $id): JsonResponse
    {
        $producto = Producto::where('id', $id)
            ->where('usuario_id', $request->user()->id)
            ->first();

        if (!$producto) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }

        foreach ($producto->imagenes as $img) {
            Storage::disk('public')->delete($img->imagen);
        }

        $producto->delete();

        return response()->json(['message' => 'Producto eliminado correctamente']);
    }

    public function eliminarImagen(Request $request, $imagenId): JsonResponse
    {
        $imagen = ImagenProducto::find($imagenId);

        if (!$imagen) {
            return response()->json(['message' => 'Imagen no encontrada'], 404);
        }

        // Seguridad: verificar que la imagen pertenece a un producto del usuario
        $producto = Producto::where('id', $imagen->producto_id)
            ->where('usuario_id', $request->user()->id)
            ->first();

        if (!$producto) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        Storage::disk('public')->delete($imagen->imagen);
        $imagen->delete();

        return response()->json(['message' => 'Imagen eliminada correctamente']);
    }
}