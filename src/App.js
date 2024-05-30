// Importing React and router components for navigation
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importing local components
import Footer from './Footer';
import Home from './HomePage';
import Product from './Product';
import Pricing from './Pricing';
import Contact from './Contact';
import TranscribeText from './TranscribeText'; // Import the TranscribeText component
import Diary from './Diary'; // Import the Diary component
import UserProfile from './UserProfile'; // Import the UserProfile component

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
                <Route path="/transcribe" element={<TranscribeText />} /> {/* Add route for TranscribeText */}
                <Route path="/diary" element={<Diary />} /> {/* Add route for Diary */}
                <Route path="/userprofile" element={<UserProfile />} /> {/* Add the UserProfile route */}
                {/* <Route path="/login" element={<Login />} />  */}
            </Routes>
            <Footer /> 
        </BrowserRouter>
    );
}

// Makes the App component available for import in other parts of the application
export default App;
