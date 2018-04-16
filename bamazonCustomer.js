//pull in required packages
var mysql = require('mysql');
var inquire = require('inquirer');
var color = require('color');
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
            inventory += "Item ID:" + results[i].item_id + '\n';
            inventory += "Product Name:" + results[i].product_name + '\n';
            inventory += "Department:" + results[i].department_name + '\n';
            inventory += "Price:" + results[i].price + '\n';
            console.log(inventory);
        }
        console.log("_______________\n")
    });
};
//validate input to make sure user is putting in whole numbers
function validateInput() {

}

//prompt user purchase
function promptUser() {
    inquirer.prompt([

    ])
}