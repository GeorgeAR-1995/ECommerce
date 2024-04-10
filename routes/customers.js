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

// Close the database client when the application is shutting down
process.on('exit', () => {
    client.end();
});

//Ctrl+C kills server
process.on('SIGINT', () => {
    client.end();
    process.exit();
});
