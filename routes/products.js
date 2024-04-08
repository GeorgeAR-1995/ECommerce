const client = require('../database/index.js')
const express = require('express');

const app = express()
const port = 3000

app.listen(3000, ()=>{
    console.log("Sever is now listening at port 3000");
})

client.connect();


app.get('/products', (req, res)=>{
    client.query(`Select * from products`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
})