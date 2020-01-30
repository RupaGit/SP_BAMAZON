var mysql = require("mysql");
var inquirer = require("inquirer");
var user = require("./user");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Deardenis1",
    database: "bamazon"
});

function customerSearchProducts() {
    connection.query("SELECT * FROM departments", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "department",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].department_name);
                        }
                        return choiceArray;
                    },
                    message: "Please select a department"
                }
            ]).then(function (answer) {
                connection.query("SELECT * FROM products where ?",
                    {
                        department_name: answer.department
                    }, function (err, res) {
                        if (err) {
                            console.log("An error occured. Please try again");
                            displayCustomerOptions();
                        }
                        else {
                            console.table(res);
                            displayCustomerOptions();
                        }
                    });
            });
    });
}

function updateDepartments(departmentId, money) {
    connection.query("SELECT * FROM departments where ?",
        {
            department_id: departmentId
        }, function (err, res) {
            if (err) throw err;
            console.log(res[0].product_sales , money);
            connection.query("UPDATE departments SET ? WHERE ?",
                [
                    {
                        product_sales: res[0].product_sales + money
                    },
                    {
                        department_id: departmentId
                    }
                ],
                function (err) {
                    if (err) throw err;
                    displayCustomerOptions();
                }
            )
        });
}

function updateProductTable(productId, qty) {
    connection.query("SELECT * FROM products where ?",
        {
            item_id: productId
        }, function (err, res) {
            if (err) throw err;
            // {
            //     console.log("An error occured. Please start again");
            //     displayCustomerOptions();
            // }
            else if (res[0].stock_quantity < qty) {
                console.log("Sorry Insufficient Quantity", res[0].stock_quantity);
                displayCustomerOptions();
            }
            else {
                connection.query("UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: res[0].stock_quantity - qty,
                            product_sales: res[0].product_sales + qty * res[0].price
                        },
                        {
                            item_id: productId
                        }
                    ],
                    function (err) {
                        if (err) throw err;
                        var moneyMade = qty * res[0].price;
                        console.log("Successfully purchased the product");
                        updateDepartments(res[0].department_id, moneyMade);
                    }
                )
            }
        });

}

function customerBuyProducts() {
    connection.query("SELECT * FROM departments", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "department",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].department_name);
                        }
                        return choiceArray;
                    },
                    message: "Please select a department"
                }
            ]).then(function (answer) {
                connection.query("SELECT * FROM products where ?",
                    {
                        department_name: answer.department
                    }, function (err, res) {
                        if (err) throw err;
                        else {
                            console.table(res);
                            inquirer
                                .prompt([
                                    {
                                        name: "productId",
                                        type: "input",
                                        message: "Please select a Product ID to buy"
                                    },
                                    {
                                        name: "qty",
                                        type: "input",
                                        message: "Please enter the no.of items you want to buy"
                                    }

                                ]).then(function (productAnswer) {
                                    // var qty = parseInt(productAnswer.qty);
                                    // var productId = parseInt(productAnswer.productId);
                                    updateProductTable(productAnswer.productId, productAnswer.qty);
                                    // displayCustomerOptions();
                                });
                        }
                    });

            });
    });
}

function userQuit() {
    connection.end();
}

function displayCustomerOptions() {
    inquirer
        .prompt({
            name: "customerChoices",
            type: "list",
            message: "Hello Customer! Welcome... Please select any option below ",
            choices: ["VIEW PRODUCTS", "BUY A PRODUCT", "EXIT"]
        })
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            switch (answer.customerChoices) {
                case "VIEW PRODUCTS": {
                    customerSearchProducts();
                    break;
                }
                case "BUY A PRODUCT": {
                    customerBuyProducts();
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
    displayCustomerOptions
};
