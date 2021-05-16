const mysql = require("mysql");
const inquirer = require("inquirer");
const conTable = require("console.table");
const util = require("util");
const { type } = require("os");
const { listenerCount } = require("events");

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

// main menu
const runSearch = () => {
  inquirer
    .prompt({
      name: "menu",
      type: "list",
      message: "Please choose an option below",
      choices: [
        "View Employees",
        "View Employees by Manager",
        "View Departments",
        "View Roles",
        "Add Employee",
        "Add Department",
        "Add Role",
        "Update Employee Role",
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

// displays existing departments
const viewDept = () => {
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    res.forEach(({ID, dept_name }) => {
      console.log(`${ID} | ${dept_name}`);
    });
    console.log('-----------------------------------');
    runSearch();
  });
};
// displays existing roles
const viewRole = () => {
  connection.query('SELECT * FROM emp_role', (err, res) => {
    if (err) throw err;
    res.forEach(({ID, title, salary, dept_id }) => {
      console.log(`${ID} | ${title} | ${salary} | ${dept_id}`);
    });
    console.log('-----------------------------------');
    runSearch();
  });
};

// displays table of all employees
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

// displays table by order of manager ID
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

// function to add new department
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

// function to add new role
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
          dept_id: answer.roleDeptID,
        },
        (err) => {
          if (err) throw err;
          console.log("Your Role was added successfully!");
          runSearch();
        }
      );
    });
};

// function to add new employee
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

// function to update role of existing employees
const updateRole = () => {
  inquirer
    .prompt([
      {
        name: "employee",
        type: "list",
        message: "Select the employee whose role you would like to update.",
        choices: () => employeeList(),
      },
      {
        name: "role",
        type: "list",
        message: "Select the role you would like this employee to update to.",
        choices: () => roleList(),
      },
    ])
    .then(async function (res) {
      const empArray = res.employee.split(" ");
      const empFirst = empArray[0];
      const empLast = empArray[1];
      const newRole = res.role;

      const updatedRole = await query("SELECT ID FROM emp_role WHERE ?", {
        title: newRole,
      });

      const empID = await query("SELECT ID FROM employee WHERE ? AND ?", [
        { first_name: empFirst },
        { last_name: empLast },
      ]);

      await query("UPDATE employee SET ? WHERE ?", [
        {
          role_id: updatedRole[0].ID,
        },
        {
          id: empID[0].ID,
        },
      ]);

      console.log("Updated employee role successfully!");
      runSearch();
    });
};

const employeeList = async () => {
  let employees;
  employees = await query("SELECT * FROM employee");
  const empName = employees.map((employee) => {
    return `${employee.first_name} ${employee.last_name}`;
  });
  return empName;
};

const roleList = async () => {
  let roles;
  roles = await query("SELECT * FROM emp_role");
  const roleTitle = roles.map((position) => {
    return `${position.title}`;
  });
  return roleTitle;
};
