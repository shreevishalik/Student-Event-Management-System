import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- API CONFIG ---
const api = axios.create();
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const BASE = {
    AUTH: 'http://localhost:8080/api/auth',
    STUDENT: 'http://localhost:8081/api/students',
    EVENT: 'http://localhost:8083/api/events'
};

export default function App() {
    const [view, setView] = useState<'login' | 'register' | 'dashboard'>('login');
    const [authForm, setAuthForm] = useState({ email: '', password: '', role: 'STUDENT' });
    const [userRole, setUserRole] = useState(localStorage.getItem('role') || '');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${BASE.AUTH}/login`, {
                email: authForm.email,
                password: authForm.password
            });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
            setUserRole(res.data.role);
            setView('dashboard');
        } catch (err) { alert("Login Failed!"); }
    };

    const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        // We only send email, password, and role to match the User model
        const registrationData = {
            email: authForm.email,
            password: authForm.password,
            role: authForm.role // This ensures the backend gets the 'ADMIN' or 'STUDENT' string
        };

        await axios.post(`${BASE.AUTH}/register`, registrationData);
        
        alert("Registration successful! You can now log in.");
        setView('login');
    } catch (err) { 
        console.error(err);
        alert("Registration failed. Check if the email is already taken."); 
    }
};

    if (view === 'login') return (
        <div style={s.container}>
            <div style={s.card}>
                <h2>Login</h2>
                <form onSubmit={handleLogin} style={s.form}>
                    <input placeholder="Email" type="email" onChange={e => setAuthForm({...authForm, email: e.target.value})} style={s.input} required />
                    <input placeholder="Password" type="password" onChange={e => setAuthForm({...authForm, password: e.target.value})} style={s.input} required />
                    <button type="submit" style={s.btn}>Sign In</button>
                </form>
                <p onClick={() => setView('register')} style={s.link}>Create an account</p>
            </div>
        </div>
    );

    if (view === 'register') return (
        <div style={s.container}>
            <div style={s.card}>
                <h2>Register</h2>
                <form onSubmit={handleRegister} style={s.form}>
                    <input placeholder="Email" type="email" onChange={e => setAuthForm({...authForm, email: e.target.value})} style={s.input} required />
                    <input placeholder="Password" type="password" onChange={e => setAuthForm({...authForm, password: e.target.value})} style={s.input} required />
                    <select onChange={e => setAuthForm({...authForm, role: e.target.value})} style={s.input}>
                        <option value="STUDENT">Student</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                    <button type="submit" style={s.btn}>Sign Up</button>
                </form>
                <p onClick={() => setView('login')} style={s.link}>Back to Login</p>
            </div>
        </div>
    );

    return (
        <div style={{ padding: '20px' }}>
            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>{userRole} Portal</h1>
                <button onClick={() => { localStorage.clear(); setView('login'); }}>Logout</button>
            </nav>
            <hr />
            {userRole === 'ADMIN' ? <AdminUI /> : <StudentUI />}
        </div>
    );
}

// --- ADMIN UI ---
function AdminUI() {
    const [events, setEvents] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState('');
    const [selectedStudentRoll, setSelectedStudentRoll] = useState('');
    
    // State for the Create Event form
    const [eventForm, setEventForm] = useState({ 
        title: '', description: '', date: '', location: '', facultyId: '', registeredStudentIds: [] 
    });

    // --- FETCH DATA ON LOAD ---
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Fetch events from 8083 and students from 8081
                const [eventRes, studentRes] = await Promise.all([
                    api.get(BASE.EVENT),
                    api.get(BASE.STUDENT)
                ]);
                setEvents(eventRes.data);
                setStudents(studentRes.data);
            } catch (err) {
                console.error("Error loading dropdown data:", err);
            }
        };
        loadInitialData();
    }, []);

    // --- LOGIC: POST NEW EVENT ---
    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post(BASE.EVENT, eventForm);
            alert("Event Posted Successfully!");
            // Refresh event list to show in dropdown
            const res = await api.get(BASE.EVENT);
            setEvents(res.data);
        } catch (err) { alert("Error creating event."); }
    };

    // --- LOGIC: REGISTER STUDENT TO EVENT ---
    // UPDATE THIS PART in AdminUI
const handleConfirmRegistration = async () => {
    if (!selectedEventId || !selectedStudentRoll) {
        alert("Please select both an Event and a Student!");
        return;
    }

    try {
        // CHANGED FROM .put TO .post TO MATCH YOUR BACKEND
        await api.post(`${BASE.EVENT}/${selectedEventId}/register/${selectedStudentRoll}`);
        alert(`Success! Student ${selectedStudentRoll} registered for event.`);
        
        // Refresh data to show updated lists
        const [eventRes, studentRes] = await Promise.all([
            api.get(BASE.EVENT),
            api.get(BASE.STUDENT)
        ]);
        setEvents(eventRes.data);
        setStudents(studentRes.data);
    } catch (err) {
        alert("Registration failed. Make sure the Event ID and Student Roll Number are valid.");
    }
};

    return (
        <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
            
            {/* LEFT: CREATE EVENT FORM */}
            <div style={styles.section}>
                <h3>Create Event</h3>
                <form onSubmit={handleCreateEvent} style={styles.form}>
                    <input placeholder="Event Title" onChange={e => setEventForm({...eventForm, title: e.target.value})} style={styles.input} required />
                    <input placeholder="Description" onChange={e => setEventForm({...eventForm, description: e.target.value})} style={styles.input} required />
                    <input type="date" onChange={e => setEventForm({...eventForm, date: e.target.value})} style={styles.input} required />
                    <input placeholder="Location" onChange={e => setEventForm({...eventForm, location: e.target.value})} style={styles.input} required />
                    <input placeholder="Faculty ID" onChange={e => setEventForm({...eventForm, facultyId: e.target.value})} style={styles.input} required />
                    <button type="submit" style={{...styles.btn, backgroundColor: '#28a745'}}>Post Event</button>
                </form>
            </div>

            {/* RIGHT: REGISTER STUDENT TO EVENT (DROPDOWNS) */}
            <div style={styles.section}>
                <h3>Register Student to Event</h3>
                <div style={styles.form}>
                    <label>Select Event:</label>
                    <select 
                        style={styles.input} 
                        value={selectedEventId} 
                        onChange={(e) => setSelectedEventId(e.target.value)}
                    >
                        <option value="">-- Choose Event --</option>
                        {events.map((ev: any) => (
                            <option key={ev.id} value={ev.id}>{ev.title}</option>
                        ))}
                    </select>

                    <label>Select Student:</label>
                    <select 
                        style={styles.input} 
                        value={selectedStudentRoll} 
                        onChange={(e) => setSelectedStudentRoll(e.target.value)}
                    >
                        <option value="">-- Choose Roll Number --</option>
                        {students.map((st: any) => (
                            <option key={st.id} value={st.rollNumber}>
                                {st.rollNumber} - {st.fullName}
                            </option>
                        ))}
                    </select>

                    <button 
                        onClick={handleConfirmRegistration} 
                        style={{...styles.btn, backgroundColor: '#007bff', marginTop: '10px'}}
                    >
                        Confirm Registration
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- STUDENT UI ---
function StudentUI() {
    const [studentForm, setStudentForm] = useState({
        email: '', fullName: '', rollNumber: '', department: '', yearOfStudy: 1
    });

    const handlePostInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post(BASE.STUDENT, studentForm);
            alert("Student Information Saved!");
        } catch (e) { alert("Error saving information."); }
    };

    // UPDATE THIS PART in StudentUI
return (
    <div style={styles.container}>
        <div style={{...styles.section, width: '400px'}}>
            <h3>Submit My Student Profile</h3>
            <form onSubmit={handlePostInfo} style={styles.form}>
                <input placeholder="Full Name" onChange={e => setStudentForm({...studentForm, fullName: e.target.value})} style={styles.input} required />
                <input placeholder="Email" type="email" onChange={e => setStudentForm({...studentForm, email: e.target.value})} style={styles.input} required />
                <input placeholder="Roll Number" onChange={e => setStudentForm({...studentForm, rollNumber: e.target.value})} style={styles.input} required />
                <input placeholder="Department" onChange={e => setStudentForm({...studentForm, department: e.target.value})} style={styles.input} required />
                <input placeholder="Year of Study" type="number" onChange={e => setStudentForm({...studentForm, yearOfStudy: parseInt(e.target.value)})} style={styles.input} required />
                <button type="submit" style={styles.btn}>Update My Info</button>
            </form>
        </div>
    </div>
);
}

const s = {
    container: { display: 'flex', justifyContent: 'center', marginTop: '30px' },
    card: { padding: '25px', border: '1px solid #ddd', borderRadius: '12px', width: '350px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
    form: { display: 'flex', flexDirection: 'column' as 'column', gap: '12px' },
    input: { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' as 'border-box' },
    btn: { padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
    link: { color: '#007bff', cursor: 'pointer', textAlign: 'center' as 'center', marginTop: '15px' },
    section: { flex: '1 1 300px', padding: '20px', border: '1px solid #eee', borderRadius: '10px', backgroundColor: '#f9f9f9' }
};

// --- STYLES OBJECT ---
const styles: { [key: string]: React.CSSProperties } = {
    container: { 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh', 
        backgroundColor: '#f4f7f6' 
    },
    card: { 
        padding: '30px', 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)', 
        width: '350px' 
    },
    form: { 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '15px' 
    },
    input: { 
        padding: '12px', 
        borderRadius: '6px', 
        border: '1px solid #ddd', 
        fontSize: '16px',
        width: '100%',
        boxSizing: 'border-box'
    },
    btn: { 
        padding: '12px', 
        color: 'white', 
        border: 'none', 
        borderRadius: '6px', 
        cursor: 'pointer', 
        fontSize: '16px', 
        fontWeight: 'bold' 
    },
    section: { 
        flex: 1, 
        minWidth: '300px',
        padding: '25px', 
        backgroundColor: '#ffffff', 
        border: '1px solid #eee', 
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    link: { 
        color: '#007bff', 
        cursor: 'pointer', 
        marginTop: '15px', 
        textAlign: 'center',
        textDecoration: 'underline' 
    }
};