const logger = require( '../logger.js');
const services = require( '../negocio/negocio.js');
const { fork } = require( 'child_process');
const bcrypt = require( 'bcrypt');
const { normalize, denormalize, schema } = require( 'normalizr');
const login = async (req, res) => {
    const { url, method } = req;
    logger.info(`Ruta ${url}, Metodo ${method}`);
    // res.sendFile('index.pug', {root: __dirname})
    await services.conectarse();
    if (req.isAuthenticated()) {
        res.redirect('/');
    }else{
        res.render('./views/login')
    }
}
const faillogin = async (req, res) => {
    const { url, method } = req;
    logger.info(`Ruta ${url}, Metodo ${method}`);
    res.render('./views/login-error')
}
const logout = async (req, res) => {
    const { url, method } = req;
    logger.info(`Ruta ${url}, Metodo ${method}`);
    req.logout(err => {
        res.redirect('/login')
    })
}
const info = async (req, res,process,numCpus) => {
    const args = process.argv;
    const argumentos = args.slice(2);
    const ejecutable = process.execPath.split('/').pop();
    const pid = process.pid;
    const carpeta = process.cwd();
    const rss = process.memoryUsage.rss();
    const plataforma = process.platform;
    const node_v = process.version;
    const { url, method } = req;
    logger.info(`Ruta ${url}, Metodo ${method}`);
    res.render('./views/info',{datos:[argumentos , ejecutable, pid, carpeta, rss, plataforma, node_v, numCpus]})
}
const infozip = async (req, res,process,numCpus) => {
    const args = process.argv;
    const argumentos = args.slice(2);
    const ejecutable = process.execPath.split('/').pop();
    const pid = process.pid;
    const carpeta = process.cwd();
    const rss = process.memoryUsage.rss();
    const plataforma = process.platform;
    const node_v = process.version;
    const { url, method } = req;
    logger.info(`Ruta ${url}, Metodo ${method}`);
    res.render('./views/info',{datos:[argumentos , ejecutable, pid, carpeta, rss, plataforma, node_v, numCpus]})
}
const infodebug = async (req, res,process,numCpus) => {
    const args = process.argv;
    const argumentos = args.slice(2);
    const ejecutable = process.execPath.split('/').pop();
    const pid = process.pid;
    const carpeta = process.cwd();
    const rss = process.memoryUsage.rss();
    const plataforma = process.platform;
    const node_v = process.version;
    const { url, method } = req;
    logger.info(`Ruta ${url}, Metodo ${method}`);
    console.log({datos:[argumentos , ejecutable, pid, carpeta, rss, plataforma, node_v, numCpus]});
    res.render('./views/info',{datos:[argumentos , ejecutable, pid, carpeta, rss, plataforma, node_v, numCpus]})
}
const randoms = async (req, res,process,modoCluster,PORT) => {
    const { url, method } = req;
    logger.info(`Ruta ${url}, Metodo ${method}`);
    const numero =req.query.cant;
    let numero1 = parseInt (numero);
    console.log(`Server en PORT(${PORT}) - PID(${process.pid}) - FYH(${new Date().toLocaleString()}) -- ${modoCluster}`);
    if(!(numero1>0)){
        numero1=100000000;
    }
    // const computo = fork(path.resolve(process.cwd(), './calculo.js'))
    // computo.send(numero1);
    // computo.on('message', resultado => {
    //     if (resultado === 'listo') {
    //         computo.send('start')
    //     } else {
    //         res.json({ resultado })
    //     }
    // })
}
const postOrigen = async (req, res) => {
    const { url, method } = req;
    logger.info(`Ruta ${url}, Metodo ${method}`);
    let datos = req.body.nombre;
    if (req.user.contador) {
        req.user.contador++
        // console.log(`${req.user.username}, visitaste la pagina ${req.user.contador} veces`);
        res.redirect('/');
    } else if(req.body.nombre){
        req.user.contador = 1;
        req.user.username = datos;
        // console.log(`Hello there. ${req.user.username}`);
        res.redirect('/');
    }else{
        res.redirect('/login');
    }
}
const origen = async (req, res) => {
    if (!req.user.contador) {
        req.user.contador = 0
    }
    let contador =req.user.contador+1;
    await services.actualizarUsuarios(req.user.username,contador);
    // console.log(`${req.user.username}, visitaste la pagina ${contador} veces`);
    const { url, method } = req;
    logger.info(`Ruta ${url}, Metodo ${method}`);
    res.render('./views/mensajes',{nombre:req.user.username})
}
const failregister = async (req, res) => {
    const { url, method } = req;
    logger.info(`Ruta ${url}, Metodo ${method}`);
    res.render('./views/register-error')
}
const register = async (req, res) => {
    const { url, method } = req;
    logger.info(`Ruta ${url}, Metodo ${method}`);
    res.render('./views/register');
}
const registerVery = async (req, username, password, done) => {
    const { direccion } = req.body
    // const usuario = usuarios.find(usuario => usuario.username == username);
    const usuario = await services.getNombre(username);
    if (usuario!="Nombre especificado no existe en el archivo") {
    return done('user already registered')
    }
    const rounds = 10;
    bcrypt.hash(password, rounds, async(err, hash) => {
        if (err) {
        console.error(err)
        return
        }
        const contador=0;
        password=hash;
        const user = {
        username,
        password,
        direccion,
        contador
        }
        await services.agregarUsuarios(user);

        return done(null, user)
    })   
}
const loginVery = async (username, password, done) => {
    const user =await  services.getNombre(username);
    if (user=="Nombre especificado no existe en el archivo") {
    return done(null, false)
    }
    let respuesta;
    bcrypt.compare(password, user.password, (err, res) => {
        if (err) {
        console.error(err)
        return
        }
        respuesta=res; //true or false
        if (!respuesta) {
            return done(null, false)
        }
        user.contador = 0
        return done(null, user)
    })  
}
const deserializeUser=async(username, done) =>{
    const usuario =await  services.getNombre(username);
    done(null, usuario)
}
const connection=async(socket,io) =>{
    console.log('Un cliente se ha conectado!')
    //normalizr 
    const user = new schema.Entity('users');

    const comment = new schema.Entity('comments', {
        commenter: user
    })

    const post = new schema.Entity('posts', {
        author: user,
        comments: [comment]
    })

    const blog = new schema.Entity('blog', {
        posts: [post]
    })


        

    function print(objeto) {
        // console.log(util.inspect(objeto,false,12,true))
    }
    const consulta =await services.mostrarMensajes();
    const datos ={
        id: "10000",
        posts:consulta
    }
    console.log('Objeto normalizado')
    const normalizedHolding = normalize(datos, blog)
    // print(normalizedHolding)
    // Porcentaje de reduccion
    // console.log('Porcentaje de reduccion')
    // console.log(100 - ((JSON.stringify(normalizedHolding).length * 100) / JSON.stringify(datos).length))


    // console.log('Objeto denormalizado')
    // const denormalizedHolding = denormalize(normalizedHolding.result, blog, normalizedHolding.entities)
    // print(denormalizedHolding)

    socket.emit('messages', normalizedHolding)

    socket.on('new-message', async data => {
        let mensajes;
        await services.grabarMensajes(data);
        // await contenedorMongo.insertarMensajes(data);
        const consulta =await services.mostrarMensajes();
        const user = new schema.Entity('users');

    const comment1 = new schema.Entity('comments', {
        commenter: user
    })

    const post1 = new schema.Entity('posts', {
        author: user,
        comments: [comment1]
    })

    const blog1 = new schema.Entity('blog', {
        posts: [post1]
    })
        const datos1 ={
            id: "10000",
            posts:consulta
        }
        // console.log('Objeto origen')
        // print(datos1)
        
        // console.log('Objeto normalizado')
        const normalizedHolding1 = normalize(datos1, blog1)
        // print(normalizedHolding1)

        io.sockets.emit('messages', normalizedHolding1)
    })
    // socket.emit('products', productos)
    socket.emit('products', await services.mostrarProductos())

    socket.on('new-product', async data => {
        // productos.push(data)
        await services.grabarProductos(data);
        io.sockets.emit('products',  await services.mostrarProductos())
    })
}
const nodefinida=async(req, res) =>{
    const { url, method } = req
    logger.warn(`Ruta ${method} ${url} no implementada`)
    res.send(`Ruta ${method} ${url} no implementada`)
}

module.exports={login,logout,info,faillogin,infozip,infodebug,randoms,postOrigen,origen,failregister,register,registerVery,loginVery,deserializeUser,connection,nodefinida};