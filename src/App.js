import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';

import axios, { setBearerToken } from './api/axiosConfig';
import { fetchAuthSession } from 'aws-amplify/auth';

import './App.css';
import Home from './HomePage';
import Product from './Product';
import Pricing from './Pricing';
import Contact from './ContactForm';
import Login from './Login';
import PaidNavbar from './PaidNavbar';
import TranscribeText from './TranscribeText'; 
import TranscribeVoice from './TranscribeVoice';
import Diary from './Diary';
import UserProfile from './UserProfile';
import FreeNavbar from './FreeNavbar';
import FreeTranscribeText from './FreeTranscribeText'; 

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
                <Route path="/freetranscribetext" element={<ProtectedRoute><FreeTranscribeText /></ProtectedRoute>} />
            </Routes>
        </div>
    );

}

const fetchUserDetails = async (userId) => {
    try {
        const response = await axios.get(`/api/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user details:', error);
        return null;
    }
};

const ProtectedRoute = ({ children }) => {
    const [userType, setUserType] = React.useState(null);
    const [userId, setUserId] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchUserType = async () => {
            try {
                const session = await fetchAuthSession();
                const { accessToken, idToken } = session.tokens ?? {};
                if (accessToken && idToken) {
                    setBearerToken(accessToken.toString());

                    const userId = idToken.payload.sub;
                    setUserId(userId);

                    const userDetails = await fetchUserDetails(userId);
                    if (userDetails) {
                        setUserType(userDetails.userType);
                    }
                }
            } catch (error) {
                console.error('Error fetching auth session:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserType();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // show loading spinner or message
    }

    if (!userType) {
        return <Home />; // redirect to Home if no user type
    }

    return (
        <Authenticator>
            {({ user, signOut }) => (
                <div>
                    {userType === 'FreeUser' ? (
                        <FreeNavbar logOut={signOut} />
                    ) : (
                        <PaidNavbar logOut={signOut} />
                    )}
                    {children}
                </div>
            )}
        </Authenticator>
    );
};

// working code for 1 user_type
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
