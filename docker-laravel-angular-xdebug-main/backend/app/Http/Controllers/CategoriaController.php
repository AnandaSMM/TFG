<?php
 namespace App\Http\Controllers;

 use App\Http\Controllers\Controller;
 use App\Models\Categoria;
 use App\Models\Producto;
 use Illuminate\Http\Request;

class CategoriaController extends Controller 
{
  public function listarTodo()
  {
      $categorias = Categoria::all();

      return response()->json([
          'data' => $categorias
      ]);
  }

  public function crearCategoria(Request $request)
  {
      $request->validate([
          'nombre' => 'required|string|max:100|unique:categorias,nombre'
      ]);

      $categoria = Categoria::create([
          'nombre' => $request->nombre
      ]);

      return response()->json([
          'message' => 'Categoría creada correctamente',
          'data' => $categoria
      ], 201);
  }

  public function asignarCategorias(Request $request, $productoId)
  {
      $request->validate([
            'categorias'   => 'present|array',
            'categorias.*' => 'exists:categorias,id'
        ]);
      $producto = Producto::find($productoId);

      if (!$producto) {
          return response()->json([
              'message' => 'Producto no encontrado'
          ], 404);
      }
      $producto->categorias()->sync($request->categorias);
      return response()->json([
          'message' => 'Categorías asignadas correctamente'
      ]);
  }
  public function productosPorCategoria($categoriaId)
  {
      $categoria = Categoria::with('productos.imagenes')->find($categoriaId);

      if (!$categoria) {
          return response()->json([
              'message' => 'Categoría no encontrada'
          ], 404);
      }

      return response()->json([
          'data' => $categoria->productos
      ]);
  }
  public function categoriasPorProducto($productoId)
  {
      $producto = Producto::with('categorias')->find($productoId);

      if (!$producto) {
          return response()->json([
              'message' => 'Producto no encontrado'
          ], 404);
      }

      return response()->json([
          'data' => $producto->categorias
      ]);
  }

}