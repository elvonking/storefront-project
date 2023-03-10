import { Order, OrderDetails, User } from '../../types';

export const formatUser = (
    id: number | undefined,
    user_name: string,
    first_name: string,
    last_name: string,
    password: string
): User => {
    return {
        id: id,
        user_name: user_name,
        first_name: first_name,
        last_name: last_name,
        password: password
    };
};

export const formatOrderDetails = (
    id: number,
    product_id: number,
    quantity: number,
    order_id: number
): OrderDetails => {
    return { id, product_id, quantity, order_id };
};

export const formatOrder = (
    id: number,
    status: string,
    user_id: number
): Order => {
    return {
        id: id,
        status: status,
        user_id: user_id
    };
};