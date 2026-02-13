import { useState, useEffect } from 'react';
import { Container, Typography, Button, Paper, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';
import api from '../services/api';

const Emergency = () => {
    const [loading, setLoading] = useState(false);
    const [hospitals, setHospitals] = useState([]);
    const [error, setError] = useState('');
    const [location, setLocation] = useState(null);

    const getLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                });
                findNearestHospitals(position.coords.latitude, position.coords.longitude);
            },
            () => {
                setError('Unable to retrieve your location');
                setLoading(false);
            }
        );
    };

    const findNearestHospitals = async (lat, lon) => {
        try {
            // Default radius 10km
            const response = await api.get(`/hospitals/find-nearest?lat=${lat}&lon=${lon}&radius=50`);
            setHospitals(response.data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch hospitals');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" color="error" gutterBottom align="center">
                Emergency: Find Nearest Hospital
            </Typography>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <Button variant="contained" color="error" size="large" onClick={getLocation} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Find Hospitals Near Me'}
                </Button>
            </div>

            {error && <Alert severity="error">{error}</Alert>}

            {hospitals.length > 0 && (
                <Paper elevation={3}>
                    <List>
                        {hospitals.map((hospital) => (
                            <ListItem key={hospital.id} divider>
                                <ListItemText
                                    primary={hospital.name}
                                    secondary={
                                        <>
                                            <Typography component="span" variant="body2" color="text.primary">
                                                {hospital.location}
                                            </Typography>
                                            <br />
                                            {`Available Beds: ${hospital.availableBeds} / ${hospital.totalBeds}`}
                                            <br />
                                            <a
                                                href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ color: '#90caf9' }}
                                            >
                                                Get Directions (Google Maps)
                                            </a>
                                        </>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}
        </Container>
    );
};

export default Emergency;
