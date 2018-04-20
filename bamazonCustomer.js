//pull in required packages
var mysql = require('mysql');
var inquirer = require("inquirer");
var colors = require('colors');
// var Table = require('cli-table');
//create connection to your database
var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    //username
    user: "root",
    password: "root",
    database: "bamazon_db"
});
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id" + connection.threadId);
    displayItems();
});
//displayItems will take the data from the database and display all the inventory
function displayItems() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        console.log("Existing Inventory:")
        console.log('____________\n');
        //run the items through a for loop to display each item from the table
        var inventory = '';
        for (var i = 0; i < results.length; i++) {
            inventory = '';
            inventory += "Item ID:" + colors.red(results[i].item_id) + '\n';
            inventory += "Product Name:" + colors.yellow(results[i].product_name.toUpperCase()) + '\n';
            inventory += "Department:" + colors.magenta(results[i].department_name.toUpperCase()) + '\n';
            inventory += "Price:" + colors.green(results[i].price) + '\n';
            console.log(inventory);
        }
        console.log("_______________\n")
    });
    //prompt user to make purchase
    promptUser();
};


//prompt user purchase
function promptUser() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "item_id",
                message: "Please enter the Item ID of the product you wish to purchase."
            },
            {
                type: "input",
                name: "quantity",
                message: "Please enter the quantity of the product.",
                //validate input to verify the value entered is a number
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return true;
                }
            },
        ]).then(function (input) {
            console.log("Customer wants to purchase" + colors.red(input.quantity) + "of" + colors.yellow(input.item_id));
            var item = input.item_id;
            var quantity = input.quantity;
            //query to confirm requested item exits in db
            var queryStr = 'SELECT * FROM products WHERE ?';
            connection.query(queryStr, { item_id: item }, function (err, data) {
                if (err) throw err;
                //if user selects invalid Item Id data will be empty
                // console.log("data = " + JSON.stringify(data));

                if (data.length === 0) {
                    console.log("ERROR: Please choose a valid Item Id");
                    displayItems();
                }
                else {
                    var productData = data[0];
                    // console.log('productData = ' + JSON.stringify(productData));
                    // console.log('productData.stock_quantity = ' + productData.stock_quantity);
                    // If the product is in Stock
                    if (quantity <= productData.stock_quantity) {
                        console.log(colors.blue('Congratulations, the product you requested is in stock! Placing order!'));

                        // Construct the updating query string
                        var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE item_id = ' + item;
                        // console.log('updateQueryStr = ' + updateQueryStr);

                        // Update the inventory
                        connection.query(updateQueryStr, function (err, data) {
                            if (err) throw err;

                            console.log('Your order has been placed! Your total is $' + colors.red(productData.price * quantity));
                            console.log(colors.yellow('Thank you for shopping with us!'));
                            console.log("\n---------------------------------------------------------------------\n");

                            // End the database connection
                            connection.end();
                        })
                    } else {
                        console.log('Sorry, there is not enough product in stock, please check back later.');
                        console.log("\n---------------------------------------------------------------------\n");

                        displayInventory();
                    }
                }
            })
        });

};

