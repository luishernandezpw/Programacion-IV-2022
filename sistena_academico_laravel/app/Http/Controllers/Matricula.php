<?php

namespace App\Http\Controllers;

use App\Matricula;
use Illuminate\Http\Request;

class Matricula extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Matricula::get(); //select * from alumnos;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $id = Matricula::create($request->all())->id;
        return response()->json(['id' => $id], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\matricula  $matricula
     * @return \Illuminate\Http\Response
     */
    public function show(matricula $matricula)
    {
        return $matricula;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\matricula  $matricula
     * @return \Illuminate\Http\Response
     */
    public function edit(matricula $matricula)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\matricula  $matricula
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, matricula $matricula)
    {
        $matricula->update($request->all());
        return response()->json(['id' => $request->id], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\matricula  $matricula
     * @return \Illuminate\Http\Response
     */
    public function destroy(matricula $matricula)
    {
        $matricula->delete();
        return response()->json(['id' => $matricula->id], 200);
    }
}
