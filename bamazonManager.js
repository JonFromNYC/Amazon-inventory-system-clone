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
//#############################################################################

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
//#############################################################################

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

//             validate: function (value) {

//                 if (value == ('exit')) {
//                     console.clear();
//                     console.log("\n\n\nThe program is now closed.");
//                     process.exit();
//                 }

//                 /* Stop the user from entering a negative value */
//                 if (value <= 0) {
//                     console.log("\nYou must enter a positive integer to add inventory");
//                     console.log("Try again");
//                     return false;
//                 }

//                 // Check to make sure the input is a number
//                 if (isNaN(value) == false) {
//                     return true;
//                 } 
//                 else {
//                     return false;
//                 }
//             }
//         }
//     ]).then(function(answer){
//         console.log("< Added " + answer.quantity + " to [] >");
        
//         /*
//             To make this work you have to query the amount allready in the database
//             for the item you want to update. Then add the value below to it.
//         */
//         connecton.query("", [], function (err,res) {
            
//         })

//         let plusVal = parseInt(answer.quantity);
//         let query = "UPDATE bamazon.products SET stock_quantity = ? WHERE product_name = ?"
        
//         connecton.query(query, [plusVal] ,function (err, res) {
//             console.table(res);
//         })
//         connecton.end();

//     })
 }
//#############################################################################

// Display prompts to the user
var askCustomer = function (res) {
    inquirer.prompt([{
        type: "input",
        name: "choice",
        message: "What would you like to purchase? [Type 'exit' at any time to exit program]",
        validate: function (answer) {
            var pass = answer.toLowerCase();

            if (pass == ('exit')) {
                process.exit();
            }

            for (let j = 0; j < res.length; j++) {
                if (res[j].product_name == pass) {
                    return true;
                }
            }
            return 'Please enter a valid product name';
        }
    }]).then(function (answer) {

        // Loop through product names to see if input has a match in database
        for (let i = 0; i < res.length; i++) {
            if (res[i].product_name.toLowerCase() == answer.choice) {

                var product = answer.choice; // to be  passed into .then()
                var id = i; // to be  passed into .then()

                inquirer.prompt({
                    type: "input",
                    name: "quant",
                    message: "How many would you like to buy?",
                    validate: function (value) {

                        if (value == ('exit')) {
                            console.clear();
                            console.log("The program is now closed.");

                            process.exit();
                        }

                        /*
                            Stop the user from entering a negative value so they can't get 
                            a refund for something they didn't really buy.
                            See "The Everything Store" for reference of how this really happened
                            to Amazon when it first went online.
                        */
                        if (value < 0) {
                            console.log("\nYou're not allowed to add items to the store.");
                            return false;
                        }

                        // Check to make sure the input is a number
                        if (isNaN(value) == false) {
                            return true;
                        } else {
                            return false;
                        }
                    }

                }).then(function (answer) {

                    // Prevent user from buying more than the amount in inventory
                    if ((res[id].stock_quantity - answer.quant) < 0) {
                        console.log("\nSorry - not enough inventory for that purchase.");
                        console.log("_______________________________________________");

                        getTable(); // redisplay the table
                    }

                    // Action to perform when amount purchased is valid
                    if ((res[id].stock_quantity - answer.quant) > 0) {
                        connecton.query("UPDATE products SET stock_quantity='" +
                            (res[id].stock_quantity - answer.quant) +
                            "' WHERE product_name='" +
                            product + "'",
                            function (err, res2) {

                                if (err) {
                                    console.log(err);
                                }

                                // Show when purchase is successful and display the cost
                                console.log("\nPurchase was successful.");
                                console.log("Total: " + (res[id].price * answer.quant + "\n"));
                                getTable(); // redisplay the table
                            })
                    }
                })
            }
        }
    })
} // end of askCustomer