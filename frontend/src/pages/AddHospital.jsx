import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Alert, Grid } from '@mui/material';
import { toast } from 'react-toastify';
import api from '../services/api';

const AddHospital = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        latitude: '',
        longitude: '',
        totalBeds: '',
        availableBeds: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/hospitals', {
                ...formData,
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude),
                totalBeds: parseInt(formData.totalBeds),
                availableBeds: parseInt(formData.availableBeds)
            });
            toast.success('Hospital Added Successfully!');
            navigate('/dashboard'); // or wherever you want to redirect
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.message || err.response?.data || 'Failed to add hospital.';
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Add New Hospital
                </Typography>
                {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Hospital Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Location (Address)"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                required
                                fullWidth
                                label="Latitude"
                                name="latitude"
                                type="number"
                                inputProps={{ step: "any" }}
                                value={formData.latitude}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                required
                                fullWidth
                                label="Longitude"
                                name="longitude"
                                type="number"
                                inputProps={{ step: "any" }}
                                value={formData.longitude}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                required
                                fullWidth
                                label="Total Beds"
                                name="totalBeds"
                                type="number"
                                value={formData.totalBeds}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                required
                                fullWidth
                                label="Available Beds"
                                name="availableBeds"
                                type="number"
                                value={formData.availableBeds}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Add Hospital
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default AddHospital;
