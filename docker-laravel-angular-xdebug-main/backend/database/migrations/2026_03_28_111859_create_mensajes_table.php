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
        Schema::create('mensajes', function (Blueprint $table) {
            $table->id();

<<<<<<< HEAD
            $table->foreignId('emisor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('receptor_id')->nullable()->constrained('users')->nullOnDelete();
=======
            $table->foreignId('emisor_id')->nullable()->constrained('usuarios')->nullOnDelete();
            $table->foreignId('receptor_id')->nullable()->constrained('usuarios')->nullOnDelete();
>>>>>>> develop

            $table->text('mensaje');
            $table->boolean('leido')->default(false);

            $table->timestamp('fecha')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mensajes');
    }
};
