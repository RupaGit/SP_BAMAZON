// var inquirer = require("inquirer");
// var customer = require("./bAmazonCustomer");
// var manager = require("./bAmazonManager");
// var bigBoss = require("./bAmazonBigBoss");

// function userQuit() {
//     connection.end();
// }

// function selectUserType() {
//     inquirer
//         .prompt({
//             name: "userType",
//             type: "list",
//             message: "Who would you like to enter my application as? ",
//             choices: ["CUSTOMER", "MANAGER", "BIG BOSS", "QUIT"]
//         })
//         .then(function (answer) {
//             // based on their answer, either call the bid or the post functions
//             switch (answer.userType) {
//                 case "CUSTOMER": {
//                     customer.displayCustomerOptions();
//                     break;
//                 }
//                 case "MANAGER": {
//                     manager.displayManagerOptions();
//                     break;
//                 }
//                 case "BIG BOSS": {
//                     bigBoss.displayBigBossOptions();
//                     break;
//                 }
//                 case "QUIT": {
//                     userQuit();
//                     break;
//                 }
//             }
//         });
// }

// selectUserType();

// module.exports = {
//     selectUserType
// };