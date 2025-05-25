import React from 'react';
import { TextField, Button, Box, Paper, Typography } from '@mui/material';
import formCardStyle from '../utils/CardStyle';

export default function InvoiceForm({ item, onSaved, onCancel }) {
    const [form, setForm] = React.useState(item || { client: '', amount: '', dueDate: '' });

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = e => {
        e.preventDefault();
        // Call save logic here
        if (onSaved) onSaved(form);
    };

    return (
        <Paper elevation={6} sx={formCardStyle}>
            <Typography variant="h6" gutterBottom>
                {item ? 'Edit Invoice' : 'Add Invoice'}
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                    label="Client"
                    name="client"
                    value={form.client}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Amount"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    type="number"
                    required
                />
                <TextField
                    label="Due Date"
                    name="dueDate"
                    value={form.dueDate}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    type="date"
                    InputLabelProps={{ shrink: true }}
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