<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Docente extends Model
{
    protected $fillable = ['idDocente','codigo','nombre','direccion','telefono','dui', 'idEscalafon'];
}
