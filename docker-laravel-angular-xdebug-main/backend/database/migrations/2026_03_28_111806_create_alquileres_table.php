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
        Schema::create('alquileres', function (Blueprint $table) {
            $table->id();

<<<<<<< HEAD
            $table->foreignId('usuario_id')->nullable()->constrained('users')->nullOnDelete();
=======
            $table->foreignId('usuario_id')->nullable()->constrained('usuarios')->nullOnDelete();
>>>>>>> develop
            $table->foreignId('producto_id')->nullable()->constrained('productos')->nullOnDelete();

            $table->date('fecha_inicio')->nullable();
            $table->date('fecha_fin')->nullable();

            $table->decimal('precio_total', 10, 2)->nullable();

            $table->enum('estado', ['activo', 'finalizado', 'cancelado'])->default('activo');

            $table->boolean('opcion_compra')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alquileres');
    }
};
