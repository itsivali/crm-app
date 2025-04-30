import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Box,
    Typography,
    Paper,
    Stack,
    InputAdornment
} from '@mui/material';
import {
    Save as SaveIcon,
    Cancel as CancelIcon,
    LocalOffer as SkuIcon,
    Description as DescIcon,
    PriceChange as PriceIcon,
    Percent as TaxIcon
} from '@mui/icons-material';
import { createService, updateService } from '../api';

const empty = { sku: '', description: '', unit_price: '', tax_rate: '' };

export default function ServiceForm({ item, onSaved, onCancel }) {
    const [data, setData] = useState(item || empty);
    useEffect(() => setData(item || empty), [item]);

    const handleSubmit = async e => {
        e.preventDefault();
        const formData = { ...data };
        delete formData._id; // Remove _id for new records - MongoDB will generate it

        if (item?._id) {
            await updateService(item._id, formData);
        } else {
            await createService(formData);
        }
        onSaved();
    };

    return (
        <Paper elevation={3} sx={{ p: 3, maxWidth: 500, mx: 'auto' }}>
            <Box component="form" onSubmit={handleSubmit}>
                <Typography variant="h6" color="primary" gutterBottom sx={{ mb: 3 }}>
                    {item ? 'Edit Service' : 'New Service'}
                </Typography>

                <Stack spacing={3}>
                    <TextField
                        required
                        fullWidth
                        label="SKU"
                        value={data.sku}
                        onChange={e => setData({ ...data, sku: e.target.value })}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SkuIcon color="primary" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        required
                        fullWidth
                        multiline
                        rows={3}
                        label="Description"
                        value={data.description}
                        onChange={e => setData({ ...data, description: e.target.value })}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <DescIcon color="primary" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        required
                        fullWidth
                        type="number"
                        label="Unit Price"
                        value={data.unit_price}
                        onChange={e => setData({ ...data, unit_price: e.target.value })}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PriceIcon color="primary" />$
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        fullWidth
                        type="number"
                        label="Tax Rate (%)"
                        value={data.tax_rate}
                        onChange={e => setData({ ...data, tax_rate: e.target.value })}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <TaxIcon color="primary" />
                                </InputAdornment>
                            ),
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                    />

                    <Stack direction="row" spacing={2} justifyContent="flex-end">
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
                </Stack>
            </Box>
        </Paper>
    );
}