
const express = require("express");
const async = require("hbs/lib/async");
const router = express.Router();
const mdlUsers = require("../models/mdlGrill_house")


router.get("/",(req,res)=>{
    res.render("login");
})


router.get("/logout",(req,res)=>{

    req.session.destroy()
    res.redirect("/");

})
router.post("/" , async (req,res)=>{
    const {usuario,password} = req.body;
    let data = await mdlUsers.traerUser(usuario,password);
    if(data != undefined){
        req.session.usuario = usuario;
        res.render("home",{usuario});
    }else{
        const message = "Usuario o contraseña incorrectos"
        res.render("login", {message});
    }



})


module.exports = router;