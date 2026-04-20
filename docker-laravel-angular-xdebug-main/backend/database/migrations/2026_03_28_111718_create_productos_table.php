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
       Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('usuarios')->onDelete('cascade');

            $table->string('nombre', 150);
            $table->text('descripcion')->nullable();

            $table->decimal('precio_venta', 10, 2)->nullable();
            $table->decimal('precio_alquiler_dia', 10, 2)->nullable();

            $table->boolean('vendido')->default(false);
            $table->boolean('disponible')->default(true);

            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};
