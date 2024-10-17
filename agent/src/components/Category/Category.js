import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Paper } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [categoryData, setCategoryData] = useState({ name: '' });
    const {id} = useParams()

    const fetchCategories = async () => {
        const response = await axios.get('http://localhost:8000/kategoris');
        setCategories(response.data);
    };

    const handleChange = (e) => {
        setCategoryData({ ...categoryData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/kategoris', categoryData);
            fetchCategories();
        } catch (error) {
            console.error('Error creating category:', error.response.data);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/kategoris/${id}`);
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error.response.data);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <Paper elevation={3} className="p-6 w-96">
                <Typography variant="h5" className="mb-4 text-center">Manage Categories</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Category Name"
                        name="name"
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        className="mb-4"
                        required
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Add Category
                    </Button>
                </form>
                <div className="mt-4">
                    <Typography variant="h6">Category List</Typography>
                    {categories.map(category => (
                        <div key={category.id} className="flex justify-between items-center p-2 border-b">
                            <Typography>{category.name}</Typography>
                            <Button variant="contained" color="secondary" onClick={() => handleDelete(category.id)}>
                                Delete
                            </Button>
                        </div>
                    ))}
                </div>
            </Paper>
        </div>
    );
};

export default Categories;
