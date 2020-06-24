const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./user');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}) );

app.use(express.static(path.join(__dirname, 'public')));

//DB
const mongo_uri = 'mongodb://127.0.0.1:27017/todos';

app.post('/register', (req, res) =>{
    const {username, password} = req.body;

    const user = new User({username, password});

    user.save(err =>{
        if(err){
            res.status(500).send('ERROR AL REGISTAR USUARIO');
        }else{
            res.status(200).send('USUARIO REGISTRADO')
        }
    });
});

app.post('/authenticate', (req, res) => {
    const {username, password} = req.body;

    User.findOne({username}, (err, user) =>{
        if(err){
            res.status(500).send('ERROR AL AUTENTICAR USUARIO');
        }else if(!user){
            res.status(500).send('EL USUARIO NO EXISTE');
        }else{
            user.isCorrectPassword(password, (err, result) =>{
                if(err){
                    res.status(500).send('ERROR AL AUTENTICAR'); 
                }else if(result){
                    res.status(200).send('USUARIO AUTENTICADO CORRECTAMENTE');
                }else{
                    res.status(500).send('USUARIO Y/O CONTRASEÑA INCORRECTA'); 

                }
            });
        }
    });
});



//validar conexion
mongoose.connect(mongo_uri,{useNewUrlParser: true, useUnifiedTopology: true}, function(err){
    if (err){
        throw err;
    } else {
        console.log( `Conexion exitosa a base de datos ${mongo_uri}` );
    }
})


app.get('/', (req,res) =>{


});

/** Puerto y host para la app */
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log('El servidor esta funcionando')
});

module.exports = app;