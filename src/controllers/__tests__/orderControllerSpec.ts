import client from '../../database';
import { OrderDetailsModel } from '../../models/orderDetails';


const orderDetailsModel = new OrderDetailsModel();

describe('More Orders and Order Details', function () {
    beforeAll(async () => {
        const connection = await client.connect();
        await connection.query(
            'delete from users;\n alter sequence users_id_seq restart with 1;'
        );
        await connection.query(
            'delete from products;\n alter sequence products_id_seq restart with 1;'
        );
        await connection.query(
            'delete from orders;\n alter sequence orders_id_seq restart with 1;'
        );
        await connection.query(
            'delete from order_details;\n alter sequence order_Details_id_seq restart with 1;'
        );
        connection.release();
    });

    describe('Order Details: Testing Order details methods existence:', () => {
        it('Show: existed', () => {
            expect(orderDetailsModel.show).toBeDefined();
        });
        it('Create: existed', () => {
            expect(orderDetailsModel.create).toBeDefined();
        });
    });

    afterAll(async () => {
        const connection = await client.connect();
        await connection.query(
            'delete from order_details;\n alter sequence order_Details_id_seq restart with 1;'
        );
        await connection.query(
            'delete from products;\n alter sequence products_id_seq restart with 1;'
        );
        await connection.query(
            'delete from orders;\n alter sequence orders_id_seq restart with 1;'
        );
        await connection.query(
            'delete from users;\n alter sequence users_id_seq restart with 1;'
        );
        connection.release();
    });
});