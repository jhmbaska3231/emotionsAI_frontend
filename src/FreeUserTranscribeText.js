import React, { useState, useEffect } from 'react';
import './FreeTranscribeText.css';
import Footer from './Footer';

import axios, { setBearerToken } from './api/axiosConfig';
import { fetchAuthSession } from 'aws-amplify/auth';

const FreeUserTranscribeText = () => {

    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [error, setError] = useState('');
    const [transcribeCount, setTranscribeCount] = useState(0);
    const [hasReachedLimit, setHasReachedLimit] = useState(false);

    const TRANSCRIBE_LIMIT = 3; // Free user transcribe limit

    const wordCount = inputText.split(' ').filter(Boolean).length;
    const isInputEmptyOrWhitespace = inputText.trim().length === 0;

    useEffect(() => {
        const fetchAccessToken = async () => {
            try {
                const session = await fetchAuthSession();
                const { accessToken } = session.tokens ?? {};
                if (accessToken) {
                    setBearerToken(accessToken.toString());
                }
            } catch (error) {
                console.error('Error fetching auth session:', error);
            }
        };
        fetchAccessToken();
    }, []);

    const handleTranscribe = async () => {
        if (transcribeCount >= TRANSCRIBE_LIMIT) {
            setHasReachedLimit(true);
            return;
        }

        setIsTranscribing(true);
        setError('');
        try {
            const response = await axios.post('/api/transcribe', inputText);
            setOutputText(response.data);
            setIsInputChanged(false);
            setTranscribeCount(prevCount => prevCount + 1);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsTranscribing(false);
        }
    };

    const handleClearInputAndOuput = () => {
        setInputText('');
        setOutputText('');
        setIsInputChanged(true);
    };

    return (
        <div className="ft-transcribeTextPage">
            <div className="ft-transcribeTextContent">
                <div className="ft-transcribeTextUsageLimit">Transcribe Limit: {transcribeCount}/{TRANSCRIBE_LIMIT}</div>
                <div className="ft-transcribeTextInputOutputContainer">
                    <div className="ft-transcribeTextInputContainer">
                        <label className="ft-label">Input</label>
                        <textarea 
                            value={inputText}
                            onChange={(e) => {
                                setInputText(e.target.value);
                                setIsInputChanged(true);
                            }}
                            placeholder="Enter text..."
                            className="ft-textarea"
                        />
                        <div className="ft-button-container">
                            <div className={`ft-transcribeTextWordCount ${wordCount > 280 ? 'ft-wordCountExceeded' : ''}`}>
                                Words {wordCount}/280
                            </div>
                            <button className="ft-clearInputButton" onClick={handleClearInputAndOuput}>Clear all</button>
                        </div>
                    </div>
                    <button 
                        onClick={handleTranscribe}
                        className="ft-transcribeTextButton"
                        disabled={wordCount > 280 || isTranscribing || isInputEmptyOrWhitespace || hasReachedLimit}
                    >
                        {isTranscribing ? 'Transcribing...' : hasReachedLimit ? 'Limit Reached' : 'Transcribe ➔'}
                    </button>
                    {error && <div className="ft-error">{error}</div>}
                    <div className="ft-transcribeTextOutputContainer">
                        <label className="ft-label">Output</label>
                        <textarea 
                            value={outputText}
                            readOnly
                            className="ft-textarea"
                        />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );

};

export default FreeUserTranscribeText;
