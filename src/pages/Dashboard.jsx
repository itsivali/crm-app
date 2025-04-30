import React, { useState, useEffect } from 'react';
import { 
    Paper, 
    Grid, 
    Typography, 
    List, 
    ListItem, 
    ListItemText, 
    ListItemSecondaryAction,
    IconButton,
    Chip,
    Box,
    Divider,
    Card,
    CardContent,
    Stack
} from '@mui/material';
import {
    Receipt as InvoiceIcon,
    Group as ClientIcon,
    Build as ServiceIcon,
    ArrowForward as ArrowIcon,
    AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { fetchClients, fetchServices, fetchInvoices } from '../api';

export default function Dashboard() {
    const [clients, setClients] = useState([]);
    const [services, setServices] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const [clientsRes, servicesRes, invoicesRes] = await Promise.all([
                    fetchClients(),
                    fetchServices(),
                    fetchInvoices()
                ]);
                setClients(clientsRes.data.slice(0, 5));
                setServices(servicesRes.data.slice(0, 5));
                setInvoices(invoicesRes.data.slice(0, 5));
            } catch (error) {
                console.error('Error loading dashboard data:', error);
            }
        };
        loadData();
    }, []);

    const StatCard = ({ title, value, icon, color }) => (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{ 
                        p: 2, 
                        borderRadius: 2, 
                        bgcolor: `${color}.light`,
                        color: `${color}.dark`
                    }}>
                        {icon}
                    </Box>
                    <Box>
                        <Typography color="textSecondary" variant="subtitle2">
                            {title}
                        </Typography>
                        <Typography variant="h4">
                            {value}
                        </Typography>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                    Dashboard
                </Typography>
            </Grid>

            {/* Stats Cards */}
            <Grid item xs={12} sm={6} md={3}>
                <StatCard 
                    title="Total Clients" 
                    value={clients.length}
                    icon={<ClientIcon />}
                    color="primary"
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard 
                    title="Active Services" 
                    value={services.length}
                    icon={<ServiceIcon />}
                    color="success"
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard 
                    title="Open Invoices" 
                    value={invoices.filter(inv => inv.status !== 'PAID').length}
                    icon={<InvoiceIcon />}
                    color="warning"
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard 
                    title="Total Revenue" 
                    value={`$${invoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0).toFixed(2)}`}
                    icon={<MoneyIcon />}
                    color="info"
                />
            </Grid>

            {/* Recent Lists */}
            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Recent Invoices</Typography>
                        <IconButton onClick={() => navigate('/invoices')}>
                            <ArrowIcon />
                        </IconButton>
                    </Box>
                    <List>
                        {invoices.map((invoice, index) => (
                            <React.Fragment key={invoice._id}>
                                <ListItem>
                                    <ListItemText
                                        primary={`Invoice #${invoice.invoice_number}`}
                                        secondary={new Date(invoice.date_issued).toLocaleDateString()}
                                    />
                                    <ListItemSecondaryAction>
                                        <Chip
                                            label={`$${invoice.total_amount}`}
                                            color={invoice.status === 'PAID' ? 'success' : 'warning'}
                                            size="small"
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                                {index < invoices.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Recent Clients</Typography>
                        <IconButton onClick={() => navigate('/clients')}>
                            <ArrowIcon />
                        </IconButton>
                    </Box>
                    <List>
                        {clients.map((client, index) => (
                            <React.Fragment key={client._id}>
                                <ListItem>
                                    <ListItemText
                                        primary={client.name}
                                        secondary={client.company}
                                    />
                                    <ListItemSecondaryAction>
                                        <Chip
                                            label={client.email}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                                {index < clients.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>
            </Grid>

            <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Active Services</Typography>
                        <IconButton onClick={() => navigate('/services')}>
                            <ArrowIcon />
                        </IconButton>
                    </Box>
                    <Grid container spacing={2}>
                        {services.map(service => (
                            <Grid item xs={12} sm={6} md={4} key={service._id}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            {service.sku}
                                        </Typography>
                                        <Typography color="textSecondary" gutterBottom>
                                            {service.description}
                                        </Typography>
                                        <Typography variant="h5" color="primary">
                                            ${service.unit_price}
                                        </Typography>
                                        <Chip 
                                            label={`${service.tax_rate}% Tax`}
                                            size="small"
                                            sx={{ mt: 1 }}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    );
}