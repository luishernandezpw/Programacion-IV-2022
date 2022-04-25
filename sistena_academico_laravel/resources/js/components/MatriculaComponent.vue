<template>
    <div id='appMatricula'>
        <div class="row">
            <div class="col col-md-4">
                <!--<vue-resizable :width="500" :drag-selector="toolbar">-->
                    <form class="toolbar" @submit.prevent="guardarMatricula" @reset.prevent="nuevoMatricula" method="post" id="frmMatricula">
                        <div class="card mb-3">
                            <div class="card-header text-white bg-dark">
                                Administracion de Matriculas
                                <button type="button" class="btn-close bg-white" data-bs-dismiss="alert" @click="cerrarForm" aria-label="Close"></button>
                            </div>
                            <div class="card-body">
                                <div class="row p-1">
                                    <div class="col col-md-3">Alumno</div>
                                    <div class="col">
                                        <v-select-alumno v-model="matricula.alumno" :options="alumnos" label="nombre" placeholder="Seleccione un alumno"/>
                                    </div>
                                </div>
                                <div class="row p-1">
                                    <div class="col col-md-3">Fecha:</div>
                                    <div class="col">
                                        <input v-model="matricula.fecha" placeholder="Selecciona la fecha" required title="Seleccione la fecha" class="form-control" type="date">
                                    </div>
                                </div>
                                <div class="row p-1">
                                    <div class="col col-md-3">Ciclo</div>
                                    <div class="col">
                                        <select v-model="matricula.ciclo" class="form-control" required title="Seleccione un ciclo">
                                            <option value="I">Ciclo I</option>
                                            <option value="II">Ciclo II</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col text-center">
                                        <div class="alert alert-warning alert-dismissible fade show" role="alert">
                                            {{ matricula.msg }}
                                            
                                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col text-center">
                                        <button type="submit" class="btn btn-primary">Guardar</button>
                                        <button type="reset" class="btn btn-warning">Nuevo</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                <!--</vue-resizable>-->
            </div>
            <div class="col col-md-8">
                <!-- <vue-resizable :width="600" :drag-selector="toolbar">-->
                    <div class="card mb-3 toolbar" id="cardBuscarMatricula">
                        <div class="card-header text-white bg-dark">
                            Busqueda de Matriculas
                            <button @click="cerrarForm" type="button" class="btn-close bg-white" data-bs-dismiss="alert" data-bs-target="#cardBuscarMatricula" aria-label="Close"></button>
                        </div>
                        <div class="card-body">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <td colspan="6">
                                            Buscar: <input title="Introduzca el texto a buscar" @keyup="buscarMatricula" v-model="buscar" class="form-control" type="text">
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Codigo</th>
                                        <th>Alumno</th>
                                        <th>Fecha</th>
                                        <th>Ciclo</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in matriculas" :key="item.idMatricula" @click="modificarMatricula(item)">
                                        <td>{{ item.alumno.codigo }}</td>
                                        <td>{{item.alumno.nombre}}</td>
                                        <td>{{item.fecha}}</td>
                                        <td>{{item.ciclo}}</td>
                                        <td>
                                            <button type="button" class="btn btn-danger" @click="eliminarMatricula(item)">Eliminar</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                <!-- </vue-resizable> -->
            </div>
        </div>
    </div> 
</template>

