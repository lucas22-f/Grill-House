//PROGRAMANDO EL INDEX DE MI WEB DONDE DE AQUI DERIVA A LAS DEMAS OPCIONES DE LA WEB;
//dependencias a requerir

const express = require("express"); // requerimos nuevamente express

const router = express.Router();// definimos a router como el enrutador principal de express con:
//express.Router();

const nodemailer = require("nodemailer"); // requerimos nodemailer dep que nos ayuda 
//con el envio de mails

const {body,validationResult} = require("express-validator");//definimos al OBJETO body,validationResult = 
// que requiere las validaciones de express validator

require("dotenv").config(); //requerimos dotenv para variables en archivo .env

const contactValidation = [ // armamos las validaciones que necesitemos :
    body("name","Debe ingresar su nombre").exists().isLength({min :2}),

    body("lastName","Debe ingresar su apellido").exists().isLength({min :2}),

    body("email","Debe ingresar un email valido").exists().isLength({min :2}),

    body("text","Su mensaje debe tener entre 30 y 200 caracteres").exists().isLength({min :10 , max :200})
]

router.get("/",(req,res)=>{ // hacemos el get para renderizar la vista "index";
    res.render("index");
}) 

router.get("/contacto",(req,res)=>{ // hacemos el get para renderizar la vista "contacto";
    res.render("contacto");
}) 

router.post("/contacto", contactValidation ,async (req,res)=>{ // cuando el usuario hace el post de nuestro FORMULARIO 
    //suceden las siguientes cosas :
    const errores = validationResult(req);  //definimos una variable para los errores si llegan a existir


    if (!errores.isEmpty()) { // preguntamos si la variable de errores no esta vacia ?
        //entonces en la variable datosFormulario metemos los datos ingresados por el post ( req.body )
        const datosFormulario = req.body;

        //luego creamos un array con los errores.array();
        const arregloErrores = errores.array();

        //renderizamos la vista contacto con los datos enviados mandando los datos ingresados en el form
        // y los errores en un array :)
        res.render("contacto", { datosFormulario , arregloErrores });

    }else{ // si la variable de errores esta vacia =========>
        
        const emailMsg = {  //creamos la constante donde ingresamos los datos requeridos por nodemailer:
            to: "atencion@grillhouse.com",
            from: req.body.email,
            subject: "Contacto desde formulario",
            html: `${req.body.name} ${req.body.lastName} Envia el siguiente mensaje :${req.body.text}`,
          };



        const transport = nodemailer.createTransport({  //creamos el transport requerido por nodemailer
            host: process.env.mail_host,
            port: process.env.mail_port,
            auth: {
              user: process.env.mail_user,
              pass: process.env.mail_pass
            }
          });
        
          let mailStatus = await transport.sendMail(emailMsg);  //creamos la variable mail status
          //donde debe ser su contenido asincrono ya que espera a que transport envie el mensaje

          let statusMsg = " "; // creamos un string para hacer aparecer un mensaje 
          if(mailStatus.rejected.length){// si la variable fue rechazada ? 
                statusMsg = "No pudimos enviar "// string contiene ""
          }else{
                statusMsg = "Mensaje enviado correctamente" // string contiene ""
          }

          res.render("contacto", {statusMsg}); // renderizamos la vista contacto con los datos 
          //que provienen desde statusMsg

    }

})

router.get("/nosotros",(req,res)=>{ //renderizamos la vista nosotros ! 
    res.render("nosotros");
})

module.exports = router; // IMPORTANTE al finalizar cada modulo de enrutador se debe exportar el router.
