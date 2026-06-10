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
        Schema::create('valoraciones', function (Blueprint $table) {
            $table->id();

<<<<<<< HEAD
            $table->foreignId('usuario_id')->nullable()->constrained('users')->nullOnDelete();
=======
            $table->foreignId('usuario_id')->nullable()->constrained('usuarios')->nullOnDelete();
>>>>>>> develop
            $table->foreignId('producto_id')->constrained('productos')->onDelete('cascade');

            $table->integer('puntuacion');
            $table->text('comentario')->nullable();

            $table->timestamp('fecha')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('valoraciones');
    }
};
