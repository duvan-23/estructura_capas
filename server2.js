const express =require('express');

    const app =express();

    const PORT = parseInt(process.argv[2]) || 8080;

    app.get('/', (req, res) => {
        console.log("hola");
        res.send(`servidor express on ${PORT} - PID ${process.pid} - ${new Date().toLocaleString()}`);

    });

    app.listen(PORT, err => {
        console.log(err);
})


//Modo fork
//un solo nucleo
//pm2 start server.js --name="serverFork" --watch -- 8081

//pm2 list
//pm2 stop 0
//pm2 restart 0
//pm2 delete 0
//pm2 describe 0
//pm2 monit
//pm2 delete all

//Modo cluster
//puede usar varios nucleos
//pm2 start server.js --name="servercluster" --watch -i max -- 8082