DROP DATABASE IF EXISTS trackEmployeeDB;
CREATE database trackEmployeeDB;

USE trackEmployeeDB;

CREATE TABLE department (
  ID INT NOT NULL AUTO_INCREMENT,
  dept_name VARCHAR(30) NULL,
  PRIMARY KEY (ID)
);

CREATE TABLE role (
  ID INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NULL,
  salary DECIMAL(10,2) NULL,
  department_id INT NULL,
  PRIMARY KEY (ID)
);

CREATE TABLE employee (
  ID INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NULL,
  last_name VARCHAR(30) NULL,
  role_id INT NULL,
  manager_id INT NULL,
  PRIMARY KEY (ID)
);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;
