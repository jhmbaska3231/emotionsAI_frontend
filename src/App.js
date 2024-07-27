import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

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
import FreeUserTranscribeText from './FreeUserTranscribeText';
import FreeUserUpgradePage from './FreeUserUpgradePage';
import AdminNavbar from './AdminNavbar';
import AdminPage from './AdminPage';

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
                <Route path="/transcribetext" element={<ProtectedRoute requiredUserType="PaidUser"><TranscribeText /></ProtectedRoute>} />
                <Route path="/transcribevoice" element={<ProtectedRoute requiredUserType="PaidUser"><TranscribeVoice /></ProtectedRoute>} />
                <Route path="/diary" element={<ProtectedRoute requiredUserType="PaidUser"><Diary /></ProtectedRoute>} />
                <Route path="/userprofile" element={<ProtectedRoute requiredUserType="PaidUser"><UserProfile /></ProtectedRoute>} />
                <Route path="/freeusertranscribetext" element={<ProtectedRoute requiredUserType="FreeUser"><FreeUserTranscribeText /></ProtectedRoute>} />
                <Route path="/freeuserupgradepage" element={<ProtectedRoute requiredUserType="FreeUser"><FreeUserUpgradePage /></ProtectedRoute>} />
                <Route path="/adminpage" element={<ProtectedRoute requiredUserType="AdminUser"><AdminPage /></ProtectedRoute>} />
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

const ProtectedRoute = ({ children, requiredUserType }) => {
    const navigate = useNavigate();
    const [userType, setUserType] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [isAuthorized, setIsAuthorized] = React.useState(true);

    React.useEffect(() => {
        const fetchUserType = async () => {
            try {
                const session = await fetchAuthSession();
                const { accessToken, idToken } = session.tokens ?? {};
                if (accessToken && idToken) {
                    setBearerToken(accessToken.toString());

                    const userId = idToken.payload.sub;
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

    React.useEffect(() => {
        if (!loading) {
            if (userType && userType !== requiredUserType) {
                setIsAuthorized(false);
                navigate(-1);
            } else if (!userType) {
                navigate('/');
            }
        }
    }, [userType, requiredUserType, loading, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthorized || !userType) {
        return null;
    }

    return (
        <Authenticator>
            {({ user, signOut }) => (
                <div>
                    {userType === 'FreeUser' && <FreeNavbar logOut={signOut} />}
                    {userType === 'PaidUser' && <PaidNavbar logOut={signOut} />}
                    {userType === 'AdminUser' && <AdminNavbar logOut={signOut} />}
                    {children}
                </div>
            )}
        </Authenticator>
    );
};

// working code for 1 userType
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
