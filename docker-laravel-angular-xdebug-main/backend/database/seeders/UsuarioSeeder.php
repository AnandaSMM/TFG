<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsuarioSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('usuarios')->insert([
            [
                'nombre' => 'Juan Pérez',
                'email' => 'juan@test.com',
                'password' => Hash::make('123456'),
                'telefono' => '600111111',
                'foto' => 'usuarios/cuatro.jpg',
            ],
            [
                'nombre' => 'Ana López',
                'email' => 'ana@test.com',
                'password' => Hash::make('123456'),
                'telefono' => '600222222',
                'foto' => 'usuarios/cuatro.jpg',
            ],
            [
                'nombre' => 'Carlos Ruiz',
                'email' => 'carlos@test.com',
                'password' => Hash::make('123456'),
                'telefono' => '600333333',
                'foto' => 'usuarios/tres.jpg',
            ],
            [
                'nombre' => 'Lucía Gómez',
                'email' => 'lucia@test.com',
                'password' => Hash::make('123456'),
                'telefono' => '600444444',
                'foto' => 'usuarios/dos.jpg',
            ],
            [
                'nombre' => 'Pedro Martín',
                'email' => 'pedro@test.com',
                'password' => Hash::make('123456'),
                'telefono' => '600555555',
                'foto' => 'usuarios/uno.jpg',
            ],
            [
                'nombre' => 'admin',
                'email' => 'admin@test.com',
                'password' => Hash::make('12345678'),
                'telefono' => '600555556',
                'foto' => 'usuarios/tres.jpg',
            ],
        ]);
    }
}