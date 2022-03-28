<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Alumno extends Model
{
    protected $fillable = ['idAlumno','codigo','nombre','direccion','telefono','dui'];
}
