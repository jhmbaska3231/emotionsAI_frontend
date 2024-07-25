import React, { useState } from 'react';
import './ContactForm.css';
import PublicNavbar from './PublicNavbar';
import Footer from './Footer';

import api, { removeBearerToken } from './api/axiosConfig';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            const phoneValue = value.replace(/\D/g, '');
            setFormData({ ...formData, [name]: phoneValue });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const validateForm = () => {
        const { name, email, phone, subject, message } = formData;
        return name && email && phone && subject && message;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        removeBearerToken();

        if (!validateForm()) {
            alert('Please fill out all fields.');
            return;
        }

        const currentDate = new Date().toISOString().split('T')[0];
        const formDataWithDate = { ...formData, date: currentDate };
        
        try {
            const response = await api.post('/api/forms', formDataWithDate);
            if (response.status === 200) {
                alert('Form submitted successfully');
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: ''
                });
            } else {
                console.error('Failed to submit form');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('There was an error submitting the form. Please try again later.');
        }
    };

    return (
        <div>
            <PublicNavbar />
            <div className="cf-contactFormPage">
                <div className="cf-contactFormContent">
                    <div className="cf-contactFormContainer">
                        <form onSubmit={handleSubmit} className="cf-contactForm">
                            <h2>Contact Us</h2>
                            <div className="cf-contactFormGroup">
                                <div className="cf-contactLabel" htmlFor="name">Name</div>
                                <input
                                    type="text" 
                                    id="name" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    placeholder="Enter your name" 
                                    className="cf-contactInput"
                                    required
                                />
                            </div>
                            <div className="cf-contactFormGroup cf-contactHalfWidthContainer">
                                <div className="cf-contactHalfWidth">
                                    <div className="cf-contactLabel" htmlFor="email">Email</div>
                                    <input
                                        type="email" 
                                        id="email" 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        placeholder="Enter your email" 
                                        className="cf-contactInput"
                                        required
                                    />
                                </div>
                                <div className="cf-contactHalfWidth">
                                    <div className="cf-contactLabel" htmlFor="phone">Phone</div>
                                    <input
                                        type="tel" 
                                        id="phone" 
                                        name="phone" 
                                        value={formData.phone} 
                                        onChange={handleChange} 
                                        placeholder="Enter your phone number" 
                                        className="cf-contactInput"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="cf-contactFormGroup">
                                <div className="cf-contactLabel" htmlFor="subject">Subject</div>
                                <input
                                    type="text" 
                                    id="subject" 
                                    name="subject" 
                                    value={formData.subject} 
                                    onChange={handleChange} 
                                    placeholder="Enter the subject" 
                                    className="cf-contactInput"
                                    required
                                />
                            </div>
                            <div className="cf-contactFormGroup">
                                <div className="cf-contactLabel" htmlFor="message">Message</div>
                                <textarea
                                    id="message" 
                                    name="message" 
                                    value={formData.message} 
                                    onChange={handleChange} 
                                    placeholder="Enter your message" 
                                    className="cf-contactTextarea"
                                    required
                                />
                            </div>
                            <div className="cf-buttonWrapper">
                                <button type="submit" className="cf-contactButton">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ContactForm;
