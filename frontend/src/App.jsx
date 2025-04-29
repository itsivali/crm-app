import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Button,
    Container,
    CssBaseline,
    IconButton,
    Box
} from '@mui/material';
import {
    Brightness4 as DarkModeIcon,
    Brightness7 as LightModeIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Services from './pages/Services';
import Invoices from './pages/Invoices';
import Receipts from './pages/Receipts';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#2196f3',
            light: '#64b5f6',
            dark: '#1976d2'
        },
        secondary: {
            main: '#f50057',
            light: '#ff4081',
            dark: '#c51162'
        }
    },
    shape: {
        borderRadius: 8
    },
    shadows: [
        'none',
        '0px 2px 1px -1px rgba(0,0,0,0.1),0px 1px 1px 0px rgba(0,0,0,0.07),0px 1px 3px 0px rgba(0,0,0,0.06)',
        '0px 3px 3px -2px rgba(0,0,0,0.1),0px 2px 4px 0px rgba(0,0,0,0.07),0px 1px 8px 0px rgba(0,0,0,0.06)',
        '0px 3px 4px -2px rgba(0,0,0,0.1),0px 3px 5px 0px rgba(0,0,0,0.07),0px 1px 10px 0px rgba(0,0,0,0.06)',
        '0px 4px 5px -2px rgba(0,0,0,0.1),0px 4px 6px 0px rgba(0,0,0,0.07),0px 1px 12px 0px rgba(0,0,0,0.06)',
        '0px 5px 6px -3px rgba(0,0,0,0.1),0px 5px 7px 0px rgba(0,0,0,0.07),0px 1px 14px 0px rgba(0,0,0,0.06)',
        '0px 6px 7px -4px rgba(0,0,0,0.1),0px 6px 8px 0px rgba(0,0,0,0.07),0px 1px 16px 0px rgba(0,0,0,0.06)',
        '0px 7px 8px -4px rgba(0,0,0,0.1),0px 7px 9px 1px rgba(0,0,0,0.07),0px 2px 18px 1px rgba(0,0,0,0.06)',
        '0px 8px 9px -5px rgba(0,0,0,0.1),0px 8px 10px 1px rgba(0,0,0,0.07),0px 3px 20px 2px rgba(0,0,0,0.06)',
        '0px 9px 10px -6px rgba(0,0,0,0.1),0px 9px 11px 1px rgba(0,0,0,0.07),0px 3px 22px 2px rgba(0,0,0,0.06)',
        '0px 10px 11px -7px rgba(0,0,0,0.1),0px 10px 12px 1px rgba(0,0,0,0.07),0px 4px 24px 2px rgba(0,0,0,0.06)',
        '0px 11px 12px -7px rgba(0,0,0,0.1),0px 11px 13px 1px rgba(0,0,0,0.07),0px 4px 26px 2px rgba(0,0,0,0.06)',
        '0px 12px 13px -8px rgba(0,0,0,0.1),0px 12px 14px 1px rgba(0,0,0,0.07),0px 5px 28px 2px rgba(0,0,0,0.06)',
    ]
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9',
            light: '#b3e5fc',
            dark: '#42a5f5'
        },
        secondary: {
            main: '#f48fb1',
            light: '#f8bbd0',
            dark: '#ec407a'
        },
        background: {
            default: '#303030',
            paper: '#424242'
        }
    },
    shape: {
        borderRadius: 8
    }
});

function App() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const theme = isDarkMode ? darkTheme : lightTheme;

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <AppBar
                    position="static"
                    elevation={3}
                    sx={{
                        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                    }}
                >
                    <Toolbar sx={{ gap: 2 }}>
                        <Button color="inherit" href="/">Dashboard</Button>
                        <Button color="inherit" href="/clients">Clients</Button>
                        <Button color="inherit" href="/services">Services</Button>
                        <Button color="inherit" href="/invoices">Invoices</Button>
                        <Button color="inherit" href="/receipts">Receipts</Button>
                        <Box sx={{ flexGrow: 1 }} />
                        <IconButton
                            color="inherit"
                            onClick={() => setIsDarkMode(!isDarkMode)}
                        >
                            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Container sx={{ mt: 4 }}>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/clients" element={<Clients />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/invoices" element={<Invoices />} />
                        <Route path="/receipts" element={<Receipts />} />
                    </Routes>
                </Container>
            </Router>
        </ThemeProvider>
    );
}

export default App;