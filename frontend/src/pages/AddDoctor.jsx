import { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, MenuItem, FormControl, InputLabel, Select, Alert } from '@mui/material';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddDoctor = () => {
    const [name, setName] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [hospitalId, setHospitalId] = useState('');
    const [hospitals, setHospitals] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const response = await api.get('/hospitals');
                setHospitals(response.data);
            } catch (err) {
                console.error(err);
                toast.error('Failed to fetch hospitals');
            }
        };
        fetchHospitals();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!hospitalId) {
            setError('Please select a hospital');
            setLoading(false);
            return;
        }

        try {
            await api.post('/doctors', {
                name,
                specialization,
                hospitalId
            });
            toast.success('Doctor added successfully');
            navigate('/doctors');
        } catch (err) {
            console.error(err);
            setError('Failed to add doctor');
            toast.error('Failed to add doctor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>Add New Doctor</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <TextField
                    label="Doctor Name"
                    fullWidth
                    margin="normal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <TextField
                    label="Specialization"
                    fullWidth
                    margin="normal"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    required
                />
                <FormControl fullWidth margin="normal" required>
                    <InputLabel>Hospital</InputLabel>
                    <Select
                        value={hospitalId}
                        label="Hospital"
                        onChange={(e) => setHospitalId(e.target.value)}
                    >
                        {hospitals.map((hospital) => (
                            <MenuItem key={hospital.id} value={hospital.id}>
                                {hospital.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                    disabled={loading}
                >
                    {loading ? 'Adding...' : 'Add Doctor'}
                </Button>
            </Box>
        </Container>
    );
};

export default AddDoctor;
