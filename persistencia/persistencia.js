const ContenedorMongoDb = require( './contenedores/ContenedorMongoDb.js');
const ClienteSQL1 = require( './contenedores/sql1.js');
const dotenv = require( 'dotenv/config')
const options1 = require( '../options/mysqlconn.js')
// const sql1 = new ClienteSQL1(options1);
const url = process.env.URL;
const contenedorMongo = new ContenedorMongoDb(url);
const sql1 = new ClienteSQL1(options1);
async function conectar(){
    contenedorMongo.conectar();
}
async function getById(id){
    let nombre =this.nombre;
    return await contenedorMongo.leerId(id, nombre);
}
async function getByNombre(name){
    let nombre =this.nombre;
    return await contenedorMongo.leerNombre(name, nombre);
}
async function listarMensajes(){
    let nombre =this.nombre;
    return await contenedorMongo.leerAll(nombre);
}

async function insertarMensajes(data){
    let nombre =this.nombre;
    return await contenedorMongo.leerTodo(nombre,data);
}

async function deleteById(id){
    let nombre =this.nombre;
    return await contenedorMongo.eliminarId(id,nombre);
}

async function putId(id,datos){
    let nombre =this.nombre;
    return await contenedorMongo.actualizar(id,nombre,datos);
}
async function putUsuarios(name,datos){
    let nombre =this.nombre;
    return await contenedorMongo.actualizarUsuarios(name,nombre,datos);
}
async function insertarUsuarios(data){
    let nombre =this.nombre;
    return await contenedorMongo.guardarUsuarios(nombre,data);
    // return await leerTodo(nombre,data);
}
async function insertarProductos(data){
     await sql1.insertarProductos(data);
}
async function listarProductos(){
     return await sql1.listarProductos();
}

module.exports={conectar,getById,getByNombre,listarMensajes,insertarMensajes,deleteById,putId,putUsuarios,insertarUsuarios,insertarProductos,listarProductos}