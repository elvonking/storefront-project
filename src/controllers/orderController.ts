import { Request, Response, Application } from 'express';
import { OrderModel } from '../models/order';
import { verifyToken } from '../utils/jwtAuth';

const orderModel = new OrderModel();

const create = async (request: Request, response: Response) => {
    try {
        const createdOrder = await orderModel.createOrder(request.body);
        response.json(createdOrder);
    } catch (e) {
        response.status(500).send(`${e}`);
    }
};

const index = async (request: Request, response: Response) => {
    try {
        const orders = await orderModel.index();
        response.json(orders);
    } catch (e) {
        response.status(500).send(`${e}`);
    }
};

const show = async (request: Request, response: Response) => {
    try {
        const order = await orderModel.show(
            request.params.id as unknown as number
        );
        response.json(order);
    } catch (e) {
        response.status(500).send(`${e}`);
    }
};

const update = async (request: Request, response: Response) => {
    try {
        const order = await orderModel.update(request.body);
        response.json(order);
    } catch (e) {
        response.status(500).send(`${e}`);
    }
};

const destroy = async (request: Request, response: Response) => {
    try {
        const order = await orderModel.destroy(
            request.params.id as unknown as number
        );
        response.json(order);
    } catch (e) {
        response.status(500).send(`${e}`);
    }
};

const ordByUsrId = async (request: Request, response: Response) => {
    try {
        const order = await orderModel.ordByUsrId(
            request.params.id as unknown as number
        );
        response.json(order);
    } catch (e) {
        response.status(500).send(`${e}`);
    }
};

export const ordersRouter = (app: Application): void => {
    app.post('/orders/create', verifyToken, create);
    app.get('/orders', verifyToken, index);
    app.get('/orders/:id', verifyToken, show);
    app.patch('/orders/:id', verifyToken, update);
    app.delete('/orders/:id', verifyToken, destroy);
    app.get('/orders/user/:id', verifyToken, ordByUsrId);
};