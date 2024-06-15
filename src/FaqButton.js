import React from 'react';
import info_icon from './pictures/info_icon.png';
import './FaqButton.css';  

const FaqButton = () => {
    const handleFaqButtonClick = () => {
        // Add your onClick logic here
        console.log('Faq button clicked');
    };

    return (
        <div className="faq-button">
            <button className="faq-button-icon" onClick={handleFaqButtonClick}>
                <img src={info_icon} alt="FAQ" style={{ width: '50px', height: '50px' }} />
            </button>
        </div>
    );
};

export default FaqButton;