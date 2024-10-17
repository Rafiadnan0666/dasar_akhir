import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Paper } from '@mui/material';
import axios from 'axios';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [orderData, setOrderData] = useState({ productId: '', quantity: '' });

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:8000/pesanans'); 
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };


    const handleChange = (e) => {
        setOrderData({ ...orderData, [e.target.name]: e.target.value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/pesanans', orderData); 
            fetchOrders(); 
        } catch (error) {
            console.error('Error creating order:', error);
        }
    };


    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/pesanans/${id}`);
            fetchOrders(); // Refresh order list
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    };


    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <Paper elevation={3} className="p-6 w-96">
                <Typography variant="h5" className="mb-4 text-center">Manage Orders</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Product ID"
                        name="productId"
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        className="mb-4"
                        required
                    />
                    <TextField
                        label="Quantity"
                        name="quantity"
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        className="mb-4"
                        required
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Add Order
                    </Button>
                </form>
                <div className="mt-4">
                    <Typography variant="h6">Order List</Typography>
                    {orders.map((order) => (
                        <div key={order.id} className="flex justify-between items-center p-2 border-b">
                            <Typography>Product ID: {order.productId}, Quantity: {order.quantity}</Typography>
                            <Button variant="contained" color="secondary" onClick={() => handleDelete(order.id)}>
                                Delete
                            </Button>
                        </div>
                    ))}
                </div>
            </Paper>
        </div>
    );
};

export default Orders;
