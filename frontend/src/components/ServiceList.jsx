import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    Paper,
    Dialog,
    DialogContent,
    Typography,
    TextField,
    Box
} from '@mui/material';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import { fetchServices, deleteService, createService, updateService } from '../api';
import formCardStyle from '../utils/CardStyle';

export default function ServiceList() {
    const [items, setItems] = useState([]);
    const [editing, setEditing] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        const res = await fetchServices();
        setItems(res.data);
    };

    const handleSave = async (form) => {
        if (form._id) {
            await updateService(form._id, form);
        } else {
            await createService(form);
        }
        setOpen(false);
        setEditing(null);
        load();
    };

    const handleEdit = (service) => {
        setEditing(service);
        setOpen(true);
    };

    const handleAdd = () => {
        setEditing(null);
        setOpen(true);
    };

    const handleDelete = async (id) => {
        await deleteService(id);
        load();
    };

    return (
        <Paper>
            <Button
                variant="contained"
                color="primary"
                onClick={handleAdd}
                startIcon={<AddBusinessIcon />}
                sx={{
                    background: theme => `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                    boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                    m: 2
                }}
            >
                Add Service
            </Button>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>SKU</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Unit Price</TableCell>
                        <TableCell>Tax Rate (%)</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map(s => (
                        <TableRow key={s._id}>
                            <TableCell>{s.sku}</TableCell>
                            <TableCell>{s.description}</TableCell>
                            <TableCell>{s.unit_price}</TableCell>
                            <TableCell>{s.tax_rate}</TableCell>
                            <TableCell>
                                <Button color="primary" onClick={() => handleEdit(s)}>
                                    Edit
                                </Button>
                                <Button color="error" onClick={() => handleDelete(s._id)}>
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogContent>
                    <ServiceForm
                        item={editing}
                        onSaved={handleSave}
                        onCancel={() => { setOpen(false); setEditing(null); }}
                    />
                </DialogContent>
            </Dialog>
        </Paper>
    );
}

// ServiceForm component (inline for clarity, or import from a separate file)
function ServiceForm({ item, onSaved, onCancel }) {
    const [form, setForm] = useState(
        item || { sku: '', description: '', unit_price: '', tax_rate: '' }
    );

    useEffect(() => {
        setForm(item || { sku: '', description: '', unit_price: '', tax_rate: '' });
    }, [item]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: name === 'unit_price' || name === 'tax_rate' ? Number(value) : value
        }));
    };

    const handleSubmit = e => {
        e.preventDefault();
        onSaved(form);
    };

    return (
        <Paper elevation={6} sx={formCardStyle}>
            <Typography variant="h6" gutterBottom>
                {item ? 'Edit Service' : 'Add Service'}
            </Typography>
            <form onSubmit={handleSubmit} noValidate>
                <TextField
                    label="SKU"
                    name="sku"
                    value={form.sku}
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
                    required
                />
                <TextField
                    label="Unit Price"
                    name="unit_price"
                    value={form.unit_price}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    type="number"
                    required
                />
                <TextField
                    label="Tax Rate (%)"
                    name="tax_rate"
                    value={form.tax_rate}
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
            </form>
        </Paper>
    );
}