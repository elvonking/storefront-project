import { OrderModel } from '../order';
import dotenv from 'dotenv';
import client from '../../database';
import { Order, User } from '../../types';
import { UserModel } from '../user';
import _ from 'lodash';

export const usrList: User[] = [
    { user_name: 's', first_name: 's', last_name: 's', password: 's' }
];
export const lWithIds = usrList.map((u, i) => {
    return {
        id: i + 1,
        ..._.pick(u, ['user_name', 'first_name', 'last_name'])
    };
});
const orderList: Order[] = [{ status: 'active', user_id: lWithIds[0].id }];

const orderListWithId = orderList.map((o, i) => {
    o.id = i + 1;
    return o;
});

dotenv.config();

const orderModel = new OrderModel();
const userInstance = new UserModel();

describe('Order Model Instance', () => {
    describe('Testing Order instance method functionalities:', async () => {
        beforeAll(async () => {
            await userInstance.create(usrList[0]);
        });
        it('Order Create', async () => {
            const createdOrder: Order = await orderModel.createOrder(
                orderList[0]
            );
            expect(createdOrder.id).toBe(1);
            expect(createdOrder.status).toEqual('active');
            expect(createdOrder.user_id).toContain(1);
            expect(orderListWithId.length).toBe(1);
        });
        it('Show Order by user ID', async () => {
            const result = await orderModel.ordByUsrId(1);
            expect(result.status).toEqual('active');
            expect(result.id).toEqual(1);
        });
        it('show order', async () => {
            const result2 = await orderModel.show(1);
            expect(result2).toBeTruthy();
            // @ts-ignore
            expect(result2.id).toEqual(1);
            // @ts-ignore
            expect(result2.status).toEqual('active');
        });
    });
    describe('Orders Model Methods Existence', () => {
        it('Testing Order instance methods existence:', () => {
            expect(orderModel.createOrder).toBeDefined();
        });
        it('Index: existed', () => {
            expect(orderModel.index).toBeDefined();
        });
        it('Show: existed', () => {
            expect(orderModel.show).toBeDefined();
        });
        it('Update: existed', () => {
            expect(orderModel.update).toBeDefined();
        });
        it('Delete: existed', () => {
            expect(orderModel.destroy).toBeDefined();
        });
        it('Order BY User ID: existed', () => {
            expect(orderModel.ordByUsrId).toBeDefined();
        });
    });

    afterAll(async () => {
        const connection = await client.connect();
        await connection.query(
            'delete from orders;\nALTER sequence orders_id_seq RESTART WITH 1;\n DELETE FROM users;\nALTER SEQUENCE users_id_seq RESTART WITH 1;'
        );
        connection.release();
    });
});