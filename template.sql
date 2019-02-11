drop database if exists bamazon;

create database bamazon;

use bamazon;

create table products
(
	item_id integer(10) auto_increment,
    product_name varchar(45) NOT NULL,
    department_name varchar(45) NOT NULL,
    price decimal(10,2) NOT NULL,
    stock_quantity integer(10),
    primary key (item_id)
);

insert into products (product_name, department_name, price, stock_quantity)
values("paper cups", "Supplies",6.82,90),
("egg whites", "Food/Produce",1.99,11),
("fake hair", "Cosmetics",8.02,5),
("tin foil", "Kitchen",1.03,3),
("white chalk", "Supplies",1.95,679),
("basketball", "Games/Hobby",9.99,1184),
("chess set", "Games/Hobby",9.99,10),
("oat meal", "Food/Grain",3.99,1),
("pencils", "Supplies",0.19,500),
("markers", "Supplies",0.19,500);

