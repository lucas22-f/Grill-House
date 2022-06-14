"use strict"

const express  =  require("express");
const router = express.Router();
const modalCatalogo = require("../models/mdlGrill_house");
const cloudinary = require("cloudinary");

router.get("/",async (req,res)=>{

    const data = await modalCatalogo.traerProductos();
    
    const productos = data.map((row)=>{
        const urlImagen = cloudinary.url(row.imagen,{
            width:100,
            height:100,
            crop:"fill",
        })
        return {...row , urlImagen }
    })

    
    res.render("indexCatalogo" ,{productos});
})

module.exports = router;