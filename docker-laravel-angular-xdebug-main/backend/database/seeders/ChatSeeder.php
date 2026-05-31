<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ChatSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('mensajes')->insert([
            // juan y ana
            [
                'emisor_id'   => 1, 
                'receptor_id' => 2, 
                'mensaje'     => 'Hola Ana, ¿sigue disponible el patinete para alquilar?',
                'leido'       => true,
                'fecha'       => now()->subMinutes(15),
            ],
            [
                'emisor_id'   => 2, 
                'receptor_id' => 1, 
                'mensaje'     => '¡Buenas Juan! Sí, está libre todo el fin de semana.',
                'leido'       => true,
                'fecha'       => now()->subMinutes(10), 
            ],
            [
                'emisor_id'   => 1, 
                'receptor_id' => 2, 
                'mensaje'     => 'Genial, pues luego te hago la reserva por la app.',
                'leido'       => true,
                'fecha'       => now()->subMinutes(5), 
            ],

            //juan y carlos
            [
                'emisor_id'   => 3, 
                'receptor_id' => 1, 
                'mensaje'     => 'Hola Juan, ¿me confirmas si puedo reservar tu plaza de garaje?',
                'leido'       => false, // 
                'fecha'       => now()->subMinutes(2),
            ],
            [
                'emisor_id'   => 3, 
                'receptor_id' => 1, 
                'mensaje'     => 'Juan, me confirmas o no tt???',
                'leido'       => false, // 
                'fecha'       => now()->subMinutes(1),
            ],
            
        ]);
    }
}