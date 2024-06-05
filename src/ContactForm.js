import React, { useState } from 'react';
import './ContactForm.css';
import Navbar from './Navbar';

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
        // Add your form submission logic here
    };

    return (
        <div className="contactFormPage">
            <Navbar />
            <div className="contactFormContent">
                <div className="contactFormContainer">
                    <form onSubmit={handleSubmit} className="contactForm">
                        <h2>Contact Us</h2>
                        <div className="contactFormGroup">
                            <div className="contactHalfWidth">
                                <div className="contactLabel" htmlFor="name">Name</div>
                                <input 
                                    type="text" 
                                    id="name" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    placeholder="Enter text" 
                                    className="contactInput"
                                />
                            </div>
                        </div>
                        <div className="contactFormGroup contactHalfWidthContainer">
                            <div className="contactHalfWidth">
                                <div className="contactLabel" htmlFor="email">Email</div>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    placeholder="Enter text" 
                                    className="contactInput"
                                />
                            </div>
                            <div className="contactHalfWidth">
                                <div className="contactLabel" htmlFor="phone">Phone</div>
                                <input 
                                    type="tel" 
                                    id="phone" 
                                    name="phone" 
                                    value={formData.phone} 
                                    onChange={handleChange} 
                                    placeholder="Enter text" 
                                    className="contactInput"
                                />
                            </div>
                        </div>
                        <div className="contactFormGroup">
                            <div className="contactLabel" htmlFor="subject">Subject</div>
                            <input 
                                type="text" 
                                id="subject" 
                                name="subject" 
                                value={formData.subject} 
                                onChange={handleChange} 
                                placeholder="Enter text" 
                                className="contactInput"
                            />
                        </div>
                        <div className="contactFormGroup">
                            <div className="contactLabel" htmlFor="message">Message</div>
                            <textarea 
                                id="message" 
                                name="message" 
                                value={formData.message} 
                                onChange={handleChange} 
                                placeholder="Enter text" 
                                className="contactTextarea"
                            />
                            <button type="submit" className="contactButton">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactForm;
