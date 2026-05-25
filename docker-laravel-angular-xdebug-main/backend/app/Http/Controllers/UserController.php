<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function obtenerUsuario($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'message' => 'Usuario no encontrado'
            ], 404);
        }

        return response()->json($user);
    }
    public function actualizarFoto(Request $request,$id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'message' => 'Usuario no encontrado'
            ], 404);
        }
        $request->validate([
            'foto' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', //max 2MB
        ]);
        if ($user->foto) {//si tenia fto la borramos
            Storage::disk('public')->delete($user->foto);
        }
        $path = $request->file('foto')->store('usuarios', 'public');//monatmos nombre y guardamos en storage....

        $user->foto = $path;//guardo en el valor d la fto la ruta dnde esta la fto
        $user->save();

        return response()->json([
            'message' => 'Foto actualizada correctamente',
            'fotoPath' => $path,
            'user' => $user 
        ]);

    }

    public function actualizarUsuario(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'message' => 'Usuario no encontrado'
            ], 404);
        }

        $request->validate([
            'nombre' => 'string|max:255',
            'email' => 'string|email|unique:usuarios,email,' . $id,
            'telefono' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:8'
        ]);

        $data = $request->only(['nombre', 'email', 'telefono']);

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return response()->json([
            'message' => 'Usuario actualizado correctamente',
            'user' => $user
        ]);
    }

    public function eliminarUsuario($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'message' => 'Usuario no encontrado'
            ], 404);
        }

        $user->delete();

        return response()->json([
            'message' => 'Usuario eliminado correctamente'
        ]);
    }

    public function infoUsuario($id){
        $user = User::withCount([
            'alquileresRecibidos as total_alquileres',
            'alquileresRecibidos as alquileres_activos' => function ($query) {
                $query->where('estado', 'activo');
            }
        ])->find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Usuario no encontrado'
            ], 404);
        }
        return response()->json([
            'alquileres'    => $user->total_alquileres,
            'alquileresAct' => $user->alquileres_activos,
        ]);
    }



}