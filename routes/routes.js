//app setup with postgre, express
const client = require('../config/database.js')
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


//order routes
app.get('/orders', (req, res)=>{
    client.query(`Select * from orders`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        } else {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

app.get('/orders/:id', (req, res) => {
    const orderId = req.params.id; 
    client.query('SELECT * FROM orders WHERE order = $1', [orderId], (err, result) => {
        if (!err) {
            res.send(result.rows);
        } else {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

app.post('/orders', (req, res) => {
    const order = req.body;
    const { order_id, customer_id_fk, order_date, product_id_fk, address_id_fk, total_cost } = order;
    const insertQuery = `INSERT INTO orders (order_id, customer_id_fk, order_date, product_id_fk, address_id_fk, total_cost ) VALUES ($1, $2, $3, $4, $5, $6)`;
    const values = [order_id, customer_id_fk, order_date, product_id_fk, address_id_fk, total_cost];

    client.query(insertQuery, values, (err, result) => {
        if (!err) {
            res.send('Insertion added to batabase successfully.');
        } else {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
        }
    })
});

app.put('/orders/:id', (req, res)=> {
    const orderId = req.params.id;
    let order = req.body;
    const { order_id, customer_id_fk, order_date, product_id_fk, address_id_fk, total_cost } = order;
    let updateQuery = `UPDATE orders
                       SET 
                       customer_id_fk = $1,
                       order_date = $2,
                       product_id_fk = $3,
                       address_id_fk = $4,
                       total_cost = $5
                       WHERE order_id = $6`;

    const values = [customer_id_fk, order_date, product_id_fk, address_id_fk, total_cost, orderId];


    client.query(updateQuery, values, (err, result) => {
        if (!err) {
            res.send('Update to database was successful.');
        } else {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
        }
    })
});

app.delete('/orders/:id', (req, res)=> {
    let deleteQuery = `delete from orders where order_id = $1`
    const orderId = req.params.id;

    client.query(deleteQuery, [orderId], (err, result) => {
        if(!err){
            res.send('Deletion was successful');
        }
        else { 
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
        }
    })
});

//customer routes
app.get('/customers', (req, res)=>{
    client.query(`Select * from customers`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        } else {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

app.get('/customers/:id', (req, res) => {
    const customerId = req.params.id; 
    client.query('SELECT * FROM customers WHERE customer_id = $1', [customerId], (err, result) => {
        if (!err) {
            res.send(result.rows);
        } else {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

app.post('/customers', (req, res) => {
    const customer = req.body;
    const { customer_id, first_name, last_name,	email, phone, passwordhash } = customer;
    const insertQuery = `INSERT INTO customers(customer_id, first_name, last_name,	email, phone, passwordhash) VALUES ($1, $2, $3, $4, $5, $6)`;
    const values = [customer_id, first_name, last_name,	email, phone, passwordhash];

    client.query(insertQuery, values, (err, result) => {
        if (!err) {
            res.send('Insertion added to batabase successfully.');
        } else {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
        }
    })
});

app.put('/customers/:id', (req, res)=> {
    const customerId = req.params.id;
    let customer = req.body;
    const { customer_id, first_name, last_name,	email, phone, passwordhash } = customer;
    let updateQuery = `UPDATE customers
                       SET 
                       first_name = $1,
                       last_name = $2,
                       email = $3,
                       phone = $4,
                       passwordhash = $5
                       WHERE customer_id = $6`;

    const values = [first_name, last_name, email, phone, passwordhash, customerId];

    client.query(updateQuery, values, (err, result) => {
        if (!err) {
            res.send('Update to database was successful.');
        } else {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
        }
    })
});

app.delete('/customers/:id', (req, res)=> {
    let deleteQuery = `delete from customers where customer_id = $1`
    const customerId = req.params.id;

    client.query(deleteQuery, [customerId], (err, result) => {
        if(!err){
            res.send('Deletion was successful');
        }
        else { 
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
        }
    })
});

//address routes
app.get('/addresses', (req, res)=>{
    client.query(`Select * from addresses`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        } else {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

app.get('/addresses/:id', (req, res) => {
    const addressId = req.params.id; 
    client.query('SELECT * FROM addresses WHERE address_id = $1', [addressId], (err, result) => {
        if (!err) {
            res.send(result.rows);
        } else {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

app.post('/addresses', (req, res) => {
    const address = req.body;
    const { address_id, customer_id_fk, line1, line2, city, postcode, country } = address;
    const insertQuery = `INSERT INTO addresses (address_id, customer_id_fk, line1, line2, city, postcode, country) VALUES ($1, $2, $3, $4, $5, $6, $7)`;
    const values = [address_id, customer_id_fk, line1, line2, city, postcode, country];

    client.query(insertQuery, values, (err, result) => {
        if (!err) {
            res.send('Insertion added to batabase successfully.');
        } else {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
        }
    })
});

app.put('/addresses/:id', (req, res)=> {
    const addressId = req.params.id;
    let address = req.body;
    const { address_id, customer_id_fk, line1, line2, city, postcode, country } = address;
    let updateQuery = `UPDATE addresses
                       SET 
                       customer_id_fk = $1,
                       line1 = $2,
                       line2 = $3,
                       city = $4,
                       postcode = $5,
                       country = $6
                       WHERE address_id = $7`;

    const values = [customer_id_fk, line1, line2, city, postcode, country, addressId];


    client.query(updateQuery, values, (err, result) => {
        if (!err) {
            res.send('Update to database was successful.');
        } else {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
        }
    })
});

app.delete('/addresses/:id', (req, res)=> {
    let deleteQuery = `delete from addresses where address_id = $1`
    const addressId = req.params.id;

    client.query(deleteQuery, [addressId], (err, result) => {
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
