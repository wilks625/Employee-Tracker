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
const viewDept = () => {
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    res.forEach(({ID, dept_name }) => {
      console.log(`${ID} | ${dept_name}`);
    });
    console.log('-----------------------------------');
  });
};

// viewRole();
const viewRole = () => {
  connection.query('SELECT * FROM emp_role', (err, res) => {
    if (err) throw err;
    res.forEach(({ID, title, salary, department_id }) => {
      console.log(`${ID} | ${title} | ${salary} | ${department_id}`);
    });
    console.log('-----------------------------------');
  });
};


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
          console.log('Your Department was added successfully!');
          // re-prompt the user for if they want to bid or post
          runSearch();
        }
      );
    });
};

const addRole = () => {
  inquirer
    .prompt([
       {
      name: 'roleTitle',
      type: 'input',
      message: 'What is the name of the Role you would like to add?'
    },
    {
      name: 'roleSalary',
      type: 'input',
      message: 'What is the salary you would like for this role?'
    },
    {
      name: 'roleDeptID',
      type: 'input',
      message: 'What is the Department ID for this role?'
    },
  ])
    .then((answer) => {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        'INSERT INTO emp_role SET ?',
        {
          title: answer.roleTitle,
          salary: answer.roleSalary,
          department_id: answer.roleDeptID
        },
        (err) => {
          if (err) throw err;
          console.log('Your Role was added successfully!');
          // re-prompt the user for if they want to bid or post
          runSearch();
        }
      );
    });
};

// THIS IS WHERE YOU LEFT OFF 
const addEmployee = () => {
  inquirer
    .prompt([
       {
      name: 'empFirst',
      type: 'input',
      message: 'What is the first name of the employee you would like to add?'
    },
    {
      name: 'empLast',
      type: 'input',
      message: 'What is the last name of the employee you would like to add?'
    },
    {
      name: 'roleID',
      type: 'input',
      message: "What is this employee's role ID?"
    },
    {
      name: 'managerID',
      type: 'input',
      message: "What is the ID of this employee's manager?"
    },
  ])
    .then((answer) => {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        'INSERT INTO employee SET ?',
        {
          first_name: answer.empFirst,
          last_name: answer.empLast,
          role_id: answer.roleID,
          manager_id: answer.managerID
        },
        (err) => {
          if (err) throw err;
          console.log('Your Employee was added successfully!');
          // re-prompt the user for if they want to bid or post
          runSearch();
        }
      );
    });
};

// updateRole();
