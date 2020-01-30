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

function bigBossViewSales() {
    connection.query("SELECT * FROM departments", function (err, results) {
        if (err) throw err;
        // once you have the items, prompt the user for which they'd like to bid on
        inquirer
            .prompt([
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
                }
            ]).then(function (answer) {
                connection.query("SELECT *, product_sales - over_head_costs as total_profit FROM departments where?",
                    {
                        department_name: answer.dpt
                    }, function (err, departmentVal) {
                        if (err) throw err;
                        console.table(departmentVal);
                        displayBigBossOptions();
                    });
            });
    });
}



function bigBossAddDepartment() {
    inquirer
        .prompt([
            {
                name: "departmentName",
                type: "input",
                message: "Please enter the new Department Name"
            },
            {
                name: "overHeadCosts",
                type: "input",
                message: "Please enter over head costs (Must be a number)"
            }
        ]).then(function (answer) {
            connection.query("INSERT INTO departments SET ?",
                {
                    department_name: answer.departmentName,
                    over_head_costs: answer.overHeadCosts
                },
                function (err, res) {
                    if (err) throw err;
                    console.log("Department added successfully");
                    displayBigBossOptions();
                });
        });
}
function userQuit() {
    connection.end();
}

function displayBigBossOptions() {
    inquirer
        .prompt({
            name: "managerChoices",
            type: "list",
            message: "Hello Big Boss! Welcome... Please select any option below ",
            choices: ["VIEW DEPARTMENT STATS", "ADD A NEW DEPARTMENT", "EXIT"]
        })
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            switch (answer.managerChoices) {
                case "VIEW DEPARTMENT STATS": {
                    bigBossViewSales();
                    break;
                }
                case "ADD A NEW DEPARTMENT": {
                    bigBossAddDepartment();
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
    displayBigBossOptions
};