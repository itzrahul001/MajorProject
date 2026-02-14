import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Calendar, Users, FileText, AlertCircle, TrendingUp, Activity, Clock, Stethoscope } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.id) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const [appointmentsRes, doctorsRes] = await Promise.all([
                api.get(`/appointments/patient/${user.id}`),
                api.get('/doctors')
            ]);
            setAppointments(appointmentsRes.data);
            setDoctors(doctorsRes.data.slice(0, 3));
        } catch (error) {
            console.error("Error fetching dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        {
            title: "Upcoming Appointments",
            value: appointments.filter(a => a.status === 'BOOKED').length,
            icon: Calendar,
            color: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-950/20",
            link: "/appointments"
        },
        {
            title: "Medical Records",
            value: "--",
            icon: FileText,
            color: "text-purple-600",
            bgColor: "bg-purple-50 dark:bg-purple-950/20",
            link: "/medical-records"
        },
        {
            title: "Available Doctors",
            value: doctors.length,
            icon: Users,
            color: "text-green-600",
            bgColor: "bg-green-50 dark:bg-green-950/20",
            link: "/doctors"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-bold gradient-text mb-2">
                            Welcome back, {user?.name || 'User'}!
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Here's your health overview for today
                        </p>
                    </div>
                    <Link to="/emergency">
                        <Button variant="destructive" size="lg" className="gap-2">
                            <AlertCircle className="h-5 w-5" />
                            Emergency
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, index) => (
                        <Link key={index} to={stat.link}>
                            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-2">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {stat.title}
                                    </CardTitle>
                                    <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">{stat.value}</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Click to view details
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Appointments Section */}
                    <Card className="lg:col-span-2 border-2">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-primary" />
                                <CardTitle>Upcoming Appointments</CardTitle>
                            </div>
                            <CardDescription>
                                Your scheduled medical appointments
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {appointments.length === 0 ? (
                                <div className="text-center py-12">
                                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground mb-4">No upcoming appointments</p>
                                    <Link to="/doctors">
                                        <Button>Book Appointment</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {appointments.slice(0, 3).map((apt) => (
                                        <div key={apt.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-primary/10 rounded-full">
                                                    <Stethoscope className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold">Dr. {apt.doctorName}</p>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Clock className="h-3 w-3" />
                                                        <span>{apt.date} at {apt.time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge variant={apt.status === 'BOOKED' ? 'default' : 'secondary'}>
                                                {apt.status}
                                            </Badge>
                                        </div>
                                    ))}
                                    <Link to="/appointments">
                                        <Button variant="outline" className="w-full">View All Appointments</Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Top Doctors Section */}
                    <Card className="border-2">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                <CardTitle>Top Doctors</CardTitle>
                            </div>
                            <CardDescription>
                                Recommended specialists
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {doctors.map((doctor) => (
                                    <div key={doctor.id} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                                        <p className="font-semibold">{doctor.name}</p>
                                        <p className="text-sm text-muted-foreground mb-2">{doctor.specialization}</p>
                                        <Link to="/doctors">
                                            <Button size="sm" variant="outline" className="w-full">
                                                Book Appointment
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                                <Link to="/doctors">
                                    <Button variant="outline" className="w-full">View All Doctors</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card className="border-2">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common tasks and shortcuts</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Link to="/doctors">
                                <Button variant="outline" className="w-full h-24 flex-col gap-2">
                                    <Users className="h-6 w-6" />
                                    <span>Find Doctors</span>
                                </Button>
                            </Link>
                            <Link to="/appointments">
                                <Button variant="outline" className="w-full h-24 flex-col gap-2">
                                    <Calendar className="h-6 w-6" />
                                    <span>My Appointments</span>
                                </Button>
                            </Link>
                            <Link to="/medical-records">
                                <Button variant="outline" className="w-full h-24 flex-col gap-2">
                                    <FileText className="h-6 w-6" />
                                    <span>Medical Records</span>
                                </Button>
                            </Link>
                            <Link to="/emergency">
                                <Button variant="destructive" className="w-full h-24 flex-col gap-2">
                                    <AlertCircle className="h-6 w-6" />
                                    <span>Emergency</span>
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
