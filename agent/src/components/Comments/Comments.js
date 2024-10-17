import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Paper } from '@mui/material';
import axios from 'axios';

const Comments = () => {
    const [comments, setComments] = useState([]);
    const [commentData, setCommentData] = useState({ userId: '', text: '' });

    const fetchComments = async () => {
        const response = await axios.get('http://localhost:8000/komentars');
        setComments(response.data);
    };

    const handleChange = (e) => {
        setCommentData({ ...commentData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/komentars', commentData);
            fetchComments(); // Refresh comment list
        } catch (error) {
            console.error('Error creating comment:', error.response.data);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/komentars/${id}`);
            fetchComments(); // Refresh comment list
        } catch (error) {
            console.error('Error deleting comment:', error.response.data);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <Paper elevation={3} className="p-6 w-96">
                <Typography variant="h5" className="mb-4 text-center">Manage Comments</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="User ID"
                        name="userId"
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        className="mb-4"
                        required
                    />
                    <TextField
                        label="Comment"
                        name="text"
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        className="mb-4"
                        required
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Add Comment
                    </Button>
                </form>
                <div className="mt-4">
                    <Typography variant="h6">Comment List</Typography>
                    {comments.map(comment => (
                        <div key={comment.id} className="flex justify-between items-center p-2 border-b">
                            <Typography>User ID: {comment.userId}, Comment: {comment.text}</Typography>
                            <Button variant="contained" color="secondary" onClick={() => handleDelete(comment.id)}>
                                Delete
                            </Button>
                        </div>
                    ))}
                </div>
            </Paper>
        </div>
    );
};

export default Comments;
