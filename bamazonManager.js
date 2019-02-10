require("dotenv").config();
var mysql = require('mysql');
var inquirer = require('inquirer');

// Create a connection to a specific databse
var connecton = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.PASSWORD,
    database: "bamazon"
});

// Start a connection
connecton.connect(function (error) {
    if (error) {
        throw error;
    }
    
    console.clear();
    console.log("Connected to server.\nManager View.");
    //showAllInventory(); // Shows the current state ofthe table
    menuPrompt();
});


var menuPrompt = function () {
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "Make a choice",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "Exit"
            ]
        }
    ]).then(function(answer){
        console.log("< Selection: " + answer.choice + " >");
        
        if (answer.choice === "View Products for Sale") {
            showAllInventory();
        }
        if (answer.choice === "View Low Inventory") {
            findLowInventory();
        }
        if (answer.choice === "Add to Inventory") {
            addInventory();
        }
        if (answer.choice === "Exit") {
            console.clear();
            console.log("The program is now closed.");
            process.exit();
        }
        // connecton.end();
    })
}

// Function to show current table state in database
var showAllInventory = function () {
    connecton.query("SELECT * FROM products", function (err, res) {
        if (err) {
            console.error(err.sqlMessage);
        } 
            
        console.clear();
        console.table(res); // Show the table
        menuPrompt();       // Go back to main menu prompt
    })
}

// Function to find inventory amounts less than five
var findLowInventory = function () {
    connecton.query("SELECT * FROM bamazon.products WHERE stock_quantity < 5",function (err, res) {
        if (err) {
            console.error(err.sqlMessage);
        }

        console.clear();
        console.log("<All items with a quantity less than five>");        
        console.table(res);// display all items with a quantity less than 5
        menuPrompt();
    })
}

// Function: addInventory() - Add a value to amount in database
var addInventory = function () {
    
    // Get every product name in the database
    let productList = [];
    let invCount = [];
    
    connecton.query("SELECT product_name, stock_quantity FROM bamazon.products;", function (error, response) {

        if (error) {    
            console.error(error.message);            
        }

        for (let i = 0; i < response.length; i++) {
            productList[i] = response[i].product_name;
            invCount[i] = response[i].stock_quantity;
            console.log(productList[i] + ":\t" + invCount[i]);
        }

        inquirer.prompt([{
            type: "list",
            name: "choice",
            message: "Which item do you want to add inventory to?",
            choices: productList,
        },
        {
            type: 'input',
            name: 'amountToAdd',
            message: 'What amount is being added to inventory?',
            validate: function (value) {

                if (value == ('exit')) {
                    console.clear();
                    console.log("\nThe program is now closed.");
                    process.exit();
                }

                /* Stop the user from entering a negative value */
                if (value <= 0) {
                    console.log("\nYou must enter a positive integer to add inventory");
                    console.log("Try again");
                    return false;
                }

                // Check to make sure the input is a number
                if (isNaN(value) == false) {
                    return true;
                } 
                else {
                    return false;
                }
            }
        }
        ]).then(function (answer) {
            console.log("Adding " + answer.amountToAdd + " to " + answer.choice);

            let updateQuery = 'UPDATE bamazon.products SET stock_quantity = stock_quantity + ? WHERE product_name = ?';
            connecton.query(updateQuery,[answer.amountToAdd, answer.choice], function (error, response) {

                if (error) {
                    console.error(error.sqlMessage);
                } 
            })
            menuPrompt();
        })
        
    })
 }