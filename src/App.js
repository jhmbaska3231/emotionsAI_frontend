// Importing React and router components for navigation
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import amplify components
import { Amplify } from 'aws-amplify';
import { Authenticator, View, Image, useTheme, Text } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';

// Importing local components
import './App.css';
import emotionsAI_logo from './pictures/emotionsAI_logo.png';
import PaidNavbar from './PaidNavbar';
import Navbar from './Navbar';
import Footer from './Footer';
import Home from './HomePage';
import Product from './Product';
import Pricing from './Pricing';
import Contact from './ContactForm';
import TranscribeText from './TranscribeText'; 
import TranscribeVoice from './TranscribeVoice';
import Diary from './Diary'; 
import UserProfile from './UserProfile'; 

Amplify.configure(awsExports);

function App() {

    const components = {
        Header() {
          const { tokens } = useTheme();
      
          return (
            <View textAlign="center" padding={tokens.space.large}>
                <Image
                    alt="EmotionsAI Logo"
                    src={emotionsAI_logo} 
                />
            </View>
            );
        },
        Footer() {
            const { tokens } = useTheme();
        
            return (
                <View textAlign="center" padding={tokens.space.large}>
                <Text color={tokens.colors.neutral[80]}>
                    &copy; 2024 EmotionsAI. All rights reserved.
                </Text>
                </View>
            );
        },
    };

    return (
        <Authenticator loginMechanism={['email']} components={components}>
        {({ signOut, user }) => (
            <div>
                <PaidNavbar logOut={signOut} />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/product" element={<Product />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/contact" element={<Contact />} /> 
                    <Route path="/transcribe" element={<TranscribeText />} /> 
                    <Route path="/transcribevoice" element={<TranscribeVoice />} /> 
                    <Route path="/diary" element={<Diary />} />
                    <Route path="/userprofile" element={<UserProfile />} />
                    {/* <Route path="/login" element={<Login />} />  */}
                </Routes>
                <Footer /> 
            </div>
        )}
        </Authenticator>
    )

}

    // return (
    //     <BrowserRouter>
            // <Routes>
            //     <Route path="/" element={<Home />} />
            //     <Route path="/product" element={<Product />} />
            //     <Route path="/pricing" element={<Pricing />} />
            //     <Route path="/contact" element={<Contact />} /> 
            //     <Route path="/transcribe" element={<TranscribeText />} /> 
            //     <Route path="/transcribevoice" element={<TranscribeVoice />} /> 
            //     <Route path="/diary" element={<Diary />} />
            //     <Route path="/userprofile" element={<UserProfile />} />
            //     {/* <Route path="/login" element={<Login />} />  */}
            // </Routes>
            // <Footer /> 
    //     </BrowserRouter>
    // );

export default App;
