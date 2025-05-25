import React, { useState } from 'react';
import { Typography, Paper } from '@mui/material';
import ClientList from '../components/ClientList';
import ClientForm from '../components/ClientForm';

export default function Clients() {
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);

    return (
        <div>
            <Typography variant="h4" gutterBottom>Clients</Typography>
            <ClientList
                onEdit={client => { setEditing(client); setShowForm(true); }}
                onAdd={() => { setEditing(null); setShowForm(true); }}
            />
            {showForm && (
                <Paper sx={{ mt: 2, p: 2 }}>
                    <ClientForm
                        item={editing}
                        onSaved={() => setShowForm(false)}
                        onCancel={() => setShowForm(false)}
                    />
                </Paper>
            )}
        </div>
    );
}