// Importing React and router components for navigation
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importing local components
import Footer from './Footer';
import Home from './HomePage';
import Product from './Product';
import Pricing from './Pricing';
import Contact from './Contact';
import TranscribeText from './TranscribeText'; 
// import Login from './Login'; // Future feature for user authentication

// The App component handles routing and layout for the entire application
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product" element={<Product />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/contact" element={<Contact />} /> 
                <Route path="/transcribe" element={<TranscribeText />} />
                {/* <Route path="/login" element={<Login />} />  */}
            </Routes>
            <Footer /> 
        </BrowserRouter>
    );
}

export default App;
