DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
-- --create a numberic column which auto increaments ans cannot be null--
item_id INT NOT NULL AUTO_INCREMENT,

product_name VARCHAR (10),

department_name VARCHAR (10),

price INTEGER (10),

stock_quantity INTEGER (20),

PRIMARY KEY (item_id)

);

INSERT INTO products (product_name, department_name, price, stock_quantity)

VALUES("charger","Electronics",25,40),("pen","stationery",2,50), ("chair","furniture",30,10),("t-shirt","clothing",10,50),("jeans","clothing",30,100);

SELECT * FROM products;