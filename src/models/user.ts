import client from '../database';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { User } from '../types';
import { formatUser } from '../utils/formats';

dotenv.config();

const { SALT_ROUNDS, PEPPER } = process.env;
export class UserModel {
    async create(usr: User): Promise<User> {
        try {
            const connection = await client.connect();
            const sql =
                'insert into users (user_name, first_name, last_name, password) values ($1, $2, $3, $4) returning *;';
            const encryptedPassword = bcrypt.hashSync(
                usr.password + PEPPER,
                parseInt(SALT_ROUNDS as unknown as string)
            );
            const result = await connection.query(sql, [
                usr.user_name,
                usr.first_name,
                usr.last_name,
                encryptedPassword
            ]);
            const { id, user_name, first_name, last_name, password } =
                result.rows[0];
            connection.release();
            return formatUser(id, user_name, first_name, last_name, password);
        } catch (e) {
            throw new Error(`User ${usr.user_name} can not be created: ${e}`);
        }
    }

    async index(): Promise<User[]> {
        try {
            const connection = await client.connect();
            const sql = 'select * from users;';
            const result = await connection.query(sql);
            connection.release();
            return result.rows.map((usr) => {
                return formatUser(
                    usr.id,
                    usr.user_name,
                    usr.first_name,
                    usr.last_name,
                    usr.password
                );
            });
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async show(usr_id: number): Promise<User> {
        try {
            const connection = await client.connect();
            const sql = 'select * from users where id=($1)';
            const result = await connection.query(sql, [usr_id]);
            const { id, user_name, first_name, last_name, password } =
                result.rows[0];
            connection.release();
            return formatUser(id, user_name, first_name, last_name, password);
        } catch (e) {
            console.log(e);
            throw new Error(`${e}`);
        }
    }

    async update(usr: User): Promise<User> {
        try {
            const connection = await client.connect();
            const result = await connection.query(
                'update users set user_name=$1, first_name=$2, last_name=$3, password=$4 where id=$5 returning *;',
                [
                    usr.user_name,
                    usr.first_name,
                    usr.last_name,
                    bcrypt.hashSync(
                        usr.password + PEPPER,
                        parseInt(SALT_ROUNDS as unknown as string)
                    ),
                    usr.id
                ]
            );
            const { id, user_name, first_name, last_name, password } =
                result.rows[0];
            connection.release();
            return formatUser(id, user_name, first_name, last_name, password);
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async destroy(id: number): Promise<User> {
        try {
            const connection = await client.connect();
            const result = await connection.query(
                'delete from users where id=($1) returning *',
                [id]
            );
            connection.release();
            return result.rows[0];
        } catch (e) {
            throw new Error(`Can not delete user: ${e}`);
        }
    }

    async authenticate(user_name: string, pw: string): Promise<null | User> {
        try {
            const connection = await client.connect();
            const sql = 'select password from users where user_name=($1);';
            const result = await connection.query(sql, [user_name]);
            if (result.rows.length) {
                const usr = result.rows[0];
                if (bcrypt.compareSync(pw + PEPPER, usr.password)) {
                    return usr;
                }
            }
            return null;
        } catch (e) {
            throw new Error(
                `The user: ${user_name} is not authenticated yet, ${e}`
            );
        }
    }
}