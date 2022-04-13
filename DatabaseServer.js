const express = require('express'); //import express library
const app = express();
const mysql = require('mysql'); //import mysql library

//create database pool
const db = mysql.createPool({
    host: '127.0.0.1', //mysql host, using localhost
    port: '3306', //mysql port, using default 3306
    user: 'root', //mysql user
    password: 'admin', //mysql passeord
    database: 'node_login' // Database name
})

// get connection to database
db.getConnection((err, connection) => {
    if (err) throw (err); // if error throw error message
    console.log("DB connected : " + connection.threadId) // printf thread if connected
});

//running server up
//using port 3001
// app.listen(3001, () => {
//     console.log('Server started!');
// })

// app.get('')

//register new user
//using bcrypt
const bcrypt = require('bcrypt');
//middleware to read req.body.<params>
app.use(express.json());

//create user
const createUser = app.post('/signUp', async (req, res) => {
    const user = req.body.name;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    db.getConnection(async (err, connection) => {
        if (err) throw (err)

        const sqlSearch = "SELECT * FROM account WHERE user = ?";
        const searchQuery = mysql.format(sqlSearch, [user])

        const sqlInsert = "INSER INTO account VALUES (0, ?, ?)";
        const insertQuery = mysql.format(sqlInsert, [user, hashedPassword]);

        await connection.query(searchQuery, async (err, result) => {
            if (err) throw (err)

            console.log("Search result");
            console.log(result.length);

            if (result.length != 0) {
                connection.release();
                console.log("user exist");
                res.sendStatus(409);
            }
            else {
                await connection.query(insertQuery, (err, result) => {
                    connection.release();

                    if (err) throw (err);
                    console.log("New User Created!");
                    console.log(result.insertId);
                    res.sendStatus(201);
                })
            }
        })
    })
})

export {createUser};