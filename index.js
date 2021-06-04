const express = require("express");
const app = express();
const morgan = require("morgan");

const {Pool} = require('pg');
const connectionString = 'postgressql://postgres:12345@localhost:5432/employeedb';

require('dotenv').config();

//console.log(process.env);
//const pg = require('pg');

let pool = new Pool({

    connectionString:connectionString
    
    });
//let pool2 = new pq.pool();

const port = process.env.PORT;

app.use(morgan('dev'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.get('/', (req,res) => {
    res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <form action="/info/get" method="GET">
        <input type="submit" value="GET">
        </form>
        <form action="/info/add" method="POST">
            <label for="add">ADD: </label>
            <label for="name">Name: </label>
            <input type="text" name="add" id="add">
            <label for="department">Department: </label>
            <input type="text" name="department" id="department">
            <input type="submit" value="ADD">
        </form>
        <form action="/info/delete" method="POST">
            <label for="delete">DELETE: </label>
            <input type="text" name="delete" id="delete">
            <input type="submit" value="DELETE">
        </form>
        <form action="/info/update" method="POST">
            <label for="oldValue">Old Value: </label>
            <input type="text" name="oldValue" id="oldValue">
            <label for="newValue">New Value: </label>
            <input type="text" name="newValue" id="newValue">
            <input type="submit" value="UPDATE">
        </form>
    </body>
    </html>`)
});

app.get('/info/get', (req, res)=>{
    try{
    pool.connect(async (error,client,release)=>{
        let resp = await client.query(`SELECT * FROM employee_details`);
        release();
        res.send(resp.rows);
    })
    }
    catch(error)
    {
        console.log(error);
    }
});

app.post('/info/add', (req, res)=>{
    try{
    pool.connect(async (error,client,release)=>{
        let resp = await client.query(`INSERT INTO employee_details (name,department) VALUES ('${req.body.add}')`);
        res.redirect('/info/get');
    })
    }
    catch(error)
    {
        console.log(error);
    }
});

app.post('/info/delete', (req, res)=>{
    try{
    pool.connect(async (error,client,release)=>{
        let resp = await client.query(`DELETE FROM employee_details WHERE name = '${req.body.delete}'`);
        res.redirect('/info/get');
    })
    }
    catch(error)
    {
        console.log(error);
    }
});

app.post('/info/update', (req, res)=>{
    try{
    pool.connect(async (error,client,release)=>{
        let resp = await client.query(`UPDATE employee_details SET name = '${req.body.newValue}' WHERE name = '${req.body.oldValue}'`);
        res.redirect('/info/get');
    })
    }
    catch(error)
    {
        console.log(error);
    }
});

app.listen(port, () => {
    console.log(`Server is Listening on ${port}`);
});