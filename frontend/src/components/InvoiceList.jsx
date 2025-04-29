import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    Paper,
    IconButton,
    Tooltip
} from '@mui/material';
import { Edit, Delete, CheckCircle } from '@mui/icons-material';
import { fetchInvoices, deleteInvoice, payInvoice } from '../api';

export default function InvoiceList({ onEdit, onAdd }) {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                const res = await fetchInvoices();
                if (mounted) {
                    setInvoices(res.data);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Failed to fetch invoices:', error);
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        load();

        return () => {
            mounted = false;
        };
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteInvoice(id);
            setInvoices(invoices.filter(inv => inv.id !== id));
        } catch (error) {
            console.error('Failed to delete invoice:', error);
        }
    };

    const handlePay = async (id) => {
        try {
            await payInvoice(id);
            setInvoices(invoices.map(inv =>
                inv.id === id ? { ...inv, status: 'PAID' } : inv
            ));
        } catch (error) {
            console.error('Failed to pay invoice:', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <Paper>
            <Button
                variant="contained"
                color="primary"
                onClick={onAdd}
                sx={{ m: 2 }}
            >
                Add Invoice
            </Button>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Invoice #</TableCell>
                        <TableCell>Client</TableCell>
                        <TableCell>Issued Date</TableCell>
                        <TableCell>Due Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {invoices.map(inv => (
                        <TableRow key={inv.id}>
                            <TableCell>{inv.invoice_number}</TableCell>
                            <TableCell>{inv.client_id}</TableCell>
                            <TableCell>{new Date(inv.date_issued).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(inv.date_due).toLocaleDateString()}</TableCell>
                            <TableCell>{inv.status}</TableCell>
                            <TableCell align="right">
                                ${inv.total_amount.toFixed(2)}
                            </TableCell>
                            <TableCell>
                                <Tooltip title="Edit">
                                    <IconButton onClick={() => onEdit(inv)} color="primary">
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <IconButton
                                        onClick={() => handleDelete(inv.id)}
                                        color="error"
                                    >
                                        <Delete />
                                    </IconButton>
                                </Tooltip>
                                {inv.status !== 'PAID' && (
                                    <Tooltip title="Mark as Paid">
                                        <IconButton
                                            onClick={() => handlePay(inv.id)}
                                            color="success"
                                        >
                                            <CheckCircle />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}