import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { usersRouter } from './controllers/userController';
import bodyParser from 'body-parser';
import errorMiddleware from './utils/errorMiddleware';
import { productsRouter } from './controllers/productController';
import { ordersRouter } from './controllers/orderController';
import { orderDetailsRouter } from './controllers/orderDetailsController';

export const app: express.Application = express();

// Securing env vars
dotenv.config();
const PORT = process.env.PORT || 3000;
// Cors => allowed whitelist | any | specific opt
app.use(cors());

app.use(express.json());
app.use(bodyParser.json());

//Security
app.use(helmet());

app.use(errorMiddleware);

app.get('/', function (_req: Request, res: Response) {
    res.send(`Main API root Endpoint.`);
});

usersRouter(app);
productsRouter(app);
ordersRouter(app);
orderDetailsRouter(app);

app.listen(3000, function () {
    console.log(`Server is running on:  127.0.0.1:${PORT}`);
});