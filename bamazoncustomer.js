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
})

// Start a connection
connecton.connect(function (error) {
    if (error) {
        throw error;
    }

    console.log("Successfully connected to the Bamazon Store");
    getTable();
});

// get the table and show it to a customer
var getTable = function () {
    connecton.query("SELECT * FROM products", function (err, res) {
        for (let i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " " +
                res[i].product_name + "\t| " +
                res[i].department_name + "\t | " +
                res[i].price + "\t | " +
                res[i].stock_quantity + "\n");
        }

        askCustomer(res);
    })
}

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