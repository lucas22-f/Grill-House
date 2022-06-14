const express = require("express");

const router = express.Router();

router.get("/",(req,res)=>{
    res.render("home", {usuario: req.session.usuario});
})

module.exports = router;