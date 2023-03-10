
import client from '../database';
import { OrderDetails } from '../types';

export class OrderDetailsModel {
    async create(oD: {
        quantity: number;
        product_id: number | undefined;
        order_id: number | undefined;
    }): Promise<OrderDetails> {
        try {
            const connection = await client.connect();
            const result = await connection.query(
                'insert into order_details (product_id, quantity, order_id) values($1, $2, $3) returning *;',
                [oD.product_id, oD.quantity, oD.order_id]
            );
            connection.release();
            // console.log('ORDER DETAILS ITEM =====================>>>>>>>>>>>.----------------------->>>>>>>>>>>>>>>',result.rows[0]);
            return result.rows[0];
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async show(user_id: number): Promise<OrderDetails> {
        try {
            const connection = await client.connect();
            const sql1 =
                'SELECT * from orders JOIN order_details ON (orders.id = order_details.order_id) WHERE user_id=($1)';
            const result = await connection.query(sql1, [user_id]);
            connection.release();

            console.log(result.rows);

            return result.rows[0] as OrderDetails;
        } catch (e) {
            throw new Error(`${e}`);
        }
    }
}