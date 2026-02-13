import { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Paper, Button, Chip } from '@mui/material';
import api from '../services/api';

import { useAuth } from '../context/AuthContext';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        if (user && user.id) {
            fetchAppointments();
        }
    }, [user]);

    const fetchAppointments = async () => {
        try {
            const response = await api.get(`/appointments/patient/${user.id}`);
            setAppointments(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCancel = async (id) => {
        try {
            await api.put(`/appointments/${id}/cancel`);
            fetchAppointments();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>My Appointments</Typography>
            <Paper>
                <List>
                    {appointments.map(apt => (
                        <ListItem key={apt.id} divider secondaryAction={
                            apt.status === 'BOOKED' && <Button color="error" onClick={() => handleCancel(apt.id)}>Cancel</Button>
                        }>
                            <ListItemText
                                primary={`Dr. ${apt.doctorName}`}
                                secondary={`Date: ${apt.date} Time: ${apt.time}`}
                            />
                            <Chip label={apt.status} color={apt.status === 'BOOKED' ? 'primary' : apt.status === 'CANCELLED' ? 'error' : 'success'} />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
};

export default Appointments;
