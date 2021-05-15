const mysql = require("mysql");
const inquirer = require("inquirer");
const conTable = require("console.table");
const util = require("util");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Quigley!e",
  database: "trackEmployeeDB",
});

connection.connect((err) => {
  if (err) throw err;
  runSearch();
});

const query = util.promisify(connection.query).bind(connection);

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
        "View Employees by Manager",
        "Add Department",
        "Add Role",
        "Add Employee",
        "Update Employee Role"
        // 'Update Employee Manager',
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

        case "View Employees by Manager":
          viewManager();
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

const viewDept = async () => {
  const deptTable = await query(
    `SELECT 
    e.id AS 'Employee ID',
    e.first_name AS 'First Name',
    e.last_name AS 'Last Name',
    department.dept_name AS 'Department',
    emp_role.title AS 'Title',
    emp_role.salary AS 'Salary',
CONCAT(m.first_name, ' ', m.last_name) AS Manager
FROM
trackEmployeeDB.employee AS e
  INNER JOIN
emp_role ON (e.role_id = emp_role.ID)
  INNER JOIN
department ON (emp_role.dept_id = department.ID)
  LEFT JOIN
  trackEmployeeDB.employee m ON e.manager_id = m.id
    ORDER BY department.dept_name;`
  );
  console.table(deptTable);
  runSearch();
};

const viewRole = async () => {
  const roleTable = await query(
    `SELECT 
    e.id AS 'Employee ID',
    e.first_name AS 'First Name',
    e.last_name AS 'Last Name',
    department.dept_name AS 'Department',
    emp_role.title AS 'Title',
    emp_role.salary AS 'Salary',
CONCAT(m.first_name, ' ', m.last_name) AS Manager
FROM
trackEmployeeDB.employee AS e
  INNER JOIN
emp_role ON (e.role_id = emp_role.ID)
  INNER JOIN
department ON (emp_role.dept_id = department.ID)
  LEFT JOIN
  trackEmployeeDB.employee m ON e.manager_id = m.id
    ORDER BY emp_role.title;`
  );
  console.table(roleTable);
  runSearch();
};

const viewEmployee = async () => {
  const empTable = await query(
    `SELECT 
    e.id AS 'Employee ID',
    e.first_name AS 'First Name',
    e.last_name AS 'Last Name',
    department.dept_name AS 'Department',
    emp_role.title AS 'Title',
    emp_role.salary AS 'Salary',
CONCAT(m.first_name, ' ', m.last_name) AS Manager
FROM
trackEmployeeDB.employee AS e
  INNER JOIN
emp_role ON (e.role_id = emp_role.ID)
  INNER JOIN
department ON (emp_role.dept_id = department.ID)
  LEFT JOIN
  trackEmployeeDB.employee m ON e.manager_id = m.id`
  );
  console.table(empTable);
  runSearch();
};

const viewManager = async () => {
  const roleTable = await query(
    `SELECT 
    e.id AS 'Employee ID',
    e.first_name AS 'First Name',
    e.last_name AS 'Last Name',
    department.dept_name AS 'Department',
    emp_role.title AS 'Title',
    emp_role.salary AS 'Salary',
CONCAT(m.first_name, ' ', m.last_name) AS Manager
FROM
trackEmployeeDB.employee AS e
  INNER JOIN
emp_role ON (e.role_id = emp_role.ID)
  INNER JOIN
department ON (emp_role.dept_id = department.ID)
  LEFT JOIN
  trackEmployeeDB.employee m ON e.manager_id = m.id
    ORDER BY e.manager_id;`
  );
  console.table(roleTable);
  runSearch();
};


const addDept = () => {
  inquirer
    .prompt({
      name: "addDept",
      type: "input",
      message: "What is the name of the Department you would like to add?",
    })
    .then((answer) => {
      connection.query(
        "INSERT INTO department SET ?",
        {
          dept_name: answer.addDept,
        },
        (err) => {
          if (err) throw err;
          console.log("Your Department was added successfully!");
          runSearch();
        }
      );
    });
};

const addRole = () => {
  inquirer
    .prompt([
      {
        name: "roleTitle",
        type: "input",
        message: "What is the name of the Role you would like to add?",
      },
      {
        name: "roleSalary",
        type: "input",
        message: "What is the salary you would like for this role?",
      },
      {
        name: "roleDeptID",
        type: "input",
        message: "What is the Department ID for this role?",
      },
    ])
    .then((answer) => {
      connection.query(
        "INSERT INTO emp_role SET ?",
        {
          title: answer.roleTitle,
          salary: answer.roleSalary,
          department_id: answer.roleDeptID,
        },
        (err) => {
          if (err) throw err;
          console.log("Your Role was added successfully!");
          runSearch();
        }
      );
    });
};

