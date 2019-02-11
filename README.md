# Bamazon
"Bamazon" is an Amazon-like store front using Node.js &amp; MySQL through a command line interface. The customer types in the item and quantity they want to complete a transaction.

## Requirements for this program
___
### MySQL & MySQL Workbench
You will need MySQL installed and ready to run on your local machine. Use the `template.sql` as a template once MySQL is ready to run. If you need help installing MySQL on your local machine check out the installation guide here: [MySQL Workbench Installation](https://dev.mysql.com/downloads/workbench/)

### Node JS
Have Node JS installed on your machine. [Node JS Installation](https://nodejs.org/en/)

# How it works

First, clone this repository into your local machine via the command line. Type this into the command line:


    git clone git@github.com:JonFromNYC/Bamazon.git

    cd Bamazon

    npm install

After you have executed `npm install` Node Packages will install that will allow you to execute the program on your local machine.
To use the customer view, type this into to the command line:

    node bamazonCustomer.js

## Bamazon Customer View
___
From the command line, enter the product you want and the quantity.

![customer](/images/customer.gif)

---

To execute the manager view, enter this into the command line:

    node bamazonManager.js

## Bamazon Manager View
___
The manager can see all available items, add inventory, see what items have a specific quantity, and add new items.

Watch the preview below for a demonstration of all the options.

![manager](/images/manager.gif)
