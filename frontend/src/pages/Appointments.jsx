import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Calendar, Clock, User } from 'lucide-react';

const Appointments = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

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
            console.error('Error fetching appointments', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-4xl font-bold gradient-text mb-2">My Appointments</h1>
                    <p className="text-muted-foreground text-lg">View and manage your upcoming appointments</p>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                    </div>
                ) : appointments.length === 0 ? (
                    <Card className="border-2">
                        <CardContent className="text-center py-12">
                            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <p className="text-xl text-muted-foreground">No appointments found</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {appointments.map((appointment) => (
                            <Card key={appointment.id} className="border-2 hover:shadow-lg transition-all">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="flex items-center gap-2">
                                                <User className="h-5 w-5" />
                                                Dr. {appointment.doctorName}
                                            </CardTitle>
                                            <CardDescription className="flex items-center gap-4 mt-2">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    {appointment.date}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    {appointment.time}
                                                </span>
                                            </CardDescription>
                                        </div>
                                        <Badge variant={appointment.status === 'BOOKED' ? 'default' : 'secondary'}>
                                            {appointment.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Appointments;
