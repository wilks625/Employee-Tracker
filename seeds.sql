USE trackEmployeeDB;

INSERT INTO department (dept_name)
VALUES ("Sales"), ("Human Resources"), ("Marketing"), ("Research & Development");

INSERT INTO emp_role (title, salary, dept_id)
VALUES 
("Manager", 105000, 1), 
("Architect", 100000, 4), 
("Senior Developer", 85000, 4), 
("Junior Developer", 65000, 4), 
("Intern", 25000, 4),
("Salesman", 45000, 1),
("HR", 60000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
("Stephen", "Krause", 2, 3),
("Seth", "Smith", 3 , 2),
("Casey", "Jobran", 4 , 1),
("Alex", "Lee", 5 , 1),
("Scott", "Doyle", 1, 1),
("Steve", "Johnson", 7, 2),
("Stacy", "Reeves", 6, 1);