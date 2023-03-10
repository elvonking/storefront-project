export type User = {
    id?: number;
    user_name: string;
    first_name?: string;
    last_name?: string;
    password: string;
};

export type Order = {
    id?: number;
    status: string;
    user_id: number;
};
export type OrderDetails = {
    id?: number | undefined;
    product_id: number;
    quantity: number;
    order_id: number;
    products?: Product[] | undefined;
};

export type Product = {
    id?: number;
    name: string;
    price: number;
    category: string;
};