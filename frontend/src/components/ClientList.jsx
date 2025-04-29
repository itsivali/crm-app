import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
    Box,
    Typography,
    Button,
    Alert,
    Snackbar
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import { fetchClients, deleteClient } from '../api';

export default function ClientList({ onEdit, onAdd }) {
    const [clients, setClients] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        try {
            const res = await fetchClients();
            setClients(res.data);
        } catch (err) {
            setError('Failed to load clients');
            console.error('Error loading clients:', err);
        }
    };

    const handleDelete = async (clientId) => {
        try {
            await deleteClient(clientId);
            await load(); // Reload the list after deletion
            setSuccess('Client deleted successfully');
        } catch (err) {
            setError('Failed to delete client');
            console.error('Error deleting client:', err);
        }
    };

    return (
        <>
            <Paper elevation={3} sx={{ p: 2 }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3
                }}>
                    <Typography variant="h6" color="primary">
                        Client List
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={onAdd}
                        startIcon={<PersonAddIcon />}
                        sx={{
                            background: theme => `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                            boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                        }}
                    >
                        Add Client
                    </Button>
                </Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Company</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {clients.map(client => (
                            <TableRow
                                key={client._id}
                                hover
                                sx={{
                                    '&:last-child td, &:last-child th': { border: 0 }
                                }}
                            >
                                <TableCell>{client.name}</TableCell>
                                <TableCell>{client.company}</TableCell>
                                <TableCell>{client.email}</TableCell>
                                <TableCell>{client.phone}</TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Edit">
                                        <IconButton
                                            color="primary"
                                            onClick={() => onEdit(client)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDelete(client._id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <Snackbar
                open={!!error || !!success}
                autoHideDuration={6000}
                onClose={() => {
                    setError(null);
                    setSuccess('');
                }}
            >
                <Alert
                    severity={error ? "error" : "success"}
                    sx={{ width: '100%' }}
                >
                    {error || success}
                </Alert>
            </Snackbar>
        </>
    );
}