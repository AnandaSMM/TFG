<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriaSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('categorias')->insert([
            ['nombre' => 'Fútbol'],
            ['nombre' => 'Baloncesto'],
            ['nombre' => 'Tenis'],
            ['nombre' => 'Golf'],
            ['nombre' => 'Béisbol'],
            ['nombre' => 'Voleibol'],
            ['nombre' => 'Rugby'],
            ['nombre' => 'Fitness'],
            ['nombre' => 'Yoga'],
            ['nombre' => 'Pilates'],
            ['nombre' => 'Baile'],
        ]);
    }
}