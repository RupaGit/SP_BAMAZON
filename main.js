var mysql = require("mysql");
var inquirer = require("inquirer");
var customer = require("./bAmazonCustomer");
var manager = require("./bAmazonManager");
var bigBoss = require("./bAmazonBigBoss");


var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon"
});

function userQuit() {
    connection.end();
}

function selectUserType() {
    inquirer
        .prompt({
            name: "userType",
            type: "list",
            message: "Who would you like to enter my application as? ",
            choices: ["CUSTOMER", "MANAGER", "BIG BOSS", "EXIT"]
        })
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            switch (answer.userType) {
                case "CUSTOMER": {
                    customer.displayCustomerOptions();
                    break;
                }
                case "MANAGER": {
                    manager.displayManagerOptions();
                    break;
                }
                case "BIG BOSS": {
                    bigBoss.displayBigBossOptions();
                    break;
                }
                case "EXIT": {
                    userQuit();
                    break;
                }
            }
        });
}

selectUserType();

module.exports = {
    selectUserType
};