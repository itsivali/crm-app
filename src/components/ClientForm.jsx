import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Grid,
    Box,
    Typography,
    Stack,
    Paper,
    InputAdornment
} from '@mui/material';
import {
    Save as SaveIcon,
    Cancel as CancelIcon,
    Person as PersonIcon,
    Business as BusinessIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as AddressIcon,
    Notes as NotesIcon
} from '@mui/icons-material';
import { createClient, updateClient } from '../api';

const empty = { name: '', company: '', address: '', email: '', phone: '', notes: '' };

export default function ClientForm({ client, onSaved, onCancel }) {
    const [data, setData] = useState(client || empty);
    const [error, setError] = useState(null);

    useEffect(() => setData(client || empty), [client]);

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const formData = { ...data };
            delete formData._id; // Remove _id for new records - MongoDB will generate it

            if (client?._id) {
                await updateClient(client._id, formData);
            } else {
                await createClient(formData);
            }
            onSaved(true); // Pass true to indicate successful save
        } catch (error) {
            console.error('Error saving client:', error.response?.data || error);
            setError(error.response?.data?.error || 'Failed to save client');
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
            <Box component="form" onSubmit={handleSubmit}>
                <Typography
                    variant="h6"
                    color="primary"
                    gutterBottom
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 3
                    }}
                >
                    <PersonIcon /> {client ? 'Edit Client' : 'New Client'}
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            label="Name"
                            value={data.name}
                            onChange={e => setData({ ...data, name: e.target.value })}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Company"
                            value={data.company}
                            onChange={e => setData({ ...data, company: e.target.value })}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <BusinessIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            label="Email"
                            type="email"
                            value={data.email}
                            onChange={e => setData({ ...data, email: e.target.value })}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Phone"
                            value={data.phone}
                            onChange={e => setData({ ...data, phone: e.target.value })}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PhoneIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Address"
                            value={data.address}
                            onChange={e => setData({ ...data, address: e.target.value })}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AddressIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Notes"
                            value={data.notes}
                            onChange={e => setData({ ...data, notes: e.target.value })}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <NotesIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                </Grid>
                {error && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                )}

                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        startIcon={<SaveIcon />}
                        sx={{
                            px: 4,
                            background: theme => `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                            boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                        }}
                    >
                        Save
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={onCancel}
                        startIcon={<CancelIcon />}
                        sx={{ px: 3 }}
                    >
                        Cancel
                    </Button>
                </Stack>
            </Box>
        </Paper>
    );
}