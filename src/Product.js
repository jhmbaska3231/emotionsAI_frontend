import React from 'react';
import Navbar from './Navbar';
import FaqButton from './FaqButton';
import './Product.css';
import product_background from './pictures/product_background.png';

const Product = () => {
    return (
        <div 
            className="product-page" 
            style={{ backgroundImage: `url(${product_background})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}
        >            
            <Navbar />
            <div className="product-content">
                <div className="row">
                    <div className="service" id="service1">
                        <h2>Transcribe Text input to Target Emotion</h2>
                        <p>Seamlessly translate text into a spectrum of emotions such as happiness, sadness, anger, surprise, fear, and disgust. For our premium users, you get unlimited transcribes with the full word capacity. Elevate your comprehension and interpretation capabilities by upgrading from our free plan!</p>
                    </div>
                    <div className="service" id="service2">
                        <h2>Emotion Analysis</h2>
                        <p>Unlock deep emotional insights with every transcription. Exclusively provided within our premium plan, this feature offers invaluable guidance by categorizing overall sentiment—be it positive, negative, or neutral—and evaluating emotional intensity as high, medium, or low, assigning a percentage weightage to each targeted emotion. Empower yourself with nuanced emotional analysis for enriched interpretation and comprehension!</p>
                    </div>
                </div>
                <div className="row">
                    <div className="service" id="service3">
                        <h2>Transcribe Audio Input to Target Emotion</h2>
                        <p>Simplify your experience by converting audio into emotional insights, eliminating the hassle of typing. Effortlessly transform audio files into text while identifying a range of emotions such as happiness, sadness, anger, surprise, fear, and disgust. For our premium users, gain access to unlimited transcribes with the full word capacity. Upgrade from our free plan to enhance your understanding and interpretation capabilities!</p>
                    </div>
                    <div className="service" id="service4">
                        <h2>Diary Recording</h2>
                        <p>Easily record diary entries using text or voice input in your personal diary ledger. Our advanced system automatically identifies your primary emotion each month and compares it with all emotions expressed in your diary, presenting them in a visually accessible chart. Dive into a journey of emotional self-awareness and discovery with our user-friendly platform!</p>
                    </div>
                </div>
            </div>
            <FaqButton />
        </div>
    );
};

export default Product;
