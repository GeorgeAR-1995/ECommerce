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
                       country = $6,
                       WHERE address_id = $7`;

    const values = [address_id, customer_id_fk, line1, line2, city, postcode, country];

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
