import { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Welcome to Dashboard
            </Typography>
            <Grid container spacing={3}>
                {/* Chart */}
                <Grid item xs={12} md={4}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 240,
                        }}
                    >
                        <Typography variant="h6">Appointments</Typography>
                        <Box sx={{ mt: 2 }}>
                            <Button variant="contained" component={Link} to="/appointments">View Appointments</Button>
                        </Box>
                    </Paper>
                </Grid>

                {/* Recent Deposits */}
                <Grid item xs={12} md={4}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 240,
                        }}
                    >
                        <Typography variant="h6">Find Doctors</Typography>
                        <Box sx={{ mt: 2 }}>
                            <Button variant="contained" color="secondary" component={Link} to="/doctors">Search Doctors</Button>
                        </Box>
                    </Paper>
                </Grid>

                {/* Recent Orders */}
                <Grid item xs={12} md={4}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 240,
                        }}
                    >
                        <Typography variant="h6">Medical Records</Typography>
                        <Box sx={{ mt: 2 }}>
                            <Button variant="contained" color="success" component={Link} to="/medical-records">My Records</Button>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="h5" color="error" gutterBottom>
                            Emergency?
                        </Typography>
                        <Button variant="contained" color="error" size="large" component={Link} to="/emergency">
                            Find Nearest Hospital
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;
