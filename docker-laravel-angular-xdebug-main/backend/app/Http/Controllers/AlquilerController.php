<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Alquiler;
use Illuminate\Http\Request;
use Carbon\Carbon;

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
          'usuario_id' => 1,
          'producto_id' => $producto->id,
          'fecha_inicio' => $fechaInicio,
          'fecha_fin' => $fechaFin,
          'precio_total' => $precioTotal,
          'estado' => 'activo',
          'opcion_compra' => $request->opcion_compra ?? false
      ]);
  
      return response()->json([
          'message' => 'Producto alquilado correctamente',
          'alquiler' => $alquiler
      ], 201);
  }
}
   