const addEmployee = () => {
  inquirer
    .prompt([
      {
        name: "empFirst",
        type: "input",
        message:
          "What is the first name of the employee you would like to add?",
      },
      {
        name: "empLast",
        type: "input",
        message: "What is the last name of the employee you would like to add?",
      },
      {
        name: "roleID",
        type: "input",
        message: "What is this employee's role ID?",
      },
      {
        name: "managerID",
        type: "input",
        message: "What is the ID of this employee's manager?",
      },
    ])
    .then((answer) => {
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.empFirst,
          last_name: answer.empLast,
          role_id: answer.roleID,
          manager_id: answer.managerID,
        },
        (err) => {
          if (err) throw err;
          console.log("Your Employee was added successfully!");
          runSearch();
        }
      );
    });
};

// const updateRole = () => {
//   connection.query("SELECT * FROM employee", (err, res) => {
//     if (err) throw err;
//     // res.forEach(({ID, title, salary, dept_id }) => {
//     //   console.log(`${ID} | ${title} | ${salary} | ${dept_id}`);
//     // });
//     // console.log('-----------------------------------');
//     inquirer
//       .prompt({
//         name: "emp_list",
//         type: "list",
//         message: "Select the employee whose role you would like to update.",
//         choices() {
//           const employeeArray = [];
//           res.forEach(({ first_name, last_name, role_id }) => {
//             employeeArray.push(first_name + " " + last_name);
//           });
//           return employeeArray;
//         },
//       })
//       .then((answer) => {
//         console.log(answer.emp_list + "'s current role ID is" + answer.role_id);
//       });
//   });
// };

// ///TESTING AREA BELOW

// const updateRole = () => {
//   let query =
//     "SELECT department.ID, department.dept_name, employee.first_name, employee.last_name, employee.role_id, employee.ID ";
//   query += "FROM department INNER JOIN employee ON (department.ID";
//   connection.query("SELECT * FROM employee", (err, res) => {
//     if (err) throw err;
//     inquirer
//       .prompt({
//         name: "emp_list",
//         type: "list",
//         message: "Select the employee whose role you would like to update.",
//         choices() {
//           const employeeArray = [];
//           res.forEach(({ first_name, last_name, role_id }) => {
//             employeeArray.push(first_name + " " + last_name);
//           });
//           return employeeArray;
//         },
//       })
//       .then((answer) => {
//         console.log(answer.emp_list + "'s current role ID is" + answer.role_id);
//       });
//   });
// };

// const bidAuction = () => {
//   // query the database for all items being auctioned
//   connection.query("SELECT * FROM auctions", (err, results) => {
//     if (err) throw err;
//     // once you have the items, prompt the user for which they'd like to bid on
//     inquirer
//       .prompt([
//         {
//           name: "choice",
//           type: "rawlist",
//           choices() {
//             const choiceArray = [];
//             results.forEach(({ item_name }) => {
//               choiceArray.push(item_name);
//             });
//             return choiceArray;
//           },
//           message: "What auction would you like to place a bid in?",
//         },
//         {
//           name: "bid",
//           type: "input",
//           message: "How much would you like to bid?",
//         },
//       ])
//       .then((answer) => {
//         // get the information of the chosen item
//         let chosenItem;
//         results.forEach((item) => {
//           if (item.item_name === answer.choice) {
//             chosenItem = item;
//           }
//         });

//         // determine if bid was high enough
//         if (chosenItem.highest_bid < parseInt(answer.bid)) {
//           // bid was high enough, so update db, let the user know, and start over
//           connection.query(
//             "UPDATE auctions SET ? WHERE ?",
//             [
//               {
//                 highest_bid: answer.bid,
//               },
//               {
//                 id: chosenItem.id,
//               },
//             ],
//             (error) => {
//               if (error) throw err;
//               console.log("Bid placed successfully!");
//               start();
//             }
//           );
//         } else {
//           // bid wasn't high enough, so apologize and start over
//           console.log("Your bid was too low. Try again...");
//           start();
//         }
//       });
//   });
// };
