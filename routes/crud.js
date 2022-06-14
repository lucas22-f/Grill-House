"use strict";

const express = require("express");
const router = express.Router();
const modalCatalogo = require("../models/mdlGrill_house");
const util = require("util");
const cloudinary = require("cloudinary").v2;
const { route } = require(".");
const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);



router.get("/",async (req,res)=>{

    const data = await modalCatalogo.traerProductos();
    
    const productos = data.map((rta)=>{
        const urlImagen = cloudinary.url(rta.imagen,{
            width:100,
            height:100,
            crop:"fill",
        })
        return {...rta , urlImagen }
    })

    
    res.render("catalogo" ,{productos});
})

router.get("/agregarP",(req,res)=>{
    res.render("agregarP");
})

router.post("/agregarP", async(req,res)=>{
    let imagenFile = req.files.imagenFile;
    const imagen_id = (await uploader(imagenFile.tempFilePath)).public_id;
    const {nombre, descripcion , precio} = req.body
    const nuevoP = {
        nombre,
        descripcion,
        precio,
        imagen: imagen_id
    }
    await modalCatalogo.agregarProducto(nuevoP);
    res.redirect("/crud");
})


router.get("/editado/:id" ,async (req,res)=>{
    const row = await modalCatalogo.traerProducto(req.params.id);
    const productos = {
        id: row[0].id,
        nombre: row[0].nombre,
        descripcion: row[0].descripcion,
        precio: row[0].precio,
        imagen: row[0].imagen,
    }

    res.render("editarP" ,{productos});
})

router.get("/eliminarP/:id" , async (req,res)=>{
    const row  = await modalCatalogo.traerProducto(req.params.id);
    await destroy(row[0].imagen);
    await modalCatalogo.eliminarProducto(req.params.id);
    res.redirect("/crud");
})







router.post("/editarP" , async (req,res)=>{

    let imagen_id = null;
    if (!req.files){
        imagen_id = req.body.imagenPrev;
    }else{

        const row = await modalCatalogo.traerProducto(req.body.id);
        await destroy(row[0].imagen);
        const imagen_file = req.files.imagenFile;

        imagen_id = (await uploader(imagen_file.tempFilePath)).public_id;


    }
    const producto = {
        id: req.body.id,
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        precio: req.body.precio,
        imagen: imagen_id,
    }

    await modalCatalogo.modificarProducto(producto,producto.id);


    res.redirect("/crud");
}) 

module.exports = router;
