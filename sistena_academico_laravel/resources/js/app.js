/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */
require('./bootstrap');

window.Vue = require('vue');
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

window.db = '';
window.idUnicoFecha = ()=>{
    let fecha = new Date();
    return Math.floor(fecha.getTime()/1000).toString(16);
}
var socketio = io('http://localhost:3001');
socketio.on('connect', function(e){
    console.log('Conectado al servidor via socket.io');
});

//Notificaciones de Escritorio
if(!Notification){
    //alertify.error('Este navegador no soporta notificaciones');
}
window.permitirNotificaciones = "default";
if(Notification.permission !== "denied"){
    Notification.requestPermission(function(result){
        console.log('Permitido: ', result);
        permitirNotificaciones = result;
    });
}else{
    permitirNotificaciones = "denied";
    //alertify.error('EL usuario denego las Notificaciones');
}
/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.component('alumno-component', require('./components/AlumnoComponent.vue').default);
Vue.component('docente-component', require('./components/DocenteComponent.vue').default);
Vue.component('matricula-component', require('./components/MatriculaComponent.vue').default);
Vue.component('v-select-alumno', vSelect);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',
    data:{
        forms:{
            alumno:{mostrar:false},
            materia:{mostrar:false},
            docente:{mostrar:false},
            matricula:{mostrar:false},
        }
    },
    methods:{
        abrirForm(form){
            this.forms[form].mostrar = !this.forms[form].mostrar;
            this.$refs[form].obtenerDatos();
        },
        abrirBd(){
            /**
             * Mecanismo de almacenamiento local:
             * 1. WebSQL
             * 2. localStorage
             * 3. IndexedDB
             */
            let indexDb = indexedDB.open('db_sistema',1);
            indexDb.onupgradeneeded = (e)=>{
                let db = e.target.result,
                tblalumnos = db.createObjectStore('alumnos',{ keyPath: 'idAlumno' }),
                tblmaterias = db.createObjectStore('materias',{ keyPath: 'idMateria' }),
                tbldocente = db.createObjectStore('docentes',{ keyPath: 'idDocente' }),
                tblmatricula = db.createObjectStore('matriculas',{ keyPath: 'idMatricula' });

                tblalumnos.createIndex('idAlumno','idAlumno',{ unique: true });
                tblalumnos.createIndex('codigo','codigo',{ unique: false });

                tblmaterias.createIndex('idMateria','idMateria', { unique: true });
                tblmaterias.createIndex('codigo','codigo', { unique: false });

                tbldocente.createIndex('idDocente','idDocente', { unique: true });
                tbldocente.createIndex('codigo', 'codigo',{unique:false});

                tblmatricula.createIndex('idMatricula','iMatricula', { unique: true });
                tblmatricula.createIndex('idAlumno','idAlumno', { unique: false });  
            };
            indexDb.onsuccess = (e)=>{
                db = e.target.result;
            };
            indexDb.onerror = (e)=>{
                console.log(e.target.error);
            };
        }
    },
    created(){
        this.abrirBd();
    }
});
