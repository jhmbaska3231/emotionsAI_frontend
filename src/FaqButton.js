import React, { useState } from 'react';
import info_icon from './pictures/info_icon.png';
import './FaqButton.css';

const FaqButton = () => {
    const [showCards, setShowCards] = useState(false);
    const [popupContent, setPopupContent] = useState('');
    const [showPopup, setShowPopup] = useState(false);

    const handleFaqButtonClick = () => {
        setShowCards(!showCards);
    };

    const handleCardHover = (content) => {
        setPopupContent(content);
        setShowPopup(true);
    };

    const handleCardLeave = () => {
        setShowPopup(false);
    };

    const transcribeTextContent = (
        <div className="faq-content">
            <h2>Transcribe Text</h2>
            <p>Analyze text for emotional undertones.</p>
            <ul>
                <li>Enter text</li>
                <li>Click transcribe</li>
                <li>See Target Emotion, Emotional Intensity, Overall Sentiment</li>
            </ul>
        </div>
    );

    const transcribeVoiceContent = (
        <div className="faq-content">
            <h2>Transcribe Voice</h2>
            <p>Analyze audio for emotional content.</p>
            <ul>
                <li>Upload audio file</li>
                <li>Click transcribe</li>
                <li>See Target Emotion, Emotional Intensity, Overall Sentiment</li>
            </ul>
        </div>
    );

    const diaryContent = (
        <div className="faq-content">
            <h2>Diary</h2>
            <p>Record and analyze diary entries.</p>
            <ul>
                <li>Diary Ledger: Entries with date, input, output</li>
                <li>Graphical Insights: Monthly, Biannual, Emotion Correlation Analysis</li>
            </ul>
        </div>
    );

    return (
        <div className="faq-button">
            <button className="faq-button-icon" onClick={handleFaqButtonClick}>
                <img src={info_icon} alt="FAQ" />
            </button>
            {showCards && (
                <div className="faq-cards-container">
                    <div
                        className="faq-card"
                        onMouseEnter={() => handleCardHover(transcribeTextContent)}
                        onMouseLeave={handleCardLeave}
                    >
                        Transcribe Text
                    </div>
                    <div
                        className="faq-card"
                        onMouseEnter={() => handleCardHover(transcribeVoiceContent)}
                        onMouseLeave={handleCardLeave}
                    >
                        Transcribe Voice
                    </div>
                    <div
                        className="faq-card"
                        onMouseEnter={() => handleCardHover(diaryContent)}
                        onMouseLeave={handleCardLeave}
                    >
                        Diary
                    </div>
                </div>
            )}
            {showPopup && (
                <div className={`faq-popup ${showPopup ? 'visible' : ''}`}>
                    {popupContent}
                </div>
            )}
        </div>
    );
};

export default FaqButton;
