<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ImagenProductoSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('imagenes_producto')->insert([
            ['producto_id' => 1, 'imagen' => 'productos/balon_futbol.jpg'],
            ['producto_id' => 1, 'imagen' => 'productos/dos.jpg'],
            ['producto_id' => 1, 'imagen' => 'productos/tres.jpg'],
            ['producto_id' => 2, 'imagen' => 'productos/palos_golf.jpg'],
            ['producto_id' => 2, 'imagen' => 'productos/uno.jpg'],
            ['producto_id' => 2, 'imagen' => 'productos/tres.jpg'],
            ['producto_id' => 3, 'imagen' => 'productos/balon_baloncesto.jpg'],
            ['producto_id' => 3, 'imagen' => 'productos/uno.jpg'],
            ['producto_id' => 3, 'imagen' => 'productos/dos.jpg'],
            ['producto_id' => 4, 'imagen' => 'productos/raqueta_tennis.jpg'],
            ['producto_id' => 5, 'imagen' => 'productos/tacos_futbol.jpg'],
            ['producto_id' => 6, 'imagen' => 'productos/red_voley.jpg'],
            ['producto_id' => 6, 'imagen' => 'productos/dos.jpg'],
            ['producto_id' => 6, 'imagen' => 'productos/tres.jpg'],
            ['producto_id' => 7, 'imagen' => 'productos/guantes_boxeo.jpg'],
            ['producto_id' => 8, 'imagen' => 'productos/guante_baseball.jpg'],
            ['producto_id' => 9, 'imagen' => 'productos/bate_baseball.jpg'],
            ['producto_id' => 9, 'imagen' => 'productos/bate_baseball2.jpg'],
            ['producto_id' => 10, 'imagen' => 'productos/equipamiento_yoga.jpg'],
            ['producto_id' => 11, 'imagen' => 'productos/conos.jpg'],
            ['producto_id' => 12, 'imagen' => 'productos/comba.jpg'],
            ['producto_id' => 13, 'imagen' => 'productos/uno.jpg'],
            ['producto_id' => 13, 'imagen' => 'productos/tres.jpg'],
            ['producto_id' => 13, 'imagen' => 'productos/dos.jpg'],
            ['producto_id' => 14, 'imagen' => 'productos/dos.jpg'],
            ['producto_id' => 14, 'imagen' => 'productos/uno.jpg'],
            ['producto_id' => 14, 'imagen' => 'productos/tres.jpg'],
            ['producto_id' => 15, 'imagen' => 'productos/tres.jpg'],
            ['producto_id' => 16, 'imagen' => 'productos/dos.jpg'],
            ['producto_id' => 16, 'imagen' => 'productos/tres.jpg'],
        ]);
    }
}