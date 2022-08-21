const mongoose =require( "mongoose");
const  models =require( "./models/usuarios.js");

let ContenedorMongoDb=class {
    constructor(nombre){
        this.nombre = nombre;
    }

    async conectar(){
        // let conexion = await  mongoose.connect(URL,{dbName:'sessions-passport'});

        return console.log("Conexión a MongoDB users correcta");
    }
    async desconectar(){
        // await mongoose.disconnect();
        return console.log("Conexión a MongoDB users finalizada");
    }
    async getByNombre(name){
        let nombre =this.nombre;
        return await leerNombre(name, nombre);
    }

    async listarMensajes(){
        let nombre =this.nombre;
        return await leerAll(nombre);
    }

    async insertarUsuarios(data){
        let nombre =this.nombre;
        return await guardar(nombre,data);
        // return await leerTodo(nombre,data);
    }

    async deleteById(id){
        let nombre =this.nombre;
        return await eliminarId(id,nombre);
    }

    async putId(id,datos){
        let nombre =this.nombre;
        return await actualizar(id,nombre,datos);
    }
}

async function actualizar(id,nombre,datos){
    let resultado2,r3;
    try{
        const contenido =await models.usuarios.updateOne({id:id},{$set: datos});
        resultado2 =contenido;
    }
    catch(err){
        resultado2= err;
    }
    return console.log(resultado2);
}

async function eliminarId(id,nombre){
    let resultado,r2;
    try{
        const contenido =await models.usuarios.deleteMany({id: id});
        resultado =contenido;
    }
    catch(err){
        resultado= err;
    }
    return console.log(resultado);
}

// async function leerTodo(ruta,data){
//     let resultado,r2;
//     try{
//         const contenido =await models.mensajes.find({});
//         resultado =contenido;
//         r2=resultado;
//         resultado=resultado[resultado.length-1].id+1;
        
//     }
//     catch(err){
//         r2= [];
//         resultado= 1;
//     }
//     return guardar([resultado,r2],data,ruta);
    
// }

async function guardar(ruta,data){
    let resultado;
    try{
        // await fs.promises.writeFile(ruta, JSON.stringify(resultados[1],null, 2))
        await models.usuarios.create([data]);
        resultado=console.log("Guardo Exitosamente");
    }
    catch(err){
        resultado=console.log(err);
    }
    // return console.log(err);
    return resultado;
}  


async function leerAll(nombre){
    let resultado,resultado2,r2=[],id=[];
    try{
        
        const contenido =await models.usuarios.find({},{__v:0,_id:0});
        const contenido2 =await models.usuarios.distinct("author");
        // const contenido2 =await models.mensajes.find({});
        // const contenido =await fs.promises.readFile(nombre, 'utf8');
        resultado =contenido;
        resultado2 =contenido2;
        
        resultado.forEach((element, index) => {
            for (const [key, value] of Object.entries(element)) {
                if(value.id){
                   id.push(value.id);
                }
               
              }
            r2.push({
                id:id[index],
                author:element.author,
                title:element.text,
                comments:[{
                    id:`${(Math.random() + 1).toString(36).substring(7)}${element.author.id}`,
                    commenter:element.author
                }]
            })
        })

    }
    catch(err){
        resultado= err;
    }
    return r2;
    // return resultado;
    // return console.log(resultado);
}

async function leerNombre(name,nombre){
    let resultado,r2;
    try{
        const contenido =await models.usuarios.find({username: name}, {_id: 0, __v: 0});
        // const contenido =await fs.promises.readFile(ruta, 'utf8');
        resultado =contenido;
        if(resultado.length==0){
            resultado="Nombre especificado no existe en el archivo"
        }
    }
    catch(err){
        resultado= err;
    }
    return resultado[0];
}

module.exports = ContenedorMongoDb;