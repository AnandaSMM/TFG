<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $table = 'productos';

    public $timestamps = false;

    protected $fillable = [
        'usuario_id',
        'nombre',
        'descripcion',
        'precio_venta',
        'precio_alquiler_dia',
        'vendido',
        'disponible',
        'localidad',
    ];
    public function imagenes()
    {
        return $this->hasMany(ImagenProducto::class, 'producto_id');
    }
    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
    public function categorias()
    {
        return $this->belongsToMany(
            Categoria::class,
            'producto_categoria',
            'producto_id',
            'categoria_id'
        );
    }
    public function alquileres()
    {
        return $this->hasMany(Alquiler::class, 'producto_id');
    }


    protected $casts = [
        'vendido' => 'boolean',
        'disponible' => 'boolean',
        'precio_venta' => 'decimal:2',
        'precio_alquiler_dia' => 'decimal:2',
    ];
}