<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Matricula extends Model
{
    protected $fillable = ['idMatricula', 'idAlumno', 'fecha', 'ciclo'];
}