import api from './api';

const AuthService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.accessToken) {
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('role', response.data.role);
        }
        return response.data;
    },

    register: async (name, email, password, role) => {
        return api.post('/auth/register', { name, email, password, role });
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    },

    getCurrentUser: () => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        return token ? { token, role } : null;
    },
};

export default AuthService;
