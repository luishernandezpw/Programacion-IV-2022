<template>
    <div class="container">
        <form v-on:submit.prevent="guardarChat" v-on:reset="limpiar">
            <div class="card mb-3">
                <div class="card-header text-white bg-dark">
                    <div class="row">
                        <div class="col-1 col-md-1">
                            <img width="30" height="20" :src="imgchat" alt="Imagen de Chat" title="Chat de usuarios">
                        </div>
                        <div class="col-9 col-md-10">
                            <h5 class="card-title">Chat</h5>
                        </div>
                        <div class="col-1 col-md-1">
                            <button type="button" class="btn-close bg-white" data-bs-dismiss="alert" @click="cerrarForm" aria-label="Close"></button>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row p-2">
                        <div class="col">
                            <ul id="ltsMensajes">
                                <li v-for="msg in chats" :key="msg._id">
                                    {{ msg.from }} : <span>{{ msg.msg }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="row">
                        <div class="col-10">
                            <input type="text" v-model="chat.msg" placeholder="Escribe tu mensage..." class="form-control" required @keyup.enter.once="guardarChat">
                        </div>
                        <div class="col-2">
                            <a @click="guardarChat">
                                <img width="20" height="20" :src="imgenviar" title="Enviar mensaje" alt="Imagen de envio de mensajes">
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>
<script>
    export default{
        props:['form'],
        data(){
            return {
                imgchat : 'img/chat.png',
                imgenviar : 'img/enviar.png',
                chat :{
                    id     : '',
                    from   : document.querySelector("#navbarDropdown").innerText,
                    to     : 'todos',
                    msg    : '',
                    status : '',
                    fecha  : new Date().toLocaleString('es-ES')
                },
                chats : []
            }
        },
        methods:{
            cerrarForm(){
                this.form['chat'].mostrar = false;
            },
            limpiar(){
                chat.id     = '';
                chat.from   = '';
                chat.to     = '';
                chat.msg    = '';
                chat.status = '';
                chat.fecha  = '';
            },
            obtenerDatos(){
                socketio.emit('historial');//Enviamos el evento de historial
                socketio.on('historial', chats=>{ this.chats = chats });//Escuchamos el evento de historial
            },
            mostraraDatos(chat){
                this.chats.push(chat);
            },
            guardarChat(){
                this.chat.id = idUnicoFecha();
                if( this.chat.msg !== '' ){
                    socketio.emit('chat', this.chat);//
                    this.chat.msg = '';
                } else {
                    console.log('No se puede enviar mensaje vacio');
                }
            },
            mostrarNotificaciones(user, msg){
                if(permitirNotificaciones=='granted'){
                    let opciones = {
                        body: msg,
                        icon: 'img/chat.png'
                    };
                    let notificaciones = new Notification(user, opciones);
                    
                    console.log(notificaciones);
                }else{
                    console.log('No se puede mostrar notificaciones');
                }
            }
        },
        created(){
            this.obtenerDatos();

            socketio.on('chat', chat=>{ //Escuchamos el evento de chat
                this.mostraraDatos(chat);
                this.mostrarNotificaciones(chat.from, chat.msg);
            });
        }
    };
</script>
<style>
    #ltsMensajes{
        width: 450px;
        height: 350px;
        overflow-y: auto;
    }
</style>
