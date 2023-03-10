import client from '../database';
import { Order } from '../types';
import { formatOrder } from '../utils/formats';

export class OrderModel {
    async createOrder(ord: {
        user_id: number | undefined;
        status: string;
    }): Promise<Order> {
        try {
            const connection = await client.connect();
            const result = await connection.query(
                'insert into orders (status,user_id) values ($1, $2) returning *;',
                [ord.status, ord.user_id]
            );
            const orderItem = result.rows[0];
            // console.log('ORDER ITEM--------------------------------->>>>>>>>>>>>>>>>>>>>>>', orderItem)
            // console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
            connection.release();
            return {
                id: orderItem.id,
                status: orderItem.status,
                user_id: orderItem.user_id
            };
        } catch (e) {
            throw new Error(`Failed when creating an order: ${e}`);
        }
    }
    async index(): Promise<Order[]> {
        try {
            const connection = await client.connect();
            const result = await connection.query(
                "select o.id as id, o.status, u.user_name, JSON_AGG(JSONB_BUILD_OBJECT('product_id', p.id, 'name', p.name, 'price', p.price, 'category', p.category, 'quantity', od.quantity)) as products, o.status as status from orders as o left join order_details as od on o.id = od.order_id left join products as p on od.product_id = p.id left join users as u on u.id = o.user_id group by o.id, u.user_name, o.status;"
            );
            connection.release();
            return result.rows.map((ord) =>
                formatOrder(ord.id, ord.status, ord.user_id)
            );
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async show(id: number): Promise<Order | undefined> {
        try {
            const connection = await client.connect();
            const result = await connection.query(
                "select o.id as id, u.user_name, o.user_id, JSON_AGG(JSONB_BUILD_OBJECT('product_id', p.id, 'name', p.name, 'price', p.price, 'quantity', od.quantity)) as products, o.status as status from orders as o left join order_details as od on o.id = od.product_id left join products as p on od.product_id = p.id left join users as u on u.id = o.user_id where o.id = $1 group by o.id, u.user_name, o.status, o.user_id;",
                [id]
            );
            connection.release();
            return result.rows[0];
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async update(ord: Order): Promise<Order> {
        try {
            const connection = await client.connect();
            const result = await connection.query(
                'update orders set status=$1, user_id=$2 where id=$3 returning *;',
                [ord.status, ord.user_id, ord.id]
            );
            connection.release();
            return result.rows[0];
        } catch (e) {
            throw new Error(`Can not edit product ${ord.id} - ${e}`);
        }
    }

    async destroy(id: number): Promise<Order> {
        try {
            const connection = await client.connect();
            const result = await connection.query(
                'delete from orders where id=($1) returning *;',
                [id]
            );
            connection.release();
            return result.rows[0];
        } catch (e) {
            throw new Error(`${e}`);
        }
    }
    async ordByUsrId(usrId: number): Promise<Order> {
        try {
            const connection = await client.connect();
            const result = await connection.query(
                "select o.id as id, u.user_name, JSON_AGG(JSONB_BUILD_OBJECT('product_id', p.id, 'name', p.name, 'price', p.price, 'category', p.category, 'quantity', od.quantity)) as products, o.status as status from orders as o left join order_details as od on o.id = od.order_id left join products as p on od.product_id = p.id left join users as u on u.id = o.user_id where o.user_id = $1 and o.status = 'active' group by o.id, u.user_name, o.status, o.user_id;",
                [usrId]
            );
            connection.release();
            return result.rows[0];
        } catch (e) {
            throw new Error(`${e}`);
        }
    }
}