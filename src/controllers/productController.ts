import express, { Request, Response } from 'express';
import { Product } from '../types';
import { ProductModel } from '../models/product';
import { verifyToken } from '../utils/jwtAuth';
const productModel = new ProductModel();

const create = async (request: Request, response: Response) => {
    try {
        const prodDetails: Product = {
            name: request.body.name,
            price: request.body.price,
            category: request.body.category
        };
        const newProduct = await productModel.createProduct(prodDetails);
        response.json(newProduct);
    } catch (e) {
        response.status(500).send(`${e}`);
    }
};

const index = async (_request: Request, response: Response) => {
    try {
        const items = await productModel.index();
        response.json(items);
    } catch (e) {
        response.status(500).send(`${e}`);
    }
};

const show = async (_request: Request, response: Response) => {
    try {
        const items = await productModel.show(parseInt(_request.params.id));
        response.json(items);
    } catch (e) {
        response.status(500).send(`${e}`);
    }
};

const update = async (request: Request, response: Response) => {
    try {
        const updatedProd = await productModel.updateProduct(request.body);
        response.json({
            name: updatedProd.name,
            price: updatedProd.price,
            category: updatedProd.category
        });
    } catch (e) {
        throw new Error(`Cant update : ${e}`);
    }
};

const destroy = async (request: Request, response: Response) => {
    try {
        const deletedProd = await productModel.deleteProduct(
            parseInt(request.params.id)
        );
        response.json(deletedProd);
    } catch (e) {
        response.status(500).send(`${e}`);
    }
};

export const productsRouter = (app: express.Application): void => {
    app.post('/products/create', verifyToken, create);
    app.get('/products', index); // auth removed
    app.get('/products/:id', show); //auth removed
    app.patch('/products/update', verifyToken, update);
    app.delete('/products/delete/:id', verifyToken, destroy);
};