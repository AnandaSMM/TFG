<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ImagenProductoSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('imagenes_producto')->insert([
            ['producto_id' => 1, 'imagen' => 'productos/uno.jpg'],
            ['producto_id' => 1, 'imagen' => 'productos/dos.jpg'],
            ['producto_id' => 1, 'imagen' => 'productos/tres.jpg'],
            ['producto_id' => 2, 'imagen' => 'productos/dos.jpg'],
            ['producto_id' => 2, 'imagen' => 'productos/uno.jpg'],
            ['producto_id' => 2, 'imagen' => 'productos/tres.jpg'],
            ['producto_id' => 3, 'imagen' => 'productos/tres.jpg'],
            ['producto_id' => 3, 'imagen' => 'productos/uno.jpg'],
            ['producto_id' => 3, 'imagen' => 'productos/dos.jpg'],
            ['producto_id' => 4, 'imagen' => 'productos/uno.jpg'],
            ['producto_id' => 5, 'imagen' => 'productos/uno.jpg'],
            ['producto_id' => 6, 'imagen' => 'productos/uno.jpg'],
            ['producto_id' => 6, 'imagen' => 'productos/dos.jpg'],
            ['producto_id' => 6, 'imagen' => 'productos/tres.jpg'],
            ['producto_id' => 7, 'imagen' => 'productos/dos.jpg'],
            ['producto_id' => 8, 'imagen' => 'productos/dos.jpg'],
            ['producto_id' => 9, 'imagen' => 'productos/dos.jpg'],
            ['producto_id' => 10, 'imagen' => 'productos/dos.jpg'],
            ['producto_id' => 11, 'imagen' => 'productos/tres.jpg'],
            ['producto_id' => 12, 'imagen' => 'productos/tres.jpg'],
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