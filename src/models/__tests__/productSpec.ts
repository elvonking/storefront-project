import { ProductModel } from '../product';
import { Product } from '../../types';
import client from '../../database';
import dotenv from 'dotenv';

dotenv.config();

const productModel = new ProductModel();

// Products dummy list
export const prodList: Product[] = [
    { name: 'prod1', price: 100, category: 'category' },
    { name: 'prod2', price: 102, category: 'category2' },
    { name: 'prod3', price: 103, category: 'category3' }
];

export const listWithId = prodList.map((p, i) => {
    p.id = i + 1;
    return p;
});

describe('Product Model Instance', () => {
    describe('Testing product instance methods existence:', () => {
        it('Index method defined', function () {
            expect(productModel.index).toBeDefined();
        });
        it('CreateProduct method defined', function () {
            expect(productModel.createProduct).toBeDefined();
        });
        it('Show method defined', function () {
            expect(productModel.show).toBeDefined();
        });
    });
    describe('Test Model methods logic', async () => {
        beforeAll(async () => {
            const connection = await client.connect();
            for (const prod of prodList) {
                await connection.query(
                    'insert into products (name, price, category) values ($1, $2, $3);',
                    [prod.name, prod.price, prod.category]
                );
            }
            connection.release();
        });

        it('Index: retrieved list of all products', async () => {
            const l = await productModel.index();
            expect(l).toEqual(listWithId);
        });

        it('productCreate: created product', async () => {
            const item = await productModel.createProduct({
                name: 'prod1',
                price: 100,
                category: 'category'
            });
            expect(item).toEqual({
                id: 4,
                name: 'prod1',
                price: 100,
                category: 'category'
            });
        });

        it('Show:  returns a specific product by an ID', async () => {
            const result = await productModel.show(4);

            expect(result).toEqual({
                id: 4,
                name: 'prod1',
                price: 100,
                category: 'category'
            });
        });
        it('Delete: delete a specific product with a given ID', async () => {
            const deletedItem = await productModel.deleteProduct(4);
            const allProducts = await productModel.index();

            expect(allProducts).not.toContain(deletedItem);
            expect(deletedItem).toEqual({
                id: 4,
                name: 'prod1',
                price: 100,
                category: 'category'
            });
        });
        it('delete should remove the product with the given id', async () => {
            const deletedProduct = await productModel.deleteProduct(3);
            const products = await productModel.index();

            expect(products).not.toContain(deletedProduct);
            expect(deletedProduct).toEqual({
                id: 3,
                name: 'prod3',
                price: 103,
                category: 'category3'
            });
        });

        afterAll(async () => {
            const conn = await client.connect();
            await conn.query(
                'delete from products;\n; alter sequence products_id_seq restart with 1;\n'
            );
            conn.release();
        });
    });
});