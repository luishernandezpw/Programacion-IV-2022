<template>
    <div id='appDocente'>
        <div class="row">
            <div class="col col-md-4">
                <vue-resizable :width="500" :drag-selector="toolbar">
                    <form class="toolbar" @submit.prevent="guardarDocente" @reset.prevent="nuevoDocente" method="post" id="frmDocente">
                        <div class="card mb-3">
                            <div class="card-header text-white bg-dark">
                                Administracion de Docentes
                                <button type="button" class="btn-close bg-white" data-bs-dismiss="alert" @click="cerrarForm" aria-label="Close"></button>
                            </div>
                            <div class="card-body">
                                <div class="row p-1">
                                    <div class="col col-md-3">Codigo</div>
                                    <div class="col col-md-3">
                                        <input v-model="docente.codigo" placeholder="codigo" pattern="[A-Z0-9]{3,10}" required title="Codigo de docente" class="form-control" type="text">
                                    </div>
                                </div>
                                <div class="row p-1">
                                    <div class="col col-md-3">Nombre</div>
                                    <div class="col">
                                        <input v-model="docente.nombre" placeholder="escribe tu nombre" pattern="[A-Za-zÑñáéíóú ]{3,75}" required title="Nombre de docente" class="form-control" type="text">
                                    </div>
                                </div>
                                <div class="row p-1">
                                    <div class="col col-md-3">Direccion</div>
                                    <div class="col">
                                        <input v-model="docente.direccion" placeholder="donde vives" pattern="[A-Za-z0-9Ññáéíóú ]{3,100}" required title="Direccion de docente" class="form-control" type="text">
                                    </div>
                                </div>
                                <div class="row p-1">
                                    <div class="col col-md-3">Telefono</div>
                                    <div class="col col-md-4">
                                        <input v-model="docente.telefono" placeholder="tu tel" pattern="[0-9]{4}-[0-9]{4}" required title="Telefono de docente" class="form-control" type="text">
                                    </div>
                                </div>
                                <div class="row p-1">
                                    <div class="col col-md-3">DUI</div>
                                    <div class="col">
                                        <input v-model="docente.dui" placeholder="tu DUI" pattern="[0-9]{8}-[0-9]{1}" required title="DUI de docente" class="form-control" type="text">
                                    </div>
                                </div>
                                <div class="row p-1">
                                    <div class="col col-md-3">ESCALAFON</div>
                                    <div class="col">
                                        <select v-model="docente.idEscalafon" class="form-control" title="Seleccione su escalafon" alt="Seleccione su escalafon">
                                            <option v-for="escalafon in escalafones" :value="escalafon.idEscalafon" :key="escalafon.idEscalafon">{{escalafon.nombre}}</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col text-center">
                                        <div class="alert alert-warning alert-dismissible fade show" role="alert">
                                            {{ docente.msg }}
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
                </vue-resizable>
            </div>
            <div class="col col-md-8">
                <vue-resizable :width="600" :drag-selector="toolbar">
                    <div class="card mb-3 toolbar" id="cardBuscarDocente">
                        <div class="card-header text-white bg-dark">
                            Busqueda de Docentes
                            <button @click="cerrarForm" type="button" class="btn-close bg-white" data-bs-dismiss="alert" data-bs-target="#cardBuscarDocente" aria-label="Close"></button>
                        </div>
                        <div class="card-body">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <td colspan="6">
                                            Buscar: <input title="Introduzca el texto a buscar" @keyup="buscarDocente" v-model="buscar" class="form-control" type="text">
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Codigo</th>
                                        <th>Nombre</th>
                                        <th>Direccion</th>
                                        <th>Telefono</th>
                                        <th>DUI</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in docentes" :key="item.idDocente" @click="modificarDocente(item)">
                                        <td>{{item.codigo}}</td>
                                        <td>{{item.nombre}}</td>
                                        <td>{{item.direccion}}</td>
                                        <td>{{item.telefono}}</td>
                                        <td>{{item.dui}}</td>
                                        <td>
                                            <button type="button" class="btn btn-danger" @click="eliminarDocente(item)">Eliminar</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </vue-resizable>
            </div>
        </div>
    </div> 
</template>