<script>
    //Vue.component('vue-resizable',VueResizable.default);
    export default {
        props:['form'],
        data:()=>{
            return {
                toolbar:'.toolbar',
                alumnos:[],
                matriculas: [],
                buscar: '',
                matricula: {
                    accion: 'nuevo',
                    msg : '',
                    id : 0,
                    idMatricula: '',
                    alumno: {
                        id: '',
                        label: '',
                    },
                    fecha: '',
                    ciclo: '',
                }
            }
        },
        methods: {
            cerrarForm(){
                this.form['matricula'].mostrar = false;
            },
            buscarMatricula(){
                this.obtenerDatos(this.buscar);
            },
            async sincronizarDatosServidor(matricula='', metodo='POST', url='matriculas'){
                await axios({
                    method: metodo,
                    url,
                    data: matricula,
                })
                .then(res=>{
                    if( matricula.accion=='nuevo' ){
                        matricula.id = res.data.id;
                        this.actualizarLocal(matricula);
                    }
                    this.matricula.msg = 'Matricula sincronizado con exito en el servidor';
                })
                .catch(err=>{
                    this.matricula.msg = `Error al sincronizar el matricula en el servidor: ${err}`
                });
            },
            actualizarLocal(matricula){
                let store = this.abrirStore('matriculas','readwrite'),
                    query = store.put(matricula);
                query.onsuccess=e=>{
                    this.matricula.msg = 'Matricula procesado con exito';
                    this.nuevoMatricula();
                    this.obtenerDatos();
                };
                query.onerror=e=>{
                    this.matricula.msg = 'Error al procesar el matricula';
                };
            },
            guardarMatricula(){
                let metodo = 'PUT',
                    url = `matriculas/${this.matricula.id.id}`;
                if( this.matricula.accion == 'nuevo' ){
                    this.matricula.idMatricula = idUnicoFecha();
                    metodo = 'POST';
                    url = 'matriculas';
                }
                let matricula = JSON.parse( JSON.stringify(this.matricula) );
                this.sincronizarDatosServidor(matricula, metodo, url);
                this.actualizarLocal(matricula);
            },
            modificarMatricula(data){
                this.matricula = JSON.parse(JSON.stringify(data));
                this.matricula.accion = 'modificar';
            },
            eliminarMatricula(data){
                if( confirm(`¿Esta seguro de eliminar el matricula ${data.nombre}?`) ){
                    let store = this.abrirStore('matriculas','readwrite'),
                        query = store.delete(data.idMatricula),
                        metodo = 'DELETE',
                        url = `matriculas/${data.id}`;
                    this.sincronizarDatosServidor(data, metodo, url);    
                    query.onsuccess=e=>{
                        data.accion = 'eliminar';
                        this.matricula.msg = 'Matricula eliminado con exito';
                        this.nuevoMatricula();
                        this.obtenerDatos();
                    };
                    query.onerror=e=>{
                        this.matricula.msg = `Error al procesar el matricula ${e.target.error}`;
                    };
                }
            },
            obtenerDatos(busqueda=''){
                let store = this.abrirStore('matriculas', 'readonly'),
                    data = store.getAll();
                data.onsuccess = resp=>{
                    if( data.result.length<=0 ){
                        fetch(`matriculas`,
                            {credentials:'same-origin'})
                            .then(res=>res.json())
                            .then(data=>{
                                this.matriculas = data;
                                this.matricula.msg = 'Matriculas obtenidos con exito';

                                data.map(matricula=>{
                                    let store = this.abrirStore('matriculas','readwrite'),
                                        query = store.put(matricula);
                                    query.onsuccess=e=>{
                                        this.matricula.msg = 'Matriculas guardados en local';
                                    };
                                    query.onerror=e=>{
                                        this.matricula.msg = `Error al obtener matriculas ${e.target.error}`;
                                    };
                                });
                            })
                            .catch(err=>{
                                this.matricula.msg = `Error al sincronizar el matricula en el servidor: ${err}`
                            });
                    }
                    this.matriculas = data.result.filter(matricula=>matricula.alumno.nombre.toLowerCase().indexOf(busqueda.toLowerCase())>-1);
                };
                data.onerror = e=>{
                    this.matricula.msg = `Error al obtener los datos ${e.target.error}`;
                };
                //Datos de alumnos
                let storeAlumno = this.abrirStore('alumnos', 'readonly'),
                    dataAlumno = storeAlumno.getAll();
                dataAlumno.onsuccess = resp=>{
                    if( dataAlumno.result.length<=0 ){
                        fetch(`alumnos`,
                            {credentials:'same-origin'})
                            .then(res=>res.json())
                            .then(dataAlumno=>{
                                this.alumnos = [];
                                dataAlumno.forEach(alumno => {
                                    this.alumnos.push({
                                        id: alumno.id,
                                        label: alumno.nombre,
                                    });
                                });
                                this.matricula.msg = 'Alumnos obtenidos con exito';

                                dataAlumno.map(alumno=>{
                                    let storeAlumno = this.abrirStore('alumnos','readwrite'),
                                        query = storeAlumno.put(alumno);
                                    query.onsuccess=e=>{
                                        this.matricula.msg = 'Alumnos guardados en local';
                                    };
                                    query.onerror=e=>{
                                        this.matricula.msg = `Error al obtener alumnos ${e.target.error}`;
                                    };
                                });
                            })
                            .catch(err=>{
                                this.matricula.msg = `Error al sincronizar los alumnos en el servidor: ${err}`
                            });
                    }else{
                        this.alumnos = dataAlumno.result;
                    }
                };
                dataAlumno.onerror = e=>{
                    this.matricula.msg = `Error al obtener los datos de alumnos ${e.target.error}`;
                };
            },
            nuevoMatricula(){
                this.matricula.accion = 'nuevo';
                this.matricula.idMatricula = '';
                this.matricula.alumno = {
                    id: '',
                    label: '',
                };
                this.matricula.fecha = '';
                this.matricula.ciclo = '';
                this.matricula.msg = '';
            },
            abrirStore(store, modo){
                let tx = db.transaction(store, modo);
                return tx.objectStore(store);
            }
        }, 
        created(){
            //this.obtenerDatos();
        }
    }
</script>
