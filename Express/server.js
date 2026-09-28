const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();      // Iniciar la aplicacion como en Flask
app.use(cors());        // va a usar algo llamado los cors 
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mi_api'
});

db.connect(function(err) {   //funcion anonima que en caso de error imprime el error y si no imprime que se conecto a la base de datos
    if (err) { console.error(err); return; }
    console.log('Conectado a la base de datos MySQL');
});
//app sale de la instancia de express y get es un metodo que recibe dos parametros, la ruta y una funcion anonima que recibe dos parametros req y res
app.get("/usuarios", function(req, res) {   //requiere y response, es decir que cuando se haga un get a la ruta /usuarios va a ejecutar la funcion anonima 
    db.query("SELECT * FROM usuarios", function(err, results) {  //funcion callback que recibe dos parametros err y results, si hay un error devuelve un json con el error y si no devuelve un json con los resultados
        if(err) return res.status(500).json({ error: err.message });
        res.json(results);    //retorna results que son los datos error 200 arreglo de usuarios en JSON y 500 error en la base de datos
    });
});

app.post("/usuarios", function(req, res) {   //requiere y response, es decir que cuando se haga un post a la ruta /usuarios va a ejecutar la funcion anonima
    const nombre = req.body.nombre;   //req.body es un objeto que contiene los datos enviados en el cuerpo de la solicitud, en este caso el nombre del usuario
    const email = req.body.email;   //req.body es un objeto que contiene los datos enviados en el cuerpo de la solicitud, en este caso el email del usuario
    db.query("INSERT INTO usuarios (nombre, email) VALUES (?, ?)", 
        [nombre, email], function(err, results) {  //funcion callback que recibe dos parametros err y results, si hay un error devuelve un json con el error y si no devuelve un json con los resultados   //retorna un mensaje de exito y el id del usuario agregado
            res.status(201).json({
                id : results.insertId,
                nombre : nombre,
                email : email
            })
        })
});

app.get("/usuarios/:id", function(req, res) {   //requiere y response, es decir que cuando se haga un get a la ruta /usuarios/:id va a ejecutar la funcion anonima
    const id = req.params.id;
    db.query("SELECT * FROM usuarios WHERE id = ?", 
        [id], function(err, results) { 
            if (results.length === 0)
                return res.status(404).json({ mensaje: "No encontrado" });
            res.json(results[0]);
        });
});

app.put("/usuarios/:id", function(req, res) {   //requiere y response, es decir que cuando se haga un get a la ruta /usuarios/:id va a ejecutar la funcion anonima
    const id = req.params.id;
    const nombre = req.body.nombre;
    const email = req.body.email;
    db.query("UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?", 
        [nombre, email, id], function(err, results) { 
            if (results.length === 0)
                return res.status(404).json({ mensaje: "No encontrado" });
            res.json(results[0]);
        });
});

app.delete("/usuarios/:id", function(req, res) {   //requiere y response, es decir que cuando se haga un post a la ruta /usuarios va a ejecutar la funcion anonima
    const id = req.params.id;
    db.query("DELETE FROM usuarios WHERE id = ?", 
        [id], function(err, results) { 
            if (results.affectedRows === 0)
                return res.status(404).json({ mensaje: "No encontrado" });
            res.json({ mensaje: "Usuario eliminado" });
        });
});

app.listen(3000);