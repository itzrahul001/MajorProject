import { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, CardActions, Button, Grid, CircularProgress, Modal, Box, TextField } from '@mui/material';
import api from '../services/api';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    // Mock user id again
    const patientId = 1;

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await api.get('/doctors');
            setDoctors(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleBook = (doctor) => {
        setSelectedDoctor(doctor);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedDoctor(null);
    };

    const confirmBooking = async () => {
        try {
            await api.post('/appointments', {
                patientId: patientId,
                doctorId: selectedDoctor.id,
                date: appointmentDate,
                time: appointmentTime
            });
            alert('Appointment Booked Successfully!');
            handleClose();
        } catch (error) {
            alert('Booking Failed');
            console.error(error);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>Find Doctors</Typography>
            {loading ? <CircularProgress /> : (
                <Grid container spacing={3}>
                    {doctors.map(doctor => (
                        <Grid item xs={12} md={4} key={doctor.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{doctor.name}</Typography>
                                    <Typography color="textSecondary">{doctor.specialization}</Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" variant="contained" onClick={() => handleBook(doctor)}>Book Appointment</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Modal open={open} onClose={handleClose}>
                <Box sx={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4
                }}>
                    <Typography variant="h6" component="h2">
                        Book Appointment with {selectedDoctor?.name}
                    </Typography>
                    <TextField
                        type="date"
                        fullWidth
                        margin="normal"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                    />
                    <TextField
                        type="time"
                        fullWidth
                        margin="normal"
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                    />
                    <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={confirmBooking}>
                        Confirm Booking
                    </Button>
                </Box>
            </Modal>
        </Container>
    );
};

export default Doctors;
