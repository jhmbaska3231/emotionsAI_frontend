import React, { useState } from 'react';
import './ContactForm.css';
import Navbar from './Navbar';
import Footer from './Footer';

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
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form data submitted:', formData);
        // Add logic here
    };

    return (
        <div>
            <Navbar />
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
                                    placeholder="Enter text" 
                                    className="cf-contactInput"
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
                                        placeholder="Enter text" 
                                        className="cf-contactInput"
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
                                        placeholder="Enter text" 
                                        className="cf-contactInput"
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
                                    placeholder="Enter text" 
                                    className="cf-contactInput"
                                />
                            </div>
                            <div className="cf-contactFormGroup">
                                <div className="cf-contactLabel" htmlFor="message">Message</div>
                                <textarea 
                                    id="message" 
                                    name="message" 
                                    value={formData.message} 
                                    onChange={handleChange} 
                                    placeholder="Enter text" 
                                    className="cf-contactTextarea"
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
