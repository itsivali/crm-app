import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    Paper
} from '@mui/material';
import { fetchServices, deleteService } from '../api';

export default function ServiceList({ onEdit, onAdd }) {
    const [items, setItems] = useState([]);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        const res = await fetchServices();
        setItems(res.data);
    };

    return (
        <Paper>
            <Button
                variant="contained"
                color="primary"
                onClick={onAdd}
                sx={{ m: 2 }}
            >
                Add Service
            </Button>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>SKU</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map(s => (
                        <TableRow key={s.id}>
                            <TableCell>{s.sku}</TableCell>
                            <TableCell>{s.description}</TableCell>
                            <TableCell>{s.unit_price}</TableCell>
                            <TableCell>
                                <Button
                                    color="primary"
                                    onClick={() => onEdit(s)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    color="error"
                                    onClick={async () => {
                                        await deleteService(s.id);
                                        load();
                                    }}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}