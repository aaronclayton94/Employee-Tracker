const inquirer = require("inquirer");
const mysql = require("mysql");
const chalk = require("chalk");
const figlet = require("figlet");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "dank",
  database: "employee_tracker",
});

connection.connect((err) => {
  if (err) {
    console.log(`error connecting`, err.stack);
    return;
  }
  console.log(`Connected throught id ${connection.threadId}`);
});

function starterPrompt() {
  figlet("Employee Tracker", function (err, data) {
    if (err) {
      console.log("Something not working");
      console.dir(err);
      return;
    }
    console.log(chalk.red(data));
  });

  inquirer
    .prompt([
      {
        message: "What would you like to do?",
        type: "list",
        name: "Choice",
        choices: [
          "View Employees",
          "View Employees by Department",
          "View Employees by Role",
          "Add new Employee",
          "Add Role",
          "Add Department",
          "Update Employee",
          "View Roles",
          "View Departments",
          "Exit",
        ],
      },
    ])
    .then((answers) => {
      if (answers.Choice === "View Employees") {
        return viewEmployees();
      } else if (answers.Choice === "View Employees by Department") {
        viewByDept();
      } else if (answers.Choice === "View Employees by Role") {
        viewByRole();
      } else if (answers.Choice === "Add Employee") {
        addEmployee();
      } else if (answers.Choice === "Add Role") {
        addRole();
      } else if (answers.Choice === "Add Department") {
        addDept();
      } else if (answers.Choice === "Update Employees") {
        updateEmloyeeRole();
      } else if (answers.Choice === "View Roles") {
        viewRoles();
      } else if (answers.Choice === "View Departments") {
        viewByDept();
      } else {
        connection.end();
      }
    });
}

function viewEmployees() {
  connection.query(
    `SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name AS department
    FROM employee
    LEFT JOIN role ON employee.role_id = role.role_id
    LEFT JOIN department ON role.department_id = department.department_id;`,
    (err, result) => {
      if (err) throw err;
      console.table(result);
      starterPrompt();
    }
  );
}

function viewByDept() {
  return inquirer
    .prompt([
      {
        message: "Which department would you like to view?",
        type: "list",
        name: "dept",
        choices: ["Engineering", "Management", "Marketing", "Legal", "Sales"],
      },
    ])
    .then((answers) => {
      connection.query(
        `SELECT
            employee.first_name,
            employee.last_name,
            department.name AS Department
        FROM employee
            INNER JOIN role ON employee.role_id=role.role_id
            INNER JOIN department ON employee.role_id=department.department_id
            WHERE department.name='${answers.dept})'`,
        (err, result) => {
          if (err) throw err;
          console.table(result);
        }
      );
    });
}

starterPrompt();
