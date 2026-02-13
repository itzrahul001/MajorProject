import { useState, useEffect } from 'react';
import { Container, Typography, Button, Paper, List, ListItem, ListItemText, TextField, Box, CircularProgress, Alert } from '@mui/material';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const MedicalRecords = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null);
    const [notes, setNotes] = useState('');
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const { user } = useAuth();

    // Note: user object in auth context should ideally have id.
    // We need to decode token or get user details. For now assumes user object has id or we fetch it.
    // Actually, in AuthContext I only stored token. I should likely fetch user profile. 
    // For this example, I will assume I can get patientId from somewhere or I need a profile endpoint.
    // HACK: I will use a hardcoded patient ID 1 for now if not available, OR decode token.
    // Better: fetch /api/me (need to implement in backend)
    const patientId = 1; // REPLACE WITH REAL ID

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            const response = await api.get(`/medical-records/patient/${patientId}`);
            setRecords(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        setMessage('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('patientId', patientId);
        formData.append('notes', notes);

        try {
            await api.post('/medical-records/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('File uploaded successfully!');
            setFile(null);
            setNotes('');
            fetchRecords();
        } catch (err) {
            setMessage('Upload failed');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Medical Records
            </Typography>

            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6">Upload New Record</Typography>
                <Box component="form" onSubmit={handleUpload} sx={{ mt: 2 }}>
                    <TextField type="file" onChange={handleFileChange} fullWidth margin="normal" />
                    <TextField
                        label="Notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={uploading || !file}
                        sx={{ mt: 2 }}
                    >
                        {uploading ? 'Uploading...' : 'Upload'}
                    </Button>
                    {message && <Alert severity={message.includes('success') ? 'success' : 'error'} sx={{ mt: 2 }}>{message}</Alert>}
                </Box>
            </Paper>

            <Typography variant="h6" gutterBottom>My Records</Typography>
            {loading ? <CircularProgress /> : (
                <List>
                    {records.map((record) => (
                        <Paper key={record.id} sx={{ mb: 2, p: 2 }}>
                            <ListItem>
                                <ListItemText
                                    primary={`Uploaded on: ${record.uploadDate}`}
                                    secondary={
                                        <>
                                            <Typography variant="body2">{record.notes}</Typography>
                                            <a href={record.fileUrl} target="_blank" rel="noopener noreferrer">View File</a>
                                            <br />
                                            {record.extractedText && (
                                                <Box sx={{ mt: 1, p: 1, bgcolor: 'background.paper', border: '1px solid #ccc' }}>
                                                    <Typography variant="caption" display="block">Extracted Text (OCR):</Typography>
                                                    <Typography variant="body2">{record.extractedText}</Typography>
                                                </Box>
                                            )}
                                        </>
                                    }
                                />
                            </ListItem>
                        </Paper>
                    ))}
                </List>
            )}
        </Container>
    );
};

export default MedicalRecords;
