import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';

import './App.css';
import Home from './HomePage';
import Product from './Product';
import Pricing from './Pricing';
import Contact from './ContactForm';
import Footer from './Footer';
import Login from './Login';
import PaidNavbar from './PaidNavbar';
import TranscribeText from './TranscribeText'; 
import TranscribeVoice from './TranscribeVoice';
import Diary from './Diary';
import UserProfile from './UserProfile';
import { useUser } from './UserContext'; // new

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
                <Route path="/transcribetext" element={<ProtectedRoute><TranscribeText /></ProtectedRoute>} />
                <Route path="/transcribevoice" element={<ProtectedRoute><TranscribeVoice /></ProtectedRoute>} />
                <Route path="/diary" element={<ProtectedRoute><Diary /></ProtectedRoute>} />
                <Route path="/userprofile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            </Routes>
            <Footer />
        </div>
    );

}

// new
const ProtectedRoute = ({ children }) => {

    const { user, setUser } = useUser();

    return (
        <Authenticator>
            {({ user: authUser, signOut }) => {

                if (authUser && !user) {
                    // Extract necessary properties from authUser
                    const userId = authUser.userId || authUser.username || 'unknown';
                    const email = authUser.signInDetails?.loginId || 'unknown';

                    setUser({
                        userId,
                        email,
                    });
                }

                return user ? (
                    <div>
                        <PaidNavbar logOut={signOut} />
                        {children}
                    </div>
                ) : (
                    <Home />
                );
            }}
        </Authenticator>
    );
    
};

// const ProtectedRoute = ({ children }) => {
//     return (
//       <Authenticator>
//         {({ user, signOut }) => {
//             return user ? (
//                 <div>
//                     <PaidNavbar logOut={signOut} />
//                     {children}
//                 </div>
//             ) : (
//                 <Home />
//             );
//         }}
//       </Authenticator>
//     );
// };

export default App;
