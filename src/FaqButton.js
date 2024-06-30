import React from 'react';
import info_icon from './pictures/info_icon.png';
import './FaqButton.css';  

const FaqButton = () => {
    const handleFaqButtonClick = () => {
        console.log('Faq button clicked');
    };

    return (
        <div className="faq-button">
            <button className="faq-button-icon" onClick={handleFaqButtonClick}>
                <img src={info_icon} alt="FAQ" />
            </button>
        </div>
    );
};

export default FaqButton;
