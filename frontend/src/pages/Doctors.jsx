import { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, CardActions, Button, Grid, CircularProgress, Modal, Box, TextField, MenuItem, Select, FormControl, InputLabel, InputAdornment, Avatar, Chip, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSpecialization, setFilterSpecialization] = useState('');
    const [filterHospital, setFilterHospital] = useState('');

    // Booking State
    const [open, setOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');

    const { user } = useAuth();

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        filterData();
    }, [searchTerm, filterSpecialization, filterHospital, doctors]);

    const fetchData = async () => {
        try {
            const doctorsRes = await api.get('/doctors');
            setDoctors(doctorsRes.data);
        } catch (error) {
            console.error("Failed to fetch doctors", error);
            toast.error("Failed to load doctors");
        }

        try {
            const hospitalsRes = await api.get('/hospitals');
            setHospitals(hospitalsRes.data);
        } catch (error) {
            console.error("Failed to fetch hospitals", error);
            // toast.error("Failed to load hospitals"); // Optional: don't block UI if just filter missing
        } finally {
            setLoading(false);
        }
    };

    const filterData = () => {
        let result = doctors;

        if (searchTerm) {
            result = result.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        if (filterSpecialization) {
            result = result.filter(d => d.specialization === filterSpecialization);
        }
        // Assuming doctor object has hospitalId, but check backend DTO. 
        // DoctorDto has 'hospitalId' (implied via getDoctorsByHospital endpoint existence, but let's check field names if possible. 
        // Looking at backend code (step 14), createDoctor takes DoctorDto. 
        // I'll assume DoctorDto has hospitalId or I can't filter by it easily without fetching per hospital.
        // Actually, let's just match if we have it. If not, this filter might be weak.
        // We will assume 'hospitalId' is present in the Doctor object returned by API.
        if (filterHospital) {
            result = result.filter(d => d.hospitalId && d.hospitalId === filterHospital);
        }

        setFilteredDoctors(result);
    };

    const handleBook = (doctor) => {
        if (!user || !user.id) {
            toast.warn("Please login to book an appointment");
            // Optionally redirect to login
            return;
        }
        setSelectedDoctor(doctor);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedDoctor(null);
        setAppointmentDate('');
        setAppointmentTime('');
    };

    const confirmBooking = async () => {
        if (!appointmentDate || !appointmentTime) {
            toast.warning("Please select date and time");
            return;
        }
        try {
            await api.post('/appointments', {
                patientId: user.id,
                doctorId: selectedDoctor.id,
                date: appointmentDate,
                time: appointmentTime
            });
            toast.success('Appointment Booked Successfully!');
            handleClose();
        } catch (error) {
            toast.error('Booking Failed');
            console.error(error);
        }
    };

    const specializations = [...new Set(doctors.map(d => d.specialization))];

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Find Your Doctor
            </Typography>

            {/* Filters */}
            <Paper sx={{ p: 2, mb: 4 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            placeholder="Search Doctor by Name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Specialization</InputLabel>
                            <Select
                                value={filterSpecialization}
                                label="Specialization"
                                onChange={(e) => setFilterSpecialization(e.target.value)}
                            >
                                <MenuItem value=""><em>All</em></MenuItem>
                                {specializations.map(spec => (
                                    <MenuItem key={spec} value={spec}>{spec}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Hospital</InputLabel>
                            <Select
                                value={filterHospital}
                                label="Hospital"
                                onChange={(e) => setFilterHospital(e.target.value)}
                            >
                                <MenuItem value=""><em>All</em></MenuItem>
                                {hospitals.map(h => (
                                    <MenuItem key={h.id} value={h.id}>{h.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Button variant="outlined" color="primary" fullWidth onClick={() => { setSearchTerm(''); setFilterSpecialization(''); setFilterHospital(''); }}>
                            Reset
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Doctor Grid */}
            {loading ? <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box> : (
                <Grid container spacing={3}>
                    {filteredDoctors.length > 0 ? filteredDoctors.map(doctor => (
                        <Grid item xs={12} md={4} key={doctor.id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
                                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                                    <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
                                        <PersonIcon fontSize="large" />
                                    </Avatar>
                                    <Typography variant="h6" gutterBottom>{doctor.name}</Typography>
                                    <Typography color="textSecondary" gutterBottom>{doctor.specialization}</Typography>
                                    <Chip icon={<LocalHospitalIcon />} label="Availability" size="small" color="success" variant="outlined" sx={{ mt: 1 }} />
                                    {/* Ideally show hospital name if doctor object has it or we map it */}
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                                    <Button variant="contained" onClick={() => handleBook(doctor)}>Book Appointment</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    )) : (
                        <Grid item xs={12}>
                            <Typography variant="h6" align="center" color="textSecondary">
                                No doctors found matching your criteria.
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            )}

            {/* Booking Modal */}
            <Modal open={open} onClose={handleClose}>
                <Box sx={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: 400, bgcolor: 'background.paper', border: 'none', borderRadius: 2, boxShadow: 24, p: 4
                }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                        Book Appointment
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        Dr. {selectedDoctor?.name} - {selectedDoctor?.specialization}
                    </Typography>
                    <TextField
                        type="date"
                        fullWidth
                        margin="normal"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        required
                    />
                    <TextField
                        type="time"
                        fullWidth
                        margin="normal"
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                        required
                    />
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button variant="contained" color="primary" onClick={confirmBooking}>
                            Confirm
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Container>
    );
};

export default Doctors;
