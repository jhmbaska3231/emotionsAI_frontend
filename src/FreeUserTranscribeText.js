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

    const TRANSCRIBE_LIMIT = 3;
    const wordCount = inputText.split(' ').filter(Boolean).length;
    const isInputEmptyOrWhitespace = inputText.trim().length === 0;

    useEffect(() => {
        const fetchAccessTokenAndTranscribeUsage = async () => {
            try {
                const session = await fetchAuthSession();
                const { accessToken, idToken } = session.tokens ?? {};
                if (accessToken && idToken) {
                    setBearerToken(accessToken.toString());

                    const userId = idToken.payload.sub;
                    const response = await axios.get(`/api/users/${userId}/transcribe-usage`);
                    setTranscribeCount(response.data.transcribeCount);
                    setHasReachedLimit(response.data.hasReachedLimit);
                }
            } catch (error) {
                console.error('Error fetching auth session:', error);
            }
        };
        fetchAccessTokenAndTranscribeUsage();
    }, []);

    const handleTranscribe = async () => {
        if (hasReachedLimit) {
            return;
        }

        setIsTranscribing(true);
        setError('');
        try {
            const session = await fetchAuthSession();
            const { accessToken, idToken } = session.tokens ?? {};
            if (accessToken && idToken) {
                setBearerToken(accessToken.toString());
                
                const userId = idToken.payload.sub;
                const response = await axios.post('/api/transcribe', inputText);
                setOutputText(response.data);
                
                // increment transcribe count and update transcribe time
                const transcribeTime = new Date().toISOString();
                const incrementResponse = await axios.post(`/api/users/${userId}/update-freeuser-limit`, { transcribeTime });
                
                if (incrementResponse.status === 200) {
                    setTranscribeCount(prevCount => prevCount + 1);
                    // check if the limit is reached after incrementing
                    if (transcribeCount + 1 >= TRANSCRIBE_LIMIT) {
                        setHasReachedLimit(true);
                    }
                }
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsTranscribing(false);
        }
    };

    const handleClearInputAndOuput = () => {
        setInputText('');
        setOutputText('');
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
                            }}
                            placeholder="Enter text..."
                            className="ft-textarea"
                        />
                        <div className="ft-button-container">
                            <div className={`ft-transcribeTextWordCount ${wordCount > 80 ? 'ft-wordCountExceeded' : ''}`}>
                                Words {wordCount}/80
                            </div>
                            <button className="ft-clearInputButton" onClick={handleClearInputAndOuput}>Clear all</button>
                        </div>
                    </div>
                    <button 
                        onClick={handleTranscribe}
                        className="ft-transcribeTextButton"
                        disabled={wordCount > 80 || isTranscribing || isInputEmptyOrWhitespace || hasReachedLimit}
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
