<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;

class InstalacionController extends Controller
{
    public function index()
    {
        $query = <<<'OVERPASS'
[out:json][timeout:25];
area["name"="Madrid"]["boundary"="administrative"]->.searchArea;
(
  node["leisure"="fitness_centre"](area.searchArea);
  node["leisure"="sports_centre"](area.searchArea);
  way["leisure"="fitness_centre"](area.searchArea);
  way["leisure"="sports_centre"](area.searchArea);
);
out center tags;
OVERPASS;

        $response = Http::withHeaders([
            'User-Agent' => 'Rent2Play-TFG/1.0',
            'Accept' => 'application/json',
        ])->asForm()->post('https://overpass.kumi.systems/api/interpreter', [
            'data' => $query,
        ]);

        if (!$response->successful()) {
            return response()->json([
                'message' => 'Error al conectar con Overpass API',
                'status' => $response->status(),
                'body' => $response->body(),
            ], 500);
        }

        $instalaciones = collect($response->json('elements'))
            ->map(function ($item) {
                $lat = $item['lat'] ?? $item['center']['lat'] ?? null;
                $lng = $item['lon'] ?? $item['center']['lon'] ?? null;
                $tags = $item['tags'] ?? [];

                return [
                    'id' => $item['id'] ?? null,
                    'nombre' => $tags['name'] ?? 'Instalación sin nombre',
                    'ubicacion' => $this->crearUbicacion($tags),
                    'lat' => $lat,
                    'lng' => $lng,
                    'web' => $tags['website'] ?? $tags['contact:website'] ?? null,
                    'tipo' => $tags['leisure'] ?? null,
                ];
            })
            ->filter(fn ($item) => $item['lat'] && $item['lng'])
            ->values();

        return response()->json($instalaciones);
    }

    private function crearUbicacion(array $tags): string
    {
        $partes = array_filter([
            $tags['addr:street'] ?? null,
            $tags['addr:housenumber'] ?? null,
            $tags['addr:postcode'] ?? null,
            $tags['addr:city'] ?? null,
        ]);

        return count($partes) > 0 ? implode(', ', $partes) : 'Madrid';
    }
}