import express, { Request, Response } from 'express';
import { OrderDetailsModel } from '../models/orderDetails';
import { verifyToken } from '../utils/jwtAuth';

const orderDetailsModel = new OrderDetailsModel();

const create = async (request: Request, response: Response) => {
    try {
        const detailsOfOrder = await orderDetailsModel.create(request.body);
        return response.json(detailsOfOrder);
    } catch (e) {
        response.status(500).send(`${e}`);
    }
};

const show = async (request: Request, response: Response) => {
    try {
        const ordDetails = await orderDetailsModel.show(
            parseInt(request.params.id)
        );
        console.log(ordDetails);
        response.json(ordDetails);
    } catch (e) {
        response.status(500).send(`${e}`);
    }
};

export const orderDetailsRouter = (app: express.Application): void => {
    app.post('/order-details/create', verifyToken, create);
    app.get('/order-details/usr/:id', verifyToken, show);
};