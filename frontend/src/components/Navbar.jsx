import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
                    Smart Healthcare
                </Typography>
                <Box>
                    {user ? (
                        <>
                            <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
                            {/* Add more links based on role if needed */}
                            {user.role === 'ROLE_ADMIN' && (
                                <Button color="inherit" component={Link} to="/add-hospital">Add Hospital</Button>
                            )}
                            <Button color="inherit" component={Link} to="/emergency">Emergency</Button>
                            <Button color="inherit" onClick={handleLogout}>Logout</Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={Link} to="/login">Login</Button>
                            <Button color="inherit" component={Link} to="/register">Register</Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
