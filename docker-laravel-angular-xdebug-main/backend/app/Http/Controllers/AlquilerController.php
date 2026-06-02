<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Alquiler;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use App\Mail\ReservaCreadaMail;
use App\Mail\ReservaCanceladaMail;


class AlquilerController extends Controller 
{

    public function alquilar(Request $request, $id)
    {
        $request->validate([
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
            'opcion_compra' => 'boolean'
        ]);

        $producto = Producto::findOrFail($id);

        if (!$producto->disponible || $producto->vendido) {
            return response()->json([
                'message' => 'Este producto no está disponible'
            ], 400);
        }

        $fechaInicio = $request->fecha_inicio;
        $fechaFin = $request->fecha_fin;

        $existeAlquiler = Alquiler::where('producto_id', $producto->id)
            ->where('estado', 'activo')
            ->where('fecha_inicio', '<=', $fechaFin)
            ->where('fecha_fin', '>=', $fechaInicio)
            ->exists();
            if ($existeAlquiler) {
            return response()->json([
                'message' => 'El producto ya está alquilado en esas fechas'
            ], 409);
            }

            $inicio = Carbon::parse($fechaInicio);
            $fin = Carbon::parse($fechaFin);
            $dias = $inicio->diffInDays($fin) + 1;
            $precioTotal = $dias * $producto->precio_alquiler_dia;

            $alquiler = Alquiler::create([
                'usuario_id' => $request->user()->id,
                'producto_id' => $producto->id,
                'fecha_inicio' => $fechaInicio,
                'fecha_fin' => $fechaFin,
                'precio_total' => $precioTotal,
                'estado' => 'activo',
                'opcion_compra' => $request->opcion_compra ?? false
            ]);

            //mandar mensaje al alquilar
            try {
            Mail::to($producto->usuario->email)
                    ->send(new ReservaCreadaMail($alquiler));
            } catch (\Exception $e) {
                \Log::error('Error enviando email de reserva: ' . $e->getMessage());
            }
        return response()->json([
            'message' => 'Producto alquilado correctamente',
            'alquiler' => $alquiler
        ], 201);
    }

    public function listarReservados(Request $request)
    {
        $usuario = $request->user();
        if (!$usuario) {
            return response()->json([
                'message' => 'Usuario no autenticado'
            ], 401);
        }
        $reservas = Alquiler::with([
                'producto:id,nombre'
            ])
            ->where('usuario_id', $usuario->id)
            ->where('estado', 'activo')
            ->orderBy('fecha_inicio', 'asc')
            ->get([
                'id',
                'usuario_id',
                'producto_id',
                'fecha_inicio',
                'fecha_fin',
                'precio_total',
                'estado'
            ]);

        return response()->json([
            'message' => 'Reservas obtenidas correctamente',
            'reservas' => $reservas
        ]);
    }

    public function listarReservasProducto($productoId)
    {
        $reservas = Alquiler::where('producto_id', $productoId)
            ->where('estado', 'activo')
            ->orderBy('fecha_inicio', 'asc')
            ->get([
                'id',
                'producto_id',
                'fecha_inicio',
                'fecha_fin',
                'estado'
            ]);

        return response()->json([
            'message' => 'Reservas del producto obtenidas correctamente',
            'reservas' => $reservas
        ]);
    }

    public function listarProductosPrestados(Request $request)
    {
        $usuario = $request->user();
        if (!$usuario) {
            return response()->json([
                'message' => 'Usuario no autenticado'
            ], 401);
        }
        $prestados = Alquiler::with([
                'producto:id,usuario_id,nombre'
            ])
            ->where('estado', 'activo')
            ->whereHas('producto', function ($query) use ($usuario) {
                $query->where('usuario_id', $usuario->id);
            })
            ->orderBy('fecha_inicio', 'asc')
            ->get([
                'id',
                'usuario_id',
                'producto_id',
                'fecha_inicio',
                'fecha_fin',
                'precio_total',
                'estado'
            ]);

        return response()->json([
            'message' => 'Productos prestados obtenidos correctamente',
            'prestados' => $prestados
        ]);
    }    
    
    public function cancelarAlquiler(Request $request, $id)
    {
        $usuario = $request->user();

        if (!$usuario) {
            return response()->json([
                'message' => 'Usuario no autenticado'
            ], 401);
        }

        $alquiler = Alquiler::find($id);

        if (!$alquiler) {
            return response()->json([
                'message' => 'Alquiler no encontrado'
            ], 404);
        }

        if ($alquiler->estado !== 'activo') {
            return response()->json([
                'message' => 'Este alquiler ya no está activo'
            ], 400);
        }

        $hoy = Carbon::today();
        $fechaInicio = Carbon::parse($alquiler->fecha_inicio);

        if ($hoy->greaterThanOrEqualTo($fechaInicio)) {
            return response()->json([
                'message' => 'Solo puedes cancelar el alquiler antes de la fecha de inicio'
            ], 400);
        }

        $alquiler->estado = 'cancelado';
        $alquiler->save();
        //mandar mail de cancelación
        try {
            Mail::to($alquiler->producto->usuario->email)
                ->send(new ReservaCanceladaMail($alquiler));
        } catch (\Exception $e) {
            \Log::error('Error enviando email de cancelación: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Alquiler cancelado correctamente',
            'alquiler' => $alquiler
        ]);
    }

    public function confirmarDevolucion($id)
    {
        $alquiler = Alquiler::find($id);

        if (!$alquiler) {
            return response()->json([
                'message' => 'Alquiler no encontrado'
            ], 404);
        }

        if ($alquiler->estado !== 'activo') {
            return response()->json([
                'message' => 'Este alquiler ya no está activo'
            ], 400);
        }

        $alquiler->estado = 'finalizado';
        $alquiler->save();

        return response()->json([
            'message' => 'Devolución confirmada correctamente',
            'alquiler' => $alquiler
        ]);
    }

}
   
