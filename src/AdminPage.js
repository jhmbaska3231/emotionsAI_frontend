import React, { useState, useEffect } from 'react';
import './AdminPage.css';
import Footer from './Footer';
import brain_icon from './pictures/brain_icon.png';
import api from './api/axiosConfig';

const AdminPage = () => {
    const [forms, setForms] = useState([]);

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const response = await api.get('/api/forms');
                setForms(response.data);
            } catch (error) {
                console.error('Error fetching forms:', error);
            }
        };

        fetchForms();
    }, []);

    const handleLogout = () => {
        // Implement your logout functionality here
    };

    const toggleReadStatus = (formId) => {
        setForms((prevForms) =>
            prevForms.map((form) =>
                form.id === formId ? { ...form, isRead: !form.isRead } : form
            )
        );
    };

    return (
        <div className="admin-page">
            <div className="admin-navbar">
                <div className="navbar-logo">
                    <img src={brain_icon} alt="brain_icon" className="logo-image" />
                    <span className="logo-text">EmotionAI</span>
                </div>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
            <div className="admin-content">
                <div className="status-and-forms-container">
                    <div className="status-container">
                        <div className="status-header">Status</div>
                        {forms.map((form) => (
                            <button
                                key={form.id}
                                className={`status-button ${form.isRead ? 'read' : 'unread'}`}
                                onClick={() => toggleReadStatus(form.id)}
                            >
                                {form.isRead ? 'Read' : 'Unread'}
                            </button>
                        ))}
                    </div>
                    <div className="admin-forms-container">
                        <div className="form-headers">
                            <div className="form-header">Date</div>
                            <div className="form-header">Name</div>
                            <div className="form-header">Email</div>
                            <div className="form-header">Phone</div>
                            <div className="form-header">Subject</div>
                            <div className="form-header">Message</div>
                        </div>
                        {forms.map((form) => (
                            <div className="form-row" key={form.id}>
                                <div className="form-item">{form.date}</div>
                                <div className="form-item">{form.name}</div>
                                <div className="form-item">{form.email}</div>
                                <div className="form-item">{form.phone}</div>
                                <div className="form-item">{form.subject}</div>
                                <div className="form-item">{form.message}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AdminPage;
