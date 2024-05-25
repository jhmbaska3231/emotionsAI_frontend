import React from 'react';
import PaidNavbar from './PaidNavbar';
import Footer from './Footer'; // Assuming you want to keep the footer on this page as well
import './TranscribeText.css'; // Create and style this CSS file as needed

const TranscribeText = () => {
    return (
        <div>
            <PaidNavbar />
            <div className="transcribe-text-content">
                <h1>Transcribe Text</h1>
                {/* Add the content and functionality for the TranscribeText page here */}
            </div>
            <Footer />
        </div>
    );
}

export default TranscribeText;
