const express = require("express"); /*al inicio de toda aplicacion es necesario requerir express 
en nuestro projecto*/

const hbs = require("hbs");   //requerimos hbs nuestro sistema de plantillas para utilizar js en las views

const path = require("path"); //requerimos path para poder ingresar a las rutas correspondientes

const port = 3000;  //definimos un puerto para lanzar la app

const fileupload = require("express-fileupload"); // fileupload es la dependencia que utilizamos para
// hacer la subida de archivos (FILES) mendiante express fileupload

const session = require("express-session"); // reqeuerimos express sessions para manejar sesiones en 
//nuestra Web


require('dotenv').config()  //requerimos dotenv para manejar variables de manera privada en un archivo
// .env

const app = express(); //esta linea es para asignarle a app todo el valor de express
//este seria el inicio de nuestra aplicacion web


//configuramos express-fileupload
app.use(fileupload({
    useTempFiles:true,
    tempFileDir:"/tmp/"
}));

//seteamos el express-session   
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized:true,
    })

)
//creamos el middleware para el ingreso a home mediante rutas 
const secured = async (req ,res , next)=>{
    if (req.session.usuario){
        next()
    }else{
        const message = "Por favor ingrese su usuario y contraseña"
        res.render("login",{message});
    }
}
//variable global creada en el middleware para el uso de la variable en la view :)
const auth = async (req,res,next)=>{
    app.locals.usuario = req.session.usuario;
    next();
}

//definimos donde esta el espacio estatico
app.use(express.static(path.join(__dirname,"public")));


//enrutadores
const mainRouter = require("./routes/index"); //mainRouter indica el router main en index.js
const login = require("./routes/login");// router para login
const home = require("./routes/home");// router para home
const crud = require("./routes/crud");// router para crud
const indexCatalogo = require("./routes/indexCatalogo");// router para el indexCatalogo

//definir el motor de plantillas
app.set("view engine","hbs");

//definimos donde se encuentran las vistas " views "
app.set("views",path.join(__dirname,"views"));



//para que funcione el post del formulario inicio sesion
app.use(express.urlencoded ({  extended : false  }));


//registrar partials hbs
hbs.registerPartials(path.join(__dirname,"./views/partials"));

//definimos enrutador
app.use("/", auth ,mainRouter);// para ir al "index" la app corre mainRouter "index.js" 
app.use("/login",login);// para ir al "login" la app corre login.js
app.use("/home", secured ,home);// para ir al home la app coore PRIMERO el middleware secured luego home.js
app.use("/crud",secured ,crud);// para ir al crud la app corre PRIMERO el mddl secured luego crud.js
app.use("/indexCatalogo",indexCatalogo);// para ir al indexCatalogo la app corre indexCatalogo.js

//lanzo mi app en localhost 

app.listen(port,(err) =>{ // app escucha un puerto disponible y pregunta si existe un error lo lanza
    //si no , nos avisa si la app esta corriendo en el servidor del numero "port";
    err ? console.log(err) : console.log(`servidor corriendo en http://localhost:${port}`);
})