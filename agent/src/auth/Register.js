import React, { useState } from 'react';
import { Button, TextField, Typography, Paper, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router';

const Register = () => {
    const [userData, setUserData] = useState({ nama: '', password: '', alamat: '', role: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/register', userData);
            console.log('User registered:', response.data);
            if (response.data.role === 'pembeli') {
                navigate(`../../${response.data.user_id}/`);
            } else {
                navigate(`../../${response.data.user_id}/seller`);
            }
        } catch (error) {
            console.error('Error registering user:', error.response.data);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Paper elevation={3} className="p-6 w-96">
                <Typography variant="h5" className="mb-4 text-center">Register</Typography>
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
                    <TextField
                        label="Alamat"
                        name="alamat"
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        className="mb-4"
                    />
                    <FormControl fullWidth className="mb-4">
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select
                            labelId="role-label"
                            id="role"
                            name="role"
                            value={userData.role}
                            onChange={handleChange}
                            required
                        >
                            <MenuItem value="penjual">Penjual</MenuItem>
                            <MenuItem value="pembeli">Pembeli</MenuItem>
                        </Select>
                    </FormControl>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Register
                    </Button>
                </form>
            </Paper>
        </div>
    );
};

export default Register;
