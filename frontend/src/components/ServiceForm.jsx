import React from 'react';
import { TextField, Button, Box, Paper, Typography } from '@mui/material';
import formCardStyle from '../utils/CardStyle';

export default function ServiceForm({ item, onSaved, onCancel }) {
    const [form, setForm] = React.useState(item || { name: '', description: '', price: '' });

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = e => {
        e.preventDefault();
        // Call save logic here
        if (onSaved) onSaved(form);
    };

    return (
        <Paper elevation={6} sx={formCardStyle}>
            <Typography variant="h6" gutterBottom>
                {item ? 'Edit Service' : 'Add Service'}
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                    label="Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Price"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    type="number"
                    required
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button onClick={onCancel} sx={{ mr: 2 }}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained">
                        Save
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
}