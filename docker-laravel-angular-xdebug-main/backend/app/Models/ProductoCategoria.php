<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductoCategoria extends Model
{
    protected $table = 'producto_categoria';

    public $timestamps = false;

    public $incrementing = false;

    protected $primaryKey = null;

    protected $fillable = [
        'producto_id',
        'categoria_id'
    ];
}