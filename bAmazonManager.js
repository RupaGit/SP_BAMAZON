var mysql = require("mysql");
var inquirer = require("inquirer");
var user = require("./user");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

function managerSearchProducts() {
    connection.query("SELECT * FROM products",
         function (err, res) {
            if (err) {
                console.log("An error occured. Please try again");
                displayManagerOptions();
            }
            else {
                console.table(res);
                displayManagerOptions();
            }
        });
}

function viewLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 10",
        function (err, res) {
            if (err) throw err;
            // console.log(res);
            // const transformed = res.reduce((acc, {myId, ...x}) => { acc[myId] = x; return acc}, {})
            console.log("\n");
            console.table(res);
        });
    displayManagerOptions();
}
function addToInventory() {
    var itemId = 0;
    var qty = 0;
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        // once you have the items, prompt the user for which they'd like to bid on
        inquirer
            .prompt([
                {
                    name: "productId",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].item_id);
                        }
                        return choiceArray;
                    },
                    message: "Please select an item"
                },
                {
                    name: "qty",
                    type: "input",
                    message: "Please enter the quantity to add",
                }
            ]).then(function (answer) {
                itemId = parseInt(answer.productId);
                qty = parseInt(answer.qty);
                connection.query("SELECT * FROM products where item_id= ?",
                    [
                        itemId
                    ], function (err, res) {
                        if (err) throw err;
                        else {
                            connection.query("UPDATE products SET ? WHERE ?",
                                [
                                    { stock_quantity: res[0].stock_quantity + qty },
                                    { item_id: itemId }
                                ],
                                function (err, res) {
                                    if (err) throw err;
                                    console.log("Quantity updated successfully");
                                    displayManagerOptions();
                                });
                        }
                    });
            });
    });
}

function addnewProduct() {
    connection.query("SELECT * FROM departments", function (err, results) {
        if (err) throw err;
        // once you have the items, prompt the user for which they'd like to bid on
        inquirer
            .prompt([
                {
                    name: "product",
                    type: "input",
                    message: "Please enter the product name"
                },
                {
                    name: "dpt",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].department_name);
                        }
                        return choiceArray;
                    },
                    message: "Please select the department"
                },
                {
                    name: "price",
                    type: "input",
                    message: "Please enter the price",
                },
                {
                    name: "qty",
                    type: "input",
                    message: "Please enter the quantity",
                }
            ]).then(function (answer) {
                console.log((parseFloat(answer.price)));
                connection.query("SELECT department_id FROM departments where?",
                    {
                        department_name: answer.dpt
                    }, function (err, departmentVal) {
                        if (err) throw err;
                        connection.query("INSERT INTO products SET ?",
                            {
                                product_name: answer.product,
                                department_name: answer.dpt,
                                price: parseFloat(answer.price),
                                stock_quantity: parseInt(answer.qty),
                                department_id: departmentVal[0].department_id
                            },
                            function (err, res) {
                                if (err) throw err;
                                console.log("Product added successfully");
                                displayManagerOptions();
                            });
                    });
            });
    });
}
function userQuit() {
    connection.end();
}



function displayManagerOptions() {
    inquirer
        .prompt({
            name: "managerChoices",
            type: "list",
            message: "Hello Manager! Welcome... Please select any option below ",
            choices: ["VIEW PRODUCTS", "VIEW LOW INVENTORY", "ADD TO INVENTORY", "ADD NEW PRODUCT", "EXIT"]
        })
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            switch (answer.managerChoices) {
                case "VIEW PRODUCTS": {
                    managerSearchProducts();
                    break;
                }
                case "VIEW LOW INVENTORY": {
                    viewLowInventory();
                    break;
                }
                case "ADD TO INVENTORY": {
                    addToInventory();
                    break;
                }
                case "ADD NEW PRODUCT": {
                    addnewProduct();
                    break;
                }
                case "EXIT": {
                    userQuit();
                    break;
                }
            }
        });
}

module.exports = {
    displayManagerOptions
};
