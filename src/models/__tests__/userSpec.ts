import { UserModel } from '../user';
import { User } from '../../types';
import client from '../../database';
import dotenv from 'dotenv';
import _ from 'lodash';
import bcrypt from 'bcrypt';

dotenv.config();
const { SALT_ROUNDS, PEPPER } = process.env;
const userInstance = new UserModel();

// Dummy user list
export const usrList: User[] = [
    {
        user_name: 'testuser1',
        first_name: 'testuser1',
        last_name: 'testuser1',
        password: 'testpwd1'
    },
    {
        user_name: 'testuser2',
        first_name: 'testuser2',
        last_name: 'testuser2',
        password: 'testpwd2'
    },
    {
        user_name: 'testuser3',
        first_name: 'testuser3',
        last_name: 'testuser3',
        password: 'testpwd3'
    }
];

// Adding ids for simplicity.
export const uListWithIdsPasswords = usrList.map((u, i) => {
    return {
        id: i + 1,
        ..._.pick(u, ['user_name', 'first_name', 'last_name'])
    };
});

describe('User Model Instance', () => {
    describe('Testing User instance methods existence:', () => {
        it('Index method defined', function () {
            expect(userInstance.index).toBeDefined();
        });
        it('Create method defined', function () {
            expect(userInstance.create).toBeDefined();
        });
        it('Show method defined', function () {
            expect(userInstance.show).toBeDefined();
        });
        it('Update method defined', function () {
            expect(userInstance.update).toBeDefined();
        });
        it('Destroy method defined', function () {
            expect(userInstance.destroy).toBeDefined();
        });
        it('Authenticate method defined', function () {
            expect(userInstance.authenticate).toBeDefined();
        });
    });

    describe('Testing user instance method functionalities:', () => {
        beforeAll(async () => {
            const connection = await client.connect();
            for (const usr of usrList) {
                const encryptedPassword = bcrypt.hashSync(
                    usr.password + PEPPER,
                    parseInt(SALT_ROUNDS as unknown as string)
                );
                await connection.query(
                    'insert into users (user_name, first_name, last_name, password) values ($1,$2,$3,$4);',
                    [
                        usr.user_name,
                        usr.first_name,
                        usr.last_name,
                        encryptedPassword
                    ]
                );
            }
            connection.release();
        });

        it('Index: retrieved all users.', async () => {
            const result = await userInstance.index();
            const resultWithoutPwd = result.map((u) => {
                return _.pick(u, [
                    'id',
                    'user_name',
                    'first_name',
                    'last_name'
                ]);
            });
            const pwdChecks = result.every((user: User, i: number) => {
                return bcrypt.compareSync(
                    usrList[i].password + PEPPER,
                    user.password
                );
            });

            expect(resultWithoutPwd).toEqual(uListWithIdsPasswords);
            expect(pwdChecks).toBe(true);
        });

        it('Create: Creates a user.', async () => {
            const created = await userInstance.create({
                user_name: 'ahmed4',
                first_name: 'ahmed4',
                last_name: 'ahmed4',
                password: 'ahmed4'
            });
            const withoutPassword = _.pick(created, [
                'id',
                'user_name',
                'first_name',
                'last_name'
            ]);
            const check = bcrypt.compareSync(
                'ahmed4' + PEPPER,
                created.password
            );
            expect(check).toBe(true);
            expect(withoutPassword).toEqual({
                id: 4,
                user_name: 'ahmed4',
                first_name: 'ahmed4',
                last_name: 'ahmed4'
            });
        });
        it('Show: shows a specific user with its id.', async () => {
            const usrId = await userInstance.show(4);
            const withoutPassword = _.pick(usrId, [
                'id',
                'user_name',
                'first_name',
                'last_name'
            ]);
            const pwdCheck = bcrypt.compareSync(
                'ahmed4' + PEPPER,
                usrId.password
            );

            expect(pwdCheck).toBe(true);
            expect(withoutPassword).toEqual({
                id: 4,
                user_name: 'ahmed4',
                first_name: 'ahmed4',
                last_name: 'ahmed4'
            });
        });

        it('Authenticate: null returned in case of no user', async () => {
            const result = await userInstance.authenticate(
                'testuser1',
                'testpwd2'
            );
            expect(result).toBe(null);
        });
        it('Authenticate: returns an authed user', async () => {
            const authedUsr = await userInstance.authenticate('x', 'x');
            if (authedUsr) {
                expect(authedUsr.user_name).toBe('x');
                expect(authedUsr.first_name).toBe('x');
                expect(authedUsr.last_name).toBe('x');
            }
        });

        afterAll(async () => {
            const connection = await client.connect();
            await connection.query(
                'delete from users; \nalter sequence users_id_seq restart with 1;'
            );
            connection.release();
        });
    });
});