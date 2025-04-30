import React, { useState } from 'react';
import { Typography, Button, Paper } from '@mui/material';
import ServiceList from '../components/ServiceList';
import ServiceForm from '../components/ServiceForm';

export default function Services() {
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);

    return (
        <div>
            <Typography variant="h4" gutterBottom>Services</Typography>
            <ServiceList
                onAdd={() => { setEditing(null); setShowForm(true); }}
                onEdit={s => { setEditing(s); setShowForm(true); }}
            />
            {showForm && (
                <Paper sx={{ mt: 2, p: 2 }}>
                    <ServiceForm
                        item={editing}
                        onSaved={() => setShowForm(false)}
                        onCancel={() => setShowForm(false)}
                    />
                </Paper>
            )}
        </div>
    );
}