import React, { useState } from 'react';
import './TranscribeText.css';
import Footer from './Footer';

import axios from './axiosConfig';

const TranscribeText = () => {

    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const wordCount = inputText.split(' ').filter(Boolean).length;

    const handleTranscribe = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post('/api/transcribe', inputText);

            setOutputText(response.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="transcribeTextPage">
            <div className="transcribeTextContent">
                <div className="transcribeTextUsageLimit">Unlimited Transcribes</div>
                <div className="transcribeTextInputOutputContainer">
                    <div className="transcribeTextInputContainer">
                        <label>Input</label>
                        <textarea 
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Enter text..."
                        />
                        <div className="transcribeTextWordCount">Words {wordCount}/400</div>
                    </div>
                    <button 
                        onClick={handleTranscribe}
                        className="transcribeTextButton"
                        disabled={wordCount > 400 || isLoading}
                    >
                        {isLoading ? 'Transcribing...' : 'Transcribe ➔'}
                    </button>
                    {error && <div className="error">{error}</div>}
                    <div className="transcribeTextOutputContainer">
                        <label>Output</label>
                        <textarea 
                            value={outputText}
                            readOnly
                        />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );

};

export default TranscribeText;
