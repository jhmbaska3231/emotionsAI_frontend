import React from 'react';
import './Product.css';
import PublicNavbar from './PublicNavbar';
import FaqButton from './FaqButton';
import Footer from './Footer';

const Product = () => {
    return (
        <>
            <PublicNavbar />
            <div className="prod-page">
                <div className="prod-content">
                    <div className="prod-row">
                        <div className="prod-service" id="service1">
                            <h2>Transcribe Text input to Target Emotion</h2>
                            <p>Our Transcribe Text to Emotion feature allows you to effortlessly convert text into a wide range of emotions, including happiness, sadness, anger, surprise, fear, and disgust. With this powerful tool, you can gain deeper insights into the emotional undertones of any text. For our premium users, we offer an enhanced experience with unlimited transcriptions and full word capacity, ensuring that no detail is missed in your emotional interpretation.</p>
                        </div>
                        <div className="prod-service" id="service2">
                            <h2>Emotion Analysis</h2>
                            <p>Unlock deep emotional insights with every transcription. Exclusively provided within our premium plan, this feature offers invaluable guidance by categorizing overall sentiment—positive, negative, or neutral—and evaluating emotional intensity as high, medium, or low. Empower yourself with nuanced emotional analysis for enriched interpretation and comprehension!</p>
                        </div>
                    </div>
                    <div className="prod-row">
                        <div className="prod-service" id="service3">
                            <h2>Transcribe Audio Input to Target Emotion</h2>
                            <p>Simplify your experience by converting audio into emotional insights, eliminating the hassle of typing. Effortlessly transform audio files into text while identifying emotions such as happiness, sadness, anger, surprise, fear, and disgust. For our premium users, gain access to unlimited transcribes with the full word capacity. Upgrade from our free plan to enhance your understanding and interpretation capabilities!</p>
                        </div>
                        <div className="prod-service" id="service4">
                            <h2>Diary Recording</h2>
                            <p>Easily record diary entries using text or voice input in your personal diary ledger. Our advanced system automatically identifies your primary emotion each month and compares it with all emotions expressed in your diary, presenting them in a visually accessible chart. Dive into a journey of emotional self-awareness and discovery with our user-friendly platform!</p>
                        </div>
                    </div>
                </div>
                <FaqButton />
            </div>
            <Footer />
        </>
    );
};

export default Product;
