const mongoose =require( 'mongoose');

const usuariosCollection = 'usuarios';

const UsuariosSchema= new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    direccion: {type: String, required: true},
    contador: {type: Number, required: true}
});

const usuarios = mongoose.model(usuariosCollection, UsuariosSchema);
module.exports ={usuarios};