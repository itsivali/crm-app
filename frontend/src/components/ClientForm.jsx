import React from 'react';
import { TextField, Button, Box, Paper, Typography } from '@mui/material';
import formCardStyle from '../utils/CardStyle';

export default function ClientForm({ item, onSaved, onCancel }) {
    const [form, setForm] = React.useState(item || { name: '', email: '', phone: '' });

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = e => {
        e.preventDefault();
        // Call save logic here
        if (onSaved) onSaved(form);
    };

    return (
        <Paper elevation={6} sx={formCardStyle}>
            <Typography variant="h6" gutterBottom>
                {item ? 'Edit Client' : 'Add a Client'}
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
                    label="Email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
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