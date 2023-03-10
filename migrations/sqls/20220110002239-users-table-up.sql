/* Replace with your SQL commands */
CREATE TABLE users (
  id serial primary key ,
  user_name varchar(111) NOT NULL,
  first_name varchar(111),
  last_name varchar(111),
  password varchar(255) not null
);
