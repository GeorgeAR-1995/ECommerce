//app setup with postgre, express
const client = require('../database/index.js')
const express = require('express');

const app = express()

app.use(express.json());

//set PORT as either assigned port or 3000
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Sever is now listening at port ${port}`);
});

client.connect();

//product routes
app.get('/products', (req, res)=>{
    client.query(`Select * from products`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        } else {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

app.get('/products/:id', (req, res) => {
    const productId = req.params.id; 
    client.query('SELECT * FROM products WHERE product_id = $1', [productId], (err, result) => {
        if (!err) {
            res.send(result.rows);
        } else {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

app.post('/products', (req, res) => {
    const product = req.body;
    const { product_id, product_name, price, stock_quantity } = product;
    const insertQuery = `INSERT INTO products(product_id, product_name, price, stock_quantity) VALUES ($1, $2, $3, $4)`;
    const values = [product_id, product_name, price, stock_quantity];

    client.query(insertQuery, values, (err, result) => {
        if (!err) {
            res.send('Insertion added to batabase successfully.');
        } else {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
        }
    })
});

app.put('/products/:id', (req, res)=> {
    const productId = req.params.id;
    let product = req.body;
    const { product_id, product_name, price, stock_quantity } = product;
    let updateQuery = `UPDATE products
                       SET 
                       product_name = $1,
                       price = $2,
                       stock_quantity = $3
                       WHERE product_id = $4`;

    const values = [product_name, price, stock_quantity, product_id];

    client.query(updateQuery, values, (err, result) => {
        if (!err) {
            res.send('Update to database was successful.');
        } else {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
        }
    })
});

app.delete('/products/:id', (req, res)=> {
    let deleteQuery = `delete from products where product_id = $1`
    const productId = req.params.id;

    client.query(deleteQuery, [productId], (err, result) => {
        if(!err){
            res.send('Deletion was successful');
        }
        else { 
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
        }
    })
});

// Close the database client when the application is shutting down
process.on('exit', () => {
    client.end();
});

//Ctrl+C kills server
process.on('SIGINT', () => {
    client.end();
    process.exit();
});
