const express = require('express')
const app = express();

//running db server
const db = require('./DatabaseServer');

//running server on port 3001
app.listen(
    3001,
    (req, res) => {
        console.log("server start");
    }
)
db.createUser();