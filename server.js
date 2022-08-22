const faker  = require( '@faker-js/faker');
const {login,faillogin,logout,info,infozip,infodebug,randoms,postOrigen,origen,failregister,register,registerVery,loginVery,deserializeUser,connection,nodefinida} = require("./controlador/controlador.js");
const util = require( 'util');
const dotenv = require( 'dotenv/config')
faker.locale = 'es';



const express = require( 'express');
const { Router } = express

const { createServer } = require( "http");

const { Server } = require( "socket.io");
//passport
const passport = require( "passport");
const { Strategy: LocalStrategy } = require('passport-local')
//session
const session = require( 'express-session')
// --------------------------------------//
const MongoStore = require( 'connect-mongo')
//------
const parseArgs = require( 'minimist');

const cluster = require( 'cluster');
const os = require( 'os');
const compression = require('compression');
const logger = require( './logger.js');
const {routerOps}=require('./rutas/rutas.js');
const routerInfo = new Router()
const options_puerto ={
    alias:{
        p:'puerto',
        m:'modo'
    },
    default:{
        puerto:8080,
        modo:"FORK"
    }
}
//-------
const { fork } = require( 'child_process')
const path = require( 'path')
//-------
const { puerto }= parseArgs(process.argv.slice(2),options_puerto);
const { modo }= parseArgs(process.argv.slice(2),options_puerto);
//--------
const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true }
//--------------------
const numCpus= os.cpus().length;
const modoCluster = process.argv[3] == 'CLUSTER';
if(cluster.isPrimary && modo =="CLUSTER" || modoCluster && cluster.isPrimary){
    // console.log('Numero de procesadores: ' + numCpus);
    // console.log('PID:' + process.pid);
    for (let i = 0; i < numCpus; i++) {
        cluster.fork();   
    }
    cluster.on('exit', worker => {
        // console.log('Worker1 ' + process.pid + ' murio');
        cluster.fork();
    })
}else{

    function isAuth(req, res, next) {
        if (req.isAuthenticated()) {
        next()
        } else {
        res.redirect('/login')
        }
    }
    const usuarios = [];
    //---------------------------------------------------//

    // PASSPORT REGISTER
    passport.use('register', new  LocalStrategy({
        passReqToCallback: true
    }, async (req, username, password, done) => {
        await registerVery(req, username, password, done);
    }))

    //---------------------------------------------------//
    // PASSPORT LOGIN
    passport.use('login', new  LocalStrategy(async(username, password, done) => {
        await loginVery(username, password, done);
    }))
    //---------------------------------------------------//
    // SERIALIZAR Y DESERIALIZAR

    passport.serializeUser(function(user, done) {
        done(null, user.username)
    })
    
    passport.deserializeUser(async function(username, done) {
        await deserializeUser(username, done);
    })


    const app = express()
    app.use(
    session({
        secret: 'shhhhhhhhhhhhhh',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 600000,
        },
        rolling: true,
    })
    )
    //---------------------------------------------------//
    // MIDDLEWARES DE PASSPORT
    app.use(passport.initialize())
    app.use(passport.session())
    //--------------------------------
    const httpServer = new createServer(app)
    const io = new Server(httpServer)

    //----------------
    app.use(express.static('./public'))
    app.use(express.urlencoded({extended:true}))
    app.use(express.json())
    app.set('views', './public')

    app.set('view engine', 'pug')


    //info sin compression 
    routerInfo.get('/', async(req, res) => {
        await info(req,res,process,numCpus);
    })
    //info con compression 
    routerInfo.get('/infozip', compression(), async(req, res) => {
        await infozip(req,res,process,numCpus);
        
        })
    //info con debug
    routerInfo.get('/infodebug', async(req, res) => {
        await infodebug(req,res,process,numCpus);
    })
    //node --max-old-space-size=8192 server -p 8085 d 33
    app.get('/api/randoms', isAuth, compression(), async(req, res) => {
        await randoms(req,res,process,modoCluster,PORT);
    })


    io.on('connection', async (socket) => {
        await connection(socket,io);
    })
    process.on('uncaughtException', function (err) {
        logger.error(err);
    });
    app.use('/info', routerInfo);
    app.use('/', routerOps);
    const PORT = process.env.PORT || parseInt(process.argv[2]) || 8080

    httpServer.listen(PORT, err => {
        if(err){
            logger.error(err);
            // console.log(err);
        }else{
            logger.info('Iniciando en el puerto: ' + PORT+' modo:'+modo+ ' pid:'+process.pid);
            // console.log('Iniciando en el puerto: ' + PORT+' modo:'+modo+ ' pid:'+process.pid);
        }
    })
}

//para correr lo de autocanon
//consola 1
//0x server.js

//consola 2 
//node benchmark.js
