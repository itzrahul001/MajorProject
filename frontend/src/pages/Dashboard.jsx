import { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, Button, Box, Card, CardContent, CardActions, Avatar, Divider, List, ListItem, ListItemText, Chip } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EventIcon from '@mui/icons-material/Event';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PersonIcon from '@mui/icons-material/Person';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.id) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const [appointmentsRes, doctorsRes] = await Promise.all([
                api.get(`/appointments/patient/${user.id}`),
                api.get('/doctors')
            ]);
            setAppointments(appointmentsRes.data);
            setDoctors(doctorsRes.data.slice(0, 3)); // Show top 3 doctors
        } catch (error) {
            console.error("Error fetching dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                        Welcome, {user?.name || 'Patient'}!
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Here's your health overview.
                    </Typography>
                </Box>
                <Button variant="contained" color="error" startIcon={<LocalHospitalIcon />} component={Link} to="/emergency" size="large">
                    Emergency
                </Button>
            </Box>

            <Grid container spacing={3}>
                {/* Stats / Quick Cards */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 180, bgcolor: '#e3f2fd' }}>
                        <Typography variant="h6" color="primary" gutterBottom>Upcoming Appointments</Typography>
                        <Typography variant="h3" sx={{ fontWeight: 'bold', my: 2 }}>{appointments.filter(a => a.status === 'BOOKED').length}</Typography>
                        <Button size="small" component={Link} to="/appointments">View All</Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 180, bgcolor: '#f3e5f5' }}>
                        <Typography variant="h6" color="secondary" gutterBottom>Medical Records</Typography>
                        <Typography variant="h3" sx={{ fontWeight: 'bold', my: 2 }}>--</Typography> {/* Placeholder if no API yet */}
                        <Button size="small" color="secondary" component={Link} to="/medical-records">Upload / View</Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 180, bgcolor: '#e8f5e9' }}>
                        <Typography variant="h6" color="success.main" gutterBottom>Find Doctors</Typography>
                        <Typography variant="body1" sx={{ my: 2 }}>Search by name or specialization.</Typography>
                        <Button variant="outlined" color="success" component={Link} to="/doctors">Search Now</Button>
                    </Paper>
                </Grid>

                {/* Main Content: Upcoming Appointments */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                            <EventIcon sx={{ mr: 1 }} /> Upcoming Appointments
                        </Typography>
                        <Divider />
                        {appointments.length === 0 ? (
                            <Box sx={{ p: 3, textAlign: 'center' }}>
                                <Typography color="text.secondary">No upcoming appointments.</Typography>
                                <Button sx={{ mt: 2 }} variant="contained" component={Link} to="/doctors">Book Appointment</Button>
                            </Box>
                        ) : (
                            <List>
                                {appointments.slice(0, 3).map((apt) => (
                                    <ListItem key={apt.id} divider>
                                        <ListItemText
                                            primary={`Dr. ${apt.doctorName}`}
                                            secondary={`Date: ${apt.date} | Time: ${apt.time}`}
                                        />
                                        <Chip label={apt.status} color={apt.status === 'BOOKED' ? 'primary' : 'default'} size="small" />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                        {appointments.length > 0 && (
                            <Button sx={{ mt: 1 }} component={Link} to="/appointments">View All Appointments</Button>
                        )}
                    </Paper>
                </Grid>

                {/* Sidebar: Top Doctors */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                            <PersonIcon sx={{ mr: 1 }} /> Top Doctors
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2}>
                            {doctors.map((doctor) => (
                                <Grid item xs={12} key={doctor.id}>
                                    <Card variant="outlined">
                                        <CardContent sx={{ pb: 1 }}>
                                            <Typography variant="subtitle1" component="div">
                                                {doctor.name}
                                            </Typography>
                                            <Typography sx={{ mb: 1.5 }} color="text.secondary" variant="body2">
                                                {doctor.specialization}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small" component={Link} to="/doctors">Book</Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                        <Button sx={{ mt: 2 }} variant="outlined" fullWidth component={Link} to="/doctors">View All Doctors</Button>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;
