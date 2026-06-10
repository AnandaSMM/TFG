<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
<<<<<<< HEAD
        Schema::table('users', function (Blueprint $table) {
=======
        Schema::table('usuarios', function (Blueprint $table) {
>>>>>>> develop
            $table->renameColumn('name', 'nombre');
            $table->string('telefono', 20)->nullable()->after('email');
            $table->string('foto', 250)->nullable()->after('telefono');
        });
    }

    public function down(): void
    {
<<<<<<< HEAD
        Schema::table('users', function (Blueprint $table) {
=======
        Schema::table('usuarios', function (Blueprint $table) {
>>>>>>> develop
            $table->renameColumn('nombre', 'name');
            $table->dropColumn(['telefono', 'foto']);
        });
    }
};