// Importing React and router components for navigation
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {useState, useEffect} from 'react';

// Importing local components
import api from './api/axiosConfig';
import Footer from './Footer';
import Home from './HomePage';
import Product from './Product';
import Pricing from './Pricing';
import Contact from './ContactForm';
import TranscribeText from './TranscribeText'; 
import TranscribeVoice from './TranscribeVoice';
import Diary from './Diary'; 
import UserProfile from './UserProfile'; 

// The App component handles routing and layout for the entire application
function App() {

    // api.get('/api/diaries/with-emotions/user/5')
    //     .then(response => {
    //         console.log(response.data);
    //     })
    //     .catch(error => {
    //         console.error('There was an error making the request!', error);
    //     });


    
    // const [diaries, setDiaries] = useState();

    // const getDiaries = async () =>{

    //     try
    //     {
    //         // can include checks for http status code here too

    //         const response = await api.get("/api/diaries/with-emotions/user/5")

    //         console.log(response.data);

    //         setDiaries(response.data);

    //     } catch(err)
    //     {
    //         console.log(err);
    //     }

    // }

    // useEffect(() => {
    //     getDiaries();
    // },[])

    return (
        <BrowserRouter>
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
        </BrowserRouter>
    );

}

export default App;
