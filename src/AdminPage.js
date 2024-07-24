import React, { useState, useEffect } from 'react';
import './AdminPage.css';
import Footer from './Footer';

import axios, { setBearerToken } from './api/axiosConfig';
import { fetchAuthSession } from 'aws-amplify/auth';

const AdminPage = () => {
    const [forms, setForms] = useState([]);

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const session = await fetchAuthSession();
                const { accessToken, idToken } = session.tokens ?? {};
                if (accessToken && idToken) {
                    setBearerToken(accessToken.toString());
                    
                    const response = await axios.get(`/api/forms`);
                    setForms(response.data);
                } else {
                    console.error('ID token not found in session');
                }
            } catch (error) {
                console.error('Error getting user session:', error);
            }
        };

        fetchForms();
    }, []);

    const toggleReadStatus = async (formId, currentStatus) => {
        try {
            const response = await axios.put(`/api/forms/${formId}/read`, {
                readStatus: !currentStatus
            });
            setForms((prevForms) =>
                prevForms.map((form) =>
                    form.formId === formId ? { ...form, readStatus: response.data.readStatus } : form
                )
            );
        } catch (error) {
            console.error('Error updating read status:', error);
        }
    };    

    return (
        <div className="admin-page">
            <div className="admin-content">
                <div className="admin-forms-container">
                    <div className="form-headers">
                        <div className="form-header">Status</div>
                        <div className="form-header">Date</div>
                        <div className="form-header">Name</div>
                        <div className="form-header">Email</div>
                        <div className="form-header">Phone</div>
                        <div className="form-header">Subject</div>
                        <div className="form-header">Message</div>
                    </div>
                    {forms.map((form) => (
                        <div className="form-row" key={form.formId}>
                            <div className="form-item">
                                <button 
                                    className={`status-button ${form.readStatus ? 'read' : 'unread'}`}
                                    onClick={() => toggleReadStatus(form.formId, form.readStatus)}
                                >
                                    {form.readStatus ? 'Read' : 'Unread'}
                                </button>
                            </div>
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
            <Footer />
        </div>
    );
};

export default AdminPage;
