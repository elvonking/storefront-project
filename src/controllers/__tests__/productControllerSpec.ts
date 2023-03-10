import { Product } from '../../types';
import supertest from 'supertest';
import client from '../../database';
import { app } from '../../server';
import { token } from './userControllerSpec';

const request = supertest(app);
const myProduct: Product = {
    name: 'Apple',
    price: 10000,
    category: 'Smart Phones'
};

describe('Testing Product EndPoints', function () {
    beforeAll(async () => {
        const connection = await client.connect();
        await connection.query(
            'delete from products;\n alter sequence products_id_seq restart with 1;'
        );
        connection.release();
    });

    it("/products/create': Create a product", async () => {
        const response = await request
            .post('/products/create')
            .set('Authorization', `Bearer ${token}`)
            .send(myProduct);
        expect(response.status).toBe(200);
    });
    it("/products/:id': Get a specific product", async () => {
        const response = await request
            .get('/products/1')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: 1,
            name: 'Apple',
            price: 10000,
            category: 'Smart Phones'
        });
    });
    it("/products': Get all products", async () => {
        const response = await request.get('/products');
        const prods = response.body.map((p: Product[]) => {
            return prods;
        });
        expect(response.status).toEqual(200);
    });
    afterAll(async () => {
        const connection = await client.connect();
        await connection.query(
            'delete from products;\n alter sequence products_id_seq restart with 1;'
        );
        await connection.query(
            'delete from users;\n alter sequence users_id_seq restart with 1;'
        );
        connection.release();
    });
});