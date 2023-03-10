## API Endpoints
#### Products
- Create [token] : `'/products/create' [POST]`
- Index: `'/products' [GET]`
- Show: `'/products/:id' [GET]`
- Update: [token] : `'/products/update' [PATCH]`
- Destroy: [token] : `'/products/delete/:id' [DELETE]`

#### Users
- Create: `'/users/create' [POST]`
- Index: [token] : `'/users' [GET]`
- Show: [token] : `'/users/:id' [GET]`
- Update: [token]: `'/users/update' [PATCH]`
- Delete: [token]: `'/users/destroy/:id' [DELETE]`
- Authenticate: [token]: `'/users/auth' [POST]`
#### Orders
- Create: [token] :`'/orders/create' [POST]`
- Index: [token] : `'/orders' [GET]`
- Show: [token] : `'/orders/:id' [GET]`
- Update: [token]: `'/orders/:id' [PATCH]`
- Destroy: [token]: `'/orders/:id' [DELETE]`
#### Order Details
- Create: [token] :`'/order-details/create' [POST]`
- Show: [token] : `'/order-details/usr/:id' [GET]`

## Data Base Schema
#### Products

| Column        | Type               |
| --------------|--------------------|
| id            | SERIAL PRIMARY KEY |
| name          | VARCHAR            |
| price         | INTEGER            |
| category      | VARCHAR            |

#### Users

| Column         | Type               |
| ---------------|--------------------|
| id             | SERIAL PRIMARY KEY |
| user_name      | VARCHAR 
| first_name     | VARCHAR            |
| last_name      | VARCHAR            |
| password       | VARCHAR            |

#### Orders

| Column         | Type                            | 
| ---------------|---------------------------------|
| id             | SERIAL PRIMARY KEY              |
| status         | VARCHAR                         |
| user_id        | FOREIGN REFERENCES USERS        |


As many orders can have many products and vice versa,
here we need a **many2many** table between both tables. 

##### Order_details

| Column        | Type                           |
|---------------|:-------------------------------|
| id            | SERIAL PRIMARY KEY             |
| product_id    | FOREIGN KEY REFERENCES PRODUCTS|
| quantity      | INTEGER                        |
| order_id      | FOREIGN KEY REFERENCES ORDERS  |
