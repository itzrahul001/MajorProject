import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TextField, Button, Container, Typography, Box, Alert, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { toast } from 'react-toastify';
import api from '../services/api';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('PATIENT');
    const [hospitalId, setHospitalId] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [hospitals, setHospitals] = useState([]);
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();


    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const response = await api.get('/hospitals');
                setHospitals(response.data);
            } catch (err) {
                console.error('Failed to fetch hospitals:', err);
            }
        };
        fetchHospitals();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(name, email, password, role, hospitalId || null, specialization || null);
            toast.success('Registration Successful! Please Login.');
            navigate('/login');
        } catch (err) {
            // Extract the error message from the backend response, if available
            const errorMessage = err.response?.data?.message || err.response?.data || 'Registration failed. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Sign Up
                </Typography>
                {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Full Name"
                        name="name"
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        select
                        name="role"
                        label="Role"
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <MenuItem value="PATIENT">Patient</MenuItem>
                        <MenuItem value="DOCTOR">Doctor</MenuItem>
                        <MenuItem value="ADMIN">Admin</MenuItem>
                    </TextField>
                    {role === 'DOCTOR' && (
                        <>
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
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="specialization"
                                label="Specialization"
                                name="specialization"
                                value={specialization}
                                onChange={(e) => setSpecialization(e.target.value)}
                            />
                        </>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>
                    <Link to="/login" variant="body2">
                        {"Already have an account? Sign In"}
                    </Link>
                </Box>
            </Box>
        </Container>
    );
};

export default Register;
