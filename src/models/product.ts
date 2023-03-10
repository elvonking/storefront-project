import client from '../database';
import { Product } from '../types';

export class ProductModel {
    async createProduct(product: Product): Promise<Product> {
        try {
            const connection = await client.connect();
            const result = await connection.query(
                'insert into products (name, price, category) values ($1,$2, $3) returning *;',
                [product.name, product.price, product.category]
            );
            const newItemProduct = result.rows[0];
            // console.log('newItemProduct--------------------------------->>>>>>>>>>>>>>>>>>>>>>', newItemProduct)
            connection.release();
            return newItemProduct;
        } catch (e) {
            throw new Error(`Product ${product.name} can not be add. - ${e}`);
        }
    }

    async index(): Promise<Product[]> {
        try {
            const connection = await client.connect();
            const result = await connection.query('select * from products;');
            connection.release();
            return result.rows;
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async show(prodId: number): Promise<Product> {
        try {
            const connection = await client.connect();
            const result = await connection.query(
                'select * from products where id = ($1)',
                [prodId]
            );
            const items = result.rows[0];
            connection.release();
            return items;
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async updateProduct(p: Product): Promise<Product> {
        try {
            const connection = await client.connect();
            const result = await connection.query(
                'update products set name=$1, price=$2, category=$3 where id=$4 returning *;',
                [p.name, p.price, p.category, p.id]
            );
            connection.release();
            return result.rows[0];
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async deleteProduct(ID: number): Promise<Product> {
        try {
            const connection = await client.connect();
            const result = await connection.query(
                'delete from products where id = ($1) returning *;',
                [ID]
            );
            const deletedProduct = result.rows[0];
            connection.release();
            return deletedProduct;
        } catch (e) {
            throw new Error(`Can not delete the item:  ${e}`);
        }
    }
}