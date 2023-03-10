/* Replace with your SQL commands */
create table orders (
  id serial primary key ,
  status varchar(50),
  user_id bigint references users(id) not null
);