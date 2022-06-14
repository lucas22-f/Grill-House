const pool = require("../db");
const md5 = require("md5");

const util = require("util");


const traerUser = async (usuario,password)=>{

    const query = "SELECT * FROM usuarios WHERE usuario = ? AND password = ?"

    const row = await pool.query(query, [usuario,md5(password)]);

    return row[0];


}

const traerProductos = async() =>{

    const query ="select * from productos"
    const rows = await pool.query(query);

    return rows;

}

const agregarProducto = async(data) =>{
    const query = "insert into productos set ?";
    const row = await pool.query(query,[data]);
    return row ;

}

const traerProducto = async (id)=>{
    const query = "select * from productos where id = ?"
    const row = await pool.query(query,[id]);
    return row;
}

const eliminarProducto = async (id) => {
    const query = "delete from productos where id = ?"
    const row = await pool.query(query,[id]);
    return row;
}
async function modificarProducto(producto,id){
    const query = "update productos set ? where id =?"
    const row = await pool.query(query,[producto,id]);
    return row;
}

module.exports = {traerUser,traerProductos, agregarProducto, traerProducto , eliminarProducto , modificarProducto};