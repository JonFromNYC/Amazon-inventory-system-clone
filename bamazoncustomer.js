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

    console.log("Successfully connected to the Database");

    showTable();
})

var showTable = function () {
    connecton.query(`SELECT * FROM products`, function (error,res) {
        
        for (let i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " " + 
                        res[i].product_name + "\t| " + 
                        res[i].department_name + "\t | " + 
                        res[i].price + "\t | " + 
                        res[i].stock_quantity + "\n");
        }
        askUser(res);
    })
}

var askUser = function (res) {
    inquirer.prompt([{
        type: 'input',
        name: 'choice',
        message: 'Choose what you want to buy'
    }]).then(function (answer) {
        var correct = false;
        if(answer.choice.toLowerCase() == ('quit')){
            process.exit();
        }
        for (let i = 0; i < res.length; i++) {
            if (res[i].product_name == answer.choice) {
                correct = true;
                var product = answer.choice;
                var id = i;
                inquirer.prompt({
                    type: "input",
                    name: "quantity",
                    message: "What amount do you want?",
                    validate: function (value) {
                        if(isNaN(value) == false){
                            return true;
                        } else {
                            return false;
                        }
                    }
                }).then(function (answer) {
                    if((res[id].stock_quantity - answer.quantity) > 0){
                        connecton.query("UPDATE products SET stock_quantity='" +
                                        (res[id].stock_quantity - answer.quantity) +
                                        "'WHERE product_name='" + product + "'",
                                        function (error,res2) {
                                            console.log("Product purchased!");
                                        })
                    } else {
                        console.log("Invalid selection. Try again.");
                        askUser(res);
                    }
                })
            }
        }
        if (i == res.length && correct == false) {
            console.log("Invalid choice. Try Again please.");
            askUser(res);
        }   
    })
}