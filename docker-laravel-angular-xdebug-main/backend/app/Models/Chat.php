<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chat extends Model{
    protected $table='mensajes';
    public $timestamps = false;

    protected $fillable = [
        'emisor_id',
        'receptor_id',
        'mensaje',
        'leido',
        'fecha',
    ];
    public function emisor()
    {
        return $this->belongsTo(User::class, 'emisor_id');
    }

    public function receptor()
    {
        return $this->belongsTo(User::class, 'receptor_id');
    }
}

?>