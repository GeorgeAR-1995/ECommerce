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

// Close the database client when the application is shutting down
process.on('exit', () => {
    client.end();
});

//Ctrl+C kills server
process.on('SIGINT', () => {
    client.end();
    process.exit();
});
