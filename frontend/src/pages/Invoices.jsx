import React, { useState } from 'react';
import { Typography, Paper } from '@mui/material';
import InvoiceList from '../components/InvoiceList';
import InvoiceForm from '../components/InvoiceForm';

export default function Invoices() {
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);

    return (
        <div>
            <Typography variant="h4" gutterBottom>Invoices</Typography>
            <InvoiceList
                onAdd={() => {
                    setEditing(null);
                    setShowForm(true);
                }}
                onEdit={inv => {
                    setEditing(inv);
                    setShowForm(true);
                }}
            />
            {showForm && (
                <Paper sx={{ mt: 2, p: 2 }}>
                    <InvoiceForm
                        invoice={editing}
                        onSaved={() => setShowForm(false)}
                        onCancel={() => setShowForm(false)}
                    />
                </Paper>
            )}
        </div>
    );
}