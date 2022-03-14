<?php
//importar la conexion a la BD
include('../../private/db/config.php');

//Estraccion de datos desde el front-end
extract($_REQUEST);

$class_cliente = new cliente($conexion);
$cliente = isset($cliente) ? $cliente : '[]';
print_r(json_encode($class_cliente->$accion($cliente)));
class cliente{
    private $datos=[], $db;

    public $respuesta = ['msg'=>'correcto'];
    public function cliente($db=''){
        $this->db = $db;
    }
    public function recibir_datos($cliente=''){
        $this->datos = json_decode($cliente, true);
        return $this->validar_datos();
    }
    private function validar_datos(){
        if(empty(trim($this->datos['codigo'])) ){
            $this->respuesta['msg'] = 'Por favor ingrese el codigo';
        }
        if(empty(trim($this->datos['nombre'])) ){
            $this->respuesta['msg'] = 'Por favor ingrese el nombre';
        }
        return $this->almacenar_datos();
    }
    private function almacenar_datos(){
        if( $this->respuesta['msg']=='correcto' ){
            if( $this->datos['accion']=='nuevo' ){
                $this->db->consultas('INSERT INTO db_sistema_a2.clientes(idCliente, codigo, nombre, direccion, telefono, dui) 
                    VALUES(?,?,?,?,?,?)', $this->datos['idCliente'],$this->datos['codigo'],$this->datos['nombre'],$this->datos['direccion'],
                    $this->datos['telefono'],$this->datos['dui']);
                return $this->db->obtener_ultimo_id();
            }else if( $this->datos['accion']=='modificar' ){
                $this->db->consultas('UPDATE db_sistema_a2.clientes SET codigo=?, nombre=?, direccion=?,
                    telefono=?, dui=? WHERE idCliente=?', $this->datos['codigo'],$this->datos['nombre'],$this->datos['direccion'],
                    $this->datos['telefono'],$this->datos['dui'],$this->datos['idCliente']);
                return $this->db->obtener_respuesta();
            }else if( $this->datos['accion']=='eliminar' ){
                $this->db->consultas('DELETE FROM db_sistema_a2.clientes WHERE idCliente=?',$this->datos['idCliente']);
                return $this->db->obtener_respuesta();
            }
        }else{
            return $this->respuesta['msg'];
        }
    }
    public function obtener_datos(){
        $this->db->consultas('SELECT * FROM db_sistema_a2.clientes');
        return $this->db->obtener_datos();
    }
}

?>