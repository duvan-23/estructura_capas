const faker  = require( '@faker-js/faker');
const {login,faillogin,logout,info,infozip,infodebug,randoms,postOrigen,origen,failregister,register,registerVery,loginVery,deserializeUser,connection,nodefinida} = require("../controlador/controlador.js");
const util = require( 'util');
const dotenv = require( 'dotenv/config')
faker.locale = 'es';



const express = require( 'express');

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
const logger = require( '../logger.js');

const app = express.Router();

function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
    next()
    } else {
    res.redirect('/login')
    }
}
app.get('/register', compression(), async(req, res) => {
    await register(req,res);
})
app.post('/register', passport.authenticate('register', { failureRedirect: '/failregister', successRedirect: '/'}))

app.get('/failregister', compression(), async(req, res) => {
    await failregister(req,res);
})

app.get('/', isAuth, compression(), async(req, res) => {
    await origen(req,res);
})

app.post('/', async(req, res) => {
    await postOrigen(req, res); 
})

app.get('/login', compression(), async(req, res) => {
    await login(req, res);
})
app.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin', successRedirect: '/'}))

app.get('/faillogin', compression(), async(req, res) => {
    await faillogin(req,res);
})

app.get('/logout', compression(), async(req, res) => {
    await logout(req,res);
})



app.all('*', async(req, res) => {
    await nodefinida(req, res);
})

const routerOps=app;
module.exports={routerOps};