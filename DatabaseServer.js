const express = require('express');
const mysql = require('mysql');

const db = mysql.createPool({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: 'admin',
    database: 'node_login'
})

db.getConnection((err, connection) => {
    if(err) throw (err);
    console.log("DB connected : " + connection.threadId)
})