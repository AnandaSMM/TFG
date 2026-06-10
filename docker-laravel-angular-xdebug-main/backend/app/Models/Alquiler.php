<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alquiler extends Model
{
    protected $table = 'alquileres';
    public $timestamps = false;


    protected $fillable = [
        'usuario_id',
        'producto_id',
        'fecha_inicio',
        'fecha_fin',
        'precio_total',
        'estado',
        'opcion_compra'
    ];

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}