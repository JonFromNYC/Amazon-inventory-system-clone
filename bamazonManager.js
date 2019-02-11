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
    menuPrompt();
});

// Main Menu Prompt
var menuPrompt = function () {
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do from the choices below?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "Exit"
            ]
        }
    ]).then(function(answer){
        
        if (answer.choice === "View Products for Sale") {
            showAllInventory();
        }
        if (answer.choice === "View Low Inventory") {
            findLowInventory();
        }
        if (answer.choice === "Add to Inventory") {
            addInventory();
        }
        if (answer.choice === "Add New Product") {
            newProduct();
        }
        if (answer.choice === "Exit") {
            console.clear();
            console.log("The program is now closed.");
            process.exit();
        }
    });
}

// Function to show current table state in database
var showAllInventory = function () {
    connecton.query("SELECT * FROM products", function (err, res) {
        if (err) {
            console.error(err.sqlMessage);
        } 
            
        console.clear();    // Clear the console
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

        console.clear();    // Clear the console
        console.log("<All items with a quantity less than five>");        
        console.table(res); // display all items with a quantity less than 5
        menuPrompt();       // Go back to main menu
    })
}

// Function: addInventory() - Add a value to amount in database
var addInventory = function () {
    
    // Get every product name in the database
    let productList = [];   // Hold a list of product names
    let invCount = [];      // Hold the inventory values
    
    connecton.query("SELECT product_name, stock_quantity FROM bamazon.products;", function (error, response) {

        if (error) {    
            console.error(error.message);            
        }
        
        // Keep a view of the current database values while the user makes a selection
        for (let i = 0; i < response.length; i++) {
            productList[i] = response[i].product_name;
            invCount[i] = response[i].stock_quantity;
            console.log(productList[i] + ":\t" + invCount[i]);
        }

        console.log("\n");
        
        // Prompt - ask the user for item and quantity to amend
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

                // Stop the user from entering a negative value
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
            console.log("Added " + answer.amountToAdd + " to " + answer.choice);

            let updateQuery = 'UPDATE bamazon.products SET stock_quantity = stock_quantity + ? WHERE product_name = ?';
            connecton.query(updateQuery,[answer.amountToAdd, answer.choice], function (error) {

                if (error) {
                    console.error(error.sqlMessage);
                } 
            })
            
            menuPrompt(); // Go back to main menu when done
        })
    })
 }

// Function to ask the use for the new product details
var newProduct = function () {
    inquirer.prompt([
        {
            type: "input",
            name: "newProductName",
            message: "Enter the name of the new product:"
        },
        {
            type: "input",
            name: "newDeptName",
            message: "Enter the department the new product goes to:"
        },
        {
            type: "input",
            name: "newPrice",
            message: "Enter the price of the new product:"
        },
        {
            type: "input",
            name: "newQuant",
            message: "Enter the quantity ready for sale:"
        },
    ]).then(function (a) {
        
        let newProd = "INSERT INTO bamazon.products(product_name, department_name,price,stock_quantity) VALUES (?,?,?,?)"
        
        connecton.query(newProd, [a.newProductName, a.newDeptName, a.newPrice, a.newQuant], function (error) {
                if (error) {    
                    console.error(error.sqlMessage);            
                }
                else {
                    console.log("\nAdded " + a.newProductName + 
                    " to " + a.newDeptName + 
                    " at a price of " + a.newPrice + 
                    " with " + a.newQuant + 
                    " ready for sale\n");
                }

                menuPrompt(); // Go back to main menu
        })
    })


}