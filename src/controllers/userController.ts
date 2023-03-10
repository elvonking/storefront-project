import express, { NextFunction, Request, Response } from 'express';
import { UserModel } from '../models/user';
import { User } from '../types';
import { createToken, verifyToken } from '../utils/jwtAuth';

const userModel = new UserModel();

export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const usrDetails: User = {
        user_name: req.body.user_name,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: req.body.password
    };
    try {
        const usr = await userModel.create(usrDetails);
        // res.json(createToken(usr.user_name));
        res.json(createToken(usr.user_name));
        next();
    } catch (e) {
        res.status(500).send(`${e}`);
    }
};

export const index = async (_req: Request, res: Response) => {
    try {
        const users = await userModel.index();
        res.json(users);
    } catch (e) {
        res.status(500).send(`${e}`);
    }
};

export const show = async (req: Request, res: Response) => {
    try {
        const usr = await userModel.show(parseInt(req.params.id));
        res.json(usr);
    } catch (e) {
        res.status(500).send(`${e}`);
    }
};

export const update = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const usr = await userModel.update(req.body);
        res.json(createToken(usr.user_name));
        next();
    } catch (e) {
        res.status(500).send(`${e}`);
    }
};

export const destroy = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const usr = await userModel.destroy(req.params.id as unknown as number);
        res.json(usr);
        next();
    } catch (e) {
        res.status(500).send(`${e}`);
    }
};

export const authenticate = async (req: Request, res: Response) => {
    try {
        const usr = await userModel.authenticate(
            req.body.user_name,
            req.body.password
        );
        if (usr) {
            res.json(createToken(usr.user_name));
        } else {
            res.send('Please enter a valid user name and password.');
        }
    } catch (e) {
        res.status(500).send(`${e}`);
    }
};

export const usersRouter = (app: express.Application): void => {
    app.post('/users/create', create);
    app.get('/users', verifyToken, index);
    app.get('/users/:id', verifyToken, show);
    app.patch('/users/update', verifyToken, update);
    app.delete('/users/destroy/:id', verifyToken, destroy);
    app.post('/users/auth', verifyToken, authenticate);
};