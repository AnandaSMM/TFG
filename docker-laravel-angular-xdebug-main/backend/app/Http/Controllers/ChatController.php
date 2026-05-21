<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Chat;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\User;


class ChatController extends Controller
{

    public function listarConversaciones(Request $request,$id): JsonResponse
    {
        $user = User::find($id);
         if (!$user) {
            return response()->json([
                'message' => 'Usuario no encontrado'
            ], 404);
        }
        try {


            $mensajes=Chat::with(['emisor', 'receptor'])
            ->where('emisor_id',$id)
            ->orWhere('receptor_id',$id)
            ->orderBy('fecha','desc')
            ->get();

            $listaChats=[];
            foreach ($mensajes as $mensaje) {
                if ($mensaje->emisor_id==$id) {//si soy el emisor guardo la info del receptor
                    $otroUsuarioId = $mensaje->receptor_id;
                    $datosDelOtro  = $mensaje->receptor;
                } else {
                    $otroUsuarioId = $mensaje->emisor_id;
                    $datosDelOtro  = $mensaje->emisor;
                }
                if (!isset($listaChats[$otroUsuarioId])) {
                    $listaChats[$otroUsuarioId] = [
                        'otro_usuario_id' => $otroUsuarioId,
                        'nombre'          => $datosDelOtro ? $datosDelOtro->nombre : 'Usuario Eliminado',
                        'foto'            => $datosDelOtro ? $datosDelOtro->foto : null,
                        'ultimo_mensaje'  => $mensaje->mensaje,
                        'fecha'           => $mensaje->fecha,
                        'no_leido'           => 0,
                        //'soy_emisor'      => $mensaje->emisor_id == $id   para loddel pajarito ....
                    ]; 
                }
                if ($mensaje->leido == false && $mensaje->receptor_id == $id) {//si n lo he leido y lo recibio YO ps sumamos
                    $listaChats[$otroUsuarioId]['no_leido'] += 1;
                }
                
            }
            
            return response()->json([
                'data' => array_values($listaChats)
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'No se pudo cargar los chats',
                'details' => $e->getMessage()
            ], 500);
        }
    }
    
    public function obtenerConversacion(Request $request, $id): JsonResponse
    {
        $user = User::find($id);
         if (!$user) {
            return response()->json([
                'message' => 'Usuario no encontrado'
            ], 404);
        }
        try {
            $request->validate([//validacion de q el otro exista 
                'persona_id'   => 'required|exists:usuarios,id',
            ]);

            $otroId = $request->input('persona_id');

            $mensajes = Chat::with(['emisor', 'receptor'])
            ->where(function ($query) use ($id, $otroId) {
                $query->where('emisor_id', $id)
                      ->where('receptor_id', $otroId);
            })
            ->orWhere(function ($query) use ($id, $otroId) {
                $query->where('emisor_id', $otroId)
                      ->where('receptor_id', $id);
            })
            ->orderBy('fecha', 'asc') 
            ->get();

            return response()->json([
                 'data' => $mensajes
            ], 200);

        } catch (\Throwable $e) {
           return response()->json([
                'error' => 'No se pudo enviar el mensaje',
                'details' => $e->getMessage()
            ], 500);
        }
    }
    /*
    public function enviarMensaje(Request $request,$id): JsonResponse
    {
        try {
            $user = User::find($id);
            if (!$user) {
                return response()->json([
                    'message' => 'Usuario no encontrado'
                ], 404);
            }
            $request->validate([
                'emisor_id'   => 'required|exists:usuarios,id',
                'receptor_id' => 'required|exists:usuarios,id',
                'mensaje'     => 'required|string|min:1',
            ]);
            $nuevoMensaje= Chat::create([
                'emisor_id'   => $id,
                'receptor_id' => $request->input('receptor_id'),
                'mensaje'     => $request->input('mensaje'),
                'leido'       => false, 
                'fecha'       => now(),
            ]);
            return response()->json([
                'message' => 'Mensaje enviado correctamente',
                'data'    => $nuevoMensaje
            ], 201);

        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'No se pudo enviar el mensaje',
                'details' => $e->getMessage()
            ], 500);
        }
    }
        */
}