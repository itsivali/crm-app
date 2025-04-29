import React, { useState, useRef } from 'react';
import {
    Typography,
    Paper,
    Container,
    IconButton,
    useTheme
} from '@mui/material';
import ClientList from '../components/ClientList';
import ClientForm from '../components/ClientForm';
import { Add as AddIcon } from '@mui/icons-material';

export default function Clients() {
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const theme = useTheme();
    const listRef = useRef();

    const handleSaved = async () => {
        setShowForm(false);
        if (listRef.current?.load) {
            await listRef.current.load();
        }
    };

    return (
        <Container maxWidth="lg">
            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    background: theme.palette.background.paper,
                    borderRadius: 2
                }}
            >
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        color: theme.palette.primary.main,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    Clients
                    <IconButton
                        color="primary"
                        onClick={() => { setEditing(null); setShowForm(true); }}
                        sx={{
                            backgroundColor: theme.palette.primary.light,
                            '&:hover': {
                                backgroundColor: theme.palette.primary.main,
                                color: 'white'
                            }
                        }}
                    >
                        <AddIcon />
                    </IconButton>
                </Typography>

                <ClientList
                    ref={listRef}
                    onAdd={() => { setEditing(null); setShowForm(true); }}
                    onEdit={c => { setEditing(c); setShowForm(true); }}
                />

                {showForm && (
                    <Paper
                        elevation={4}
                        sx={{
                            mt: 4,
                            p: 3,
                            backdropFilter: 'blur(10px)',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: 2
                        }}
                    >
                        <ClientForm
                            client={editing}
                            onSaved={handleSaved}
                            onCancel={() => setShowForm(false)}
                        />
                    </Paper>
                )}
            </Paper>
        </Container>
    );
}