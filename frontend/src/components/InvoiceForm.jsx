import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Box,
    Typography,
    Paper,
    Stack,
    MenuItem,
    Grid,
    IconButton,
    Divider,
    InputAdornment
} from '@mui/material';
import {
    Save as SaveIcon,
    Cancel as CancelIcon,
    AddCircle as AddIcon,
    RemoveCircle as RemoveIcon,
    Receipt as InvoiceIcon,
    Person as ClientIcon,
    CalendarToday as DateIcon,
    Inventory as ServiceIcon
} from '@mui/icons-material';
import { createInvoice, updateInvoice, fetchClients, fetchServices } from '../api';

export default function InvoiceForm({ invoice, onSaved, onCancel }) {
    const [data, setData] = useState(invoice || {
        client_id: '',
        date_issued: new Date().toISOString().split('T')[0],
        date_due: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [],
        status: 'DRAFT'
    });
    const [clients, setClients] = useState([]);
    const [services, setServices] = useState([]);

    useEffect(() => {
        loadData(); setData(invoice || {
            client_id: '',
            date_issued: new Date().toISOString().split('T')[0],
            date_due: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            items: [],
            status: 'DRAFT'
        });
    }, [invoice]);

    const loadData = async () => {
        const [cRes, sRes] = await Promise.all([
            fetchClients(),
            fetchServices()
        ]);
        setClients(cRes.data);
        setServices(sRes.data);
    };

    const handleAddItem = () => {
        setData({
            ...data,
            items: [...data.items, {
                service_id: '',
                quantity: 1,
                description_override: '',
                unit_price: 0,
                subtotal: 0
            }]
        });
    };

    const handleRemoveItem = (index) => {
        const items = data.items.filter((_, idx) => idx !== index);
        setData({ ...data, items });
    };

    const handleItemChange = (idx, field, value) => {
        const items = [...data.items];
        items[idx][field] = value;

        // If service changed, update unit price and recalculate subtotal
        if (field === 'service_id') {
            const service = services.find(s => s._id === value);
            if (service) {
                items[idx].unit_price = service.unit_price;
                items[idx].subtotal = service.unit_price * items[idx].quantity;
            }
        }

        // If quantity changed, recalculate subtotal
        if (field === 'quantity') {
            items[idx].subtotal = items[idx].unit_price * value;
        }

        setData({ ...data, items });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const formData = {
                client_id: data.client_id,
                date_issued: data.date_issued,
                date_due: data.date_due,
                items: data.items
                    .filter(item => item.service_id && item.quantity) // Filter out empty items
                    .map(item => ({
                        service_id: item.service_id,
                        quantity: Number(item.quantity) || 1,
                        description_override: item.description_override || ''
                    })),
                notes: data.notes || ''
            };

            if (invoice?._id) { // Update to use _id
                await updateInvoice(invoice._id, formData);
            } else {
                await createInvoice(formData);
            }
            onSaved();
        } catch (error) {
            console.error('Error saving invoice:', error.response?.data || error);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
            <Box component="form" onSubmit={handleSubmit}>
                <Typography variant="h5" color="primary" gutterBottom
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 4
                    }}>
                    <InvoiceIcon /> {invoice ? 'Edit Invoice' : 'New Invoice'}
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            select
                            required
                            fullWidth
                            label="Client"
                            value={data.client_id || ''}
                            onChange={e => setData({ ...data, client_id: e.target.value })}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <ClientIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                        >
                            <MenuItem value="">Select Client</MenuItem>
                            {clients.map(c => (
                                <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            type="date"
                            label="Issue Date"
                            value={data.date_issued}
                            onChange={e => setData({ ...data, date_issued: e.target.value })}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <DateIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            type="date"
                            label="Due Date"
                            value={data.date_due}
                            onChange={e => setData({ ...data, date_due: e.target.value })}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <DateIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ServiceIcon /> Invoice Items
                </Typography>

                <Stack spacing={2}>
                    {data.items.map((item, idx) => (
                        <Paper key={idx} variant="outlined" sx={{ p: 2 }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={5}>
                                    <TextField
                                        select
                                        required
                                        fullWidth
                                        label="Service"
                                        value={item.service_id || ''}
                                        onChange={e => handleItemChange(idx, 'service_id', e.target.value)}
                                    >
                                        <MenuItem value="">Select Service</MenuItem>
                                        {services.map(s => (
                                            <MenuItem key={s._id} value={s._id}>
                                                {s.sku} - ${s.unit_price}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        required
                                        fullWidth
                                        type="number"
                                        label="Quantity"
                                        value={item.quantity}
                                        onChange={e => handleItemChange(idx, 'quantity', e.target.value)}
                                        InputProps={{ inputProps: { min: 1 } }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        fullWidth
                                        label="Description"
                                        value={item.description_override}
                                        onChange={e => handleItemChange(idx, 'description_override', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={1}>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleRemoveItem(idx)}
                                        sx={{ mt: 1 }}
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Paper>
                    ))}
                </Stack>

                <Button
                    startIcon={<AddIcon />}
                    onClick={handleAddItem}
                    sx={{ mt: 2 }}
                >
                    Add Item
                </Button>

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
                        Save Invoice
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