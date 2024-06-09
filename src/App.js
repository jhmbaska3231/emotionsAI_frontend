import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { Amplify } from 'aws-amplify';
import { Authenticator, View, Image, useTheme, Text } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';

import './App.css';
import emotionsAI_logo from './pictures/emotionsAI_logo.png';
import PaidNavbar from './PaidNavbar';
import Navbar from './Navbar';
import Footer from './Footer';
import Home from './HomePage';
import Product from './Product';
import Pricing from './Pricing';
import Contact from './ContactForm';
import Login from './Login';
import TranscribeText from './TranscribeText'; 
import TranscribeVoice from './TranscribeVoice';
import Diary from './Diary';
import UserProfile from './UserProfile'; 

Amplify.configure(awsExports);

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product" element={<Product />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/transcribe" element={<ProtectedRoute><TranscribeText /></ProtectedRoute>} />
                <Route path="/transcribevoice" element={<ProtectedRoute><TranscribeVoice /></ProtectedRoute>} />
                <Route path="/diary" element={<ProtectedRoute><Diary /></ProtectedRoute>} />
                <Route path="/userprofile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            </Routes>
            <Footer />
        </div>
    );
}

// ProtectedRoute component to handle protected routes
const ProtectedRoute = ({ children }) => {
    return (
        <Authenticator>
            {({ user }) => {
                return user ? children : <Home />;
            }}
        </Authenticator>
    );
};

export default App;
