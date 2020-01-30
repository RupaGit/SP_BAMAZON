CREATE DATABASE bamazon;

use bamazon;

create table products (
item_id integer not null auto_increment,
product_name varchar(20),
department_name varchar(20),
price decimal (4,2),
stock_quantity integer,
constraint products_pk primary key(item_id));

ALTER TABLE Products 
modify department_name varchar(30);

create table departments (
department_id integer not null auto_increment,
department_name varchar(20),
over_head_costs integer, 
constraint departments_pk primary key(department_id));

select * from departments;

select * from products;

ALTER TABLE products 
add column department_id integer NOT NULL;

INSERT INTO products (product_name, department_name, price, stock_quantity, department_id)
values("TESTP1", "Toys", 12.99,100, (SELECT department_id from departments where department_name = 'Toys'));

ALTER TABLE products
ADD CONSTRAINT products_fk FOREIGN KEY (department_id) REFERENCES departments(department_id);

INSERT INTO departments (department_name, over_head_costs)
VALUES ('Video Games' , 900);

UPDATE products 
SET department_id = 6
WHERE department_name LIKE 'Video Games';

ALTER TABLE departments 
ADD COLUMN product_sales decimal (5,2);

ALTER TABLE products  add column product_sales  decimal (6,2);

ALTER TABLE departments 
MODIFY product_sales decimal(40,2);

DESC Products;
DESC departments;
