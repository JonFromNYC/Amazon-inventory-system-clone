/**
 *  File:       bamazoncustomer.js
 *  Homework:   Week 12, Node.js & Mysql
 *  Assignment: Create an amazon-like storefront
 *  Author:     Jonathan Garcia
 *  
 *  The app will take in orders from customers 
 *  and deplete stock from the store 's inventory.
 *  
 */

require("dotenv").config();
var mysql = require('mysql');
var inquirer = require('inquirer');

// Create a connection to a specific databse
var connecton = mysql.createConnection({
    host: "localhost",
    port:   3306,
    user:   "root",
    password: process.env.PASSWORD,
    database: "bamazon"
})

// Start a connection
connecton.connect(function(error){
    if (error) {
        throw error;
    }

    console.log("Connection Successful");
})