<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class InstalacionController extends Controller
{
    public function index()
    {
        $instalaciones = Cache::remember('instalaciones_madrid', 3600, function () {
            return $this->fetchInstalaciones();
        });

        if ($instalaciones === null) {
            return response()->json([
                'message' => 'No se pudieron obtener las instalaciones'
            ], 503);
        }

        return response()->json($instalaciones);
    }

    private function fetchInstalaciones(): ?array
    {
        $query = <<<'OVERPASS'
[out:json][timeout:60];
area["name"="Madrid"]["boundary"="administrative"]->.searchArea;
(
  node["leisure"="fitness_centre"](area.searchArea);
  node["leisure"="sports_centre"](area.searchArea);
  way["leisure"="fitness_centre"](area.searchArea);
  way["leisure"="sports_centre"](area.searchArea);
);
out center tags;
OVERPASS;

        $response = Http::timeout(70)
            ->withHeaders([
                'User-Agent' => 'Rent2Play-TFG/1.0',
                'Accept'     => 'application/json',
            ])
            ->asForm()
            ->post('https://overpass-api.de/api/interpreter', [
                'data' => $query,
            ]);

        if (!$response->successful()) {
            return null;
        }

        return collect($response->json('elements'))
            ->map(function ($item) {
                $lat  = $item['lat'] ?? $item['center']['lat'] ?? null;
                $lng  = $item['lon'] ?? $item['center']['lon'] ?? null;
                $tags = $item['tags'] ?? [];

                return [
                    'id'       => $item['id'] ?? null,
                    'nombre'   => $tags['name'] ?? null,
                    'ubicacion'=> $this->crearUbicacion($tags),
                    'lat'      => $lat,
                    'lng'      => $lng,
                    'web'      => $tags['website'] ?? $tags['contact:website'] ?? null,
                    'tipo'     => $tags['leisure'] ?? null,
                    'horario'  => $tags['opening_hours'] ?? null,
                    'telefono' => $tags['phone'] ?? $tags['contact:phone'] ?? null,
                    'deporte'  => $tags['sport'] ?? null,
                    'operador' => $tags['operator'] ?? null,
                ];
            })
            ->filter(fn ($item) => $item['lat'] && $item['lng'] && $item['nombre'])
            ->values()
            ->all();
    }

    private function crearUbicacion(array $tags): string
    {
        $partes = array_filter([
            $tags['addr:street']      ?? null,
            $tags['addr:housenumber'] ?? null,
            $tags['addr:postcode']    ?? null,
            $tags['addr:city']        ?? null,
        ]);

        return count($partes) > 0 ? implode(', ', $partes) : 'Madrid';
    }
}