import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Emergency from './pages/Emergency'
import Appointments from './pages/Appointments'
import Doctors from './pages/Doctors'
import MedicalRecords from './pages/MedicalRecords'
import AddHospital from './pages/AddHospital'
import AddDoctor from './pages/AddDoctor'
import { AuthProvider } from './context/AuthContext'

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <AuthProvider>
                <BrowserRouter>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<h1>Home Page - Smart Healthcare</h1>} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/emergency" element={<Emergency />} />
                        <Route path="/appointments" element={<Appointments />} />
                        <Route path="/doctors" element={<Doctors />} />
                        <Route path="/medical-records" element={<MedicalRecords />} />
                        <Route path="/add-hospital" element={<AddHospital />} />
                        <Route path="/add-doctor" element={<AddDoctor />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    )
}

export default App
