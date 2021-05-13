const mysql = require("mysql");
const inquirer = require("inquirer");
const conTable = require("console.table");
const util = require("util");

const connection = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: "root",
  // Be sure to update with your own MySQL password!
  password: "Quigley!e",
  database: "trackEmployeeDB",
});

connection.connect((err) => {
  if (err) throw err;
  runSearch();
});

const runSearch = () => {
  inquirer
    .prompt({
      name: "menu",
      type: "list",
      message: "Please choose an option below",
      choices: [
        "View Departments",
        "View Roles",
        "View Employees",
        "Add Department",
        "Add Role",
        "Add Employee",
        "Update Employee Role",

        // 'Update Employee Manager',
        // 'View Employees by Manager',
        // 'Delete Department',
        // 'Delete Role',
        // 'Delete Employee',
        // 'View Total Utilized Budget of a Department',
      ],
    })
    .then((answer) => {
      switch (answer.menu) {
        case "View Departments":
          viewDept();
          break;

        case "View Roles":
          viewRole();
          break;

        case "View Employees":
          viewEmployee();
          break;

        case "Add Department":
          addDept();
          break;

        case "Add Role":
          addRole();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Update Employee Role":
          updateRole();
          break;

        default:
          console.log(`Invalid action: ${answer.menu}`);
          connection.end();
          break;
      }
    });
};

// viewDept();

// viewRole();

// viewEmployee();

const addDept = () => {
  inquirer
    .prompt({
      name: 'addDept',
      type: 'input',
      message: 'What is the name of the Department you would like to add?',
    })
    .then((answer) => {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        'INSERT INTO department SET ?',
        
        {
          dept_name: answer.addDept,
          
        },
        (err) => {
          if (err) throw err;
          console.log('Your auction was created successfully!');
          // re-prompt the user for if they want to bid or post
          runSearch();
        }
      );
    });
};

// addRole();

// addEmployee();

// updateRole();
