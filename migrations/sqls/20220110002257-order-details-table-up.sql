/* Replace with your SQL commands */
create table order_details (
  id serial primary key,
  product_id bigint references products(id) not null,
  quantity integer,
  order_id bigint references orders(id) not null
);