import React, { useState } from 'react';
import { Button, TextField, Typography, Paper, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [userData, setUserData] = useState({ nama: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); 
        try {
            const response = await axios.post('http://localhost:8000/login', userData);
            console.log('User logged in:', response.data);
            if (response.data.role == 'pembeli') {
                navigate(`../../${response.data.user_id}/`);
            }else if (response.data.role == 'atmin'){
                navigate(`../../${response.data.user_id}/admin`)
            }else {
                navigate(`../../${response.data.user_id}/seller`);
            }
           
            
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError('Username or Password is incorrect');
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Paper elevation={3} className="p-6 w-96">
                <Typography variant="h5" className="mb-4 text-center">Login</Typography>
                {error && (
                    <Alert severity="error" className="mb-4">
                        {error}
                    </Alert>
                )}
                
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Nama"
                        name="nama"
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        className="mb-4"
                        required
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        className="mb-4"
                        required
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Login
                    </Button>
                </form>
            </Paper>
        </div>
    );
};

export default Login;
