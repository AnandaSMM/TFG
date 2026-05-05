<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('alquileres', function (Blueprint $table) {
            $table->index(['usuario_id', 'estado', 'fecha_inicio'], 'idx_alquileres_usuario_estado_fecha');
            $table->index(['producto_id', 'estado', 'fecha_inicio', 'fecha_fin'], 'idx_alquileres_producto_estado_fechas');
        });

        Schema::table('imagenes_producto', function (Blueprint $table) {
            $table->index('producto_id', 'idx_imagenes_producto_id');
        });

        Schema::table('producto_categoria', function (Blueprint $table) {
            $table->index('producto_id', 'idx_producto_categoria_producto_id');
            $table->index('categoria_id', 'idx_producto_categoria_categoria_id');
        });

        Schema::table('productos', function (Blueprint $table) {
            $table->index('usuario_id', 'idx_productos_usuario_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('alquileres', function (Blueprint $table) {
            $table->dropIndex('idx_alquileres_usuario_estado_fecha');
            $table->dropIndex('idx_alquileres_producto_estado_fechas');
        });

        Schema::table('imagenes_producto', function (Blueprint $table) {
            $table->dropIndex('idx_imagenes_producto_id');
        });

        Schema::table('producto_categoria', function (Blueprint $table) {
            $table->dropIndex('idx_producto_categoria_producto_id');
            $table->dropIndex('idx_producto_categoria_categoria_id');
        });

        Schema::table('productos', function (Blueprint $table) {
            $table->dropIndex('idx_productos_usuario_id');
        });
    }
};