<script>
    Vue.component('vue-resizable',VueResizable.default);
    export default {
        props:['form'],
        data:()=>{
            return {
                toolbar:'.toolbar',
                docentes: [],
                escalafones: [
                    {idEscalafon: 1, nombre: 'Profesor'},
                    {idEscalafon: 2, nombre: 'Licenciado/Ingeniero'},
                    {idEscalafon: 3, nombre: 'Maestria'},
                    {idEscalafon: 4, nombre: 'Doctorado'},
                ],
                buscar: '',
                docente: {
                    accion: 'nuevo',
                    msg : '',
                    id : 0,
                    idDocente: '',
                    codigo: '',
                    nombre: '',
                    direccion: '',
                    telefono: '',
                    dui: '',
                    idEscalafon: 0,
                }
            }
        },
        methods: {
            cerrarForm(){
                this.form['docente'].mostrar = false;
            },
            buscarDocente(){
                this.obtenerDatos(this.buscar);
            },
            async sincronizarDatosServidor(docente='', metodo='POST', url='docentes'){
                await axios({
                    method: metodo,
                    url,
                    data: docente,
                })
                .then(res=>{
                    if( docente.accion=='nuevo' ){
                        docente.id = res.data.id;
                        this.actualizarLocal(docente);
                    }
                    this.docente.msg = 'Docente sincronizado con exito en el servidor';
                })
                .catch(err=>{
                    this.docente.msg = `Error al sincronizar el docente en el servidor: ${err}`
                });
            },
            actualizarLocal(docente){
                let store = this.abrirStore('docentes','readwrite'),
                    query = store.put(docente);
                query.onsuccess=e=>{
                    this.docente.msg = 'Docente procesado con exito';
                    this.nuevoDocente();
                    this.obtenerDatos();
                };
                query.onerror=e=>{
                    this.docente.msg = 'Error al procesar el docente';
                };
            },
            guardarDocente(){
                let metodo = 'PUT',
                    url = `docentes/${this.docente.id}`;
                if( this.docente.accion == 'nuevo' ){
                    this.docente.idDocente = idUnicoFecha();
                    metodo = 'POST';
                    url = 'docentes';
                }
                let docente = JSON.parse( JSON.stringify(this.docente) );
                this.sincronizarDatosServidor(docente, metodo, url);
                this.actualizarLocal(docente);
            },
            modificarDocente(data){
                this.docente = JSON.parse(JSON.stringify(data));
                this.docente.accion = 'modificar';
            },
            eliminarDocente(data){
                if( confirm(`¿Esta seguro de eliminar el docente ${data.nombre}?`) ){
                    let store = this.abrirStore('docentes','readwrite'),
                        query = store.delete(data.idDocente),
                        metodo = 'DELETE',
                        url = `docentes/${data.id}`;
                    this.sincronizarDatosServidor(data, metodo, url);    
                    query.onsuccess=e=>{
                        data.accion = 'eliminar';
                        this.docente.msg = 'Docente eliminado con exito';
                        this.nuevoDocente();
                        this.obtenerDatos();
                    };
                    query.onerror=e=>{
                        this.docente.msg = `Error al procesar el docente ${e.target.error}`;
                    };
                }
            },
            obtenerDatos(busqueda=''){
                let store = this.abrirStore('docentes', 'readonly'),
                    data = store.getAll();
                data.onsuccess = resp=>{
                    if( data.result.length<=0 ){
                        fetch(`docentes`,
                            {credentials:'same-origin'})
                            .then(res=>res.json())
                            .then(data=>{
                                this.docentes = data;
                                this.docente.msg = 'Docentes obtenidos con exito';

                                data.map(docente=>{
                                    let store = this.abrirStore('docentes','readwrite'),
                                        query = store.put(docente);
                                    query.onsuccess=e=>{
                                        this.docente.msg = 'Docentes guardados en local';
                                    };
                                    query.onerror=e=>{
                                        this.docente.msg = `Error al obtener docentes ${e.target.error}`;
                                    };
                                });
                            })
                            .catch(err=>{
                                this.docente.msg = `Error al sincronizar el docente en el servidor: ${err}`
                            });
                    }
                    this.docentes = data.result.filter(docente=>docente.nombre.toLowerCase().indexOf(busqueda.toLowerCase())>-1);
                };
                data.onerror = e=>{
                    this.docente.msg = `Error al obtener los datos ${e.target.error}`;
                };
            },
            nuevoDocente(){
                this.docente.accion = 'nuevo';
                this.docente.idDocente = '';
                this.docente.codigo = '';
                this.docente.nombre = '';
                this.docente.direccion = '';
                this.docente.telefono = '';
                this.docente.dui = '';
                this.docente.msg = '';
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
