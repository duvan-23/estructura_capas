const {conectar,getById,getByNombre,listarMensajes,insertarMensajes,deleteById,putId,putUsuarios,insertarUsuarios,insertarProductos,listarProductos} = require( '../persistencia/persistencia.js');


async function conectarse() {
    await conectar();
}
async function actualizarUsuarios(username,contador) {
    await putUsuarios(username,contador);
}
async function getNombre(username) {
    return await getByNombre(username);
}
async function agregarUsuarios(user) {
    await insertarUsuarios(user);
}
async function mostrarMensajes() {
    return await listarMensajes();
}
async function grabarMensajes(data) {
    await insertarMensajes(data);
}
async function mostrarProductos() {
    return await listarProductos();
}
async function grabarProductos(data) {
    await insertarProductos(data);
}
module.exports={conectarse,actualizarUsuarios,getNombre,agregarUsuarios,mostrarMensajes,grabarMensajes,mostrarProductos,grabarProductos}