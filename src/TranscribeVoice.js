import React, { useState, useEffect } from 'react';
import './TranscribeVoice.css';
import Footer from './Footer';

import axios, { setBearerToken } from './api/axiosConfig';
import { fetchAuthSession } from 'aws-amplify/auth';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const TranscribeVoice = () => {

    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isConverting, setIsConverting] = useState(false);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null);
    const [isInputChanged, setIsInputChanged] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [fileInputKey, setFileInputKey] = useState(Date.now());

    const wordCount = inputText.split(' ').filter(Boolean).length;

    const isInputEmptyOrWhitespace = inputText.trim().length === 0;

    useEffect(() => {
        const fetchUserIdAndToken = async () => {
            try {
                const session = await fetchAuthSession();
                const { accessToken, idToken } = session.tokens ?? {};
                if (accessToken && idToken) {
                    setBearerToken(accessToken.toString());
                    
                    const userId = idToken.payload.sub;
                    setUserId(userId);
                }
            } catch (error) {
                console.error('Error fetching auth session:', error);
            }
        };

        fetchUserIdAndToken();
    }, []);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
    };

    const handleAudioToText = async () => {
        setError('');
        setIsConverting(true);

        try {
            const formData = new FormData();
            formData.append('inputAudio', selectedFile);

            const response = await axios.post('/api/audiototext', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            });

            setInputText(response.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsConverting(false);
        }
    };    

    const handleTranscribe = async () => {
        setIsTranscribing(true);
        setError('');

        try {
            const response = await axios.post('/api/transcribe', inputText);
            setOutputText(response.data);
            setIsInputChanged(false);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsTranscribing(false);
        }
    };

    const parseTranscriptionOutput = (output) => {
        const emotionRegex = /Target Emotion\(s\): (.*)/;
        const intensityRegex = /Emotional Intensity: (\w+)/;
        const sentimentRegex = /Overall Sentiment: (\w+)/;

        const emotionsMatch = output.match(emotionRegex);
        const intensityMatch = output.match(intensityRegex);
        const sentimentMatch = output.match(sentimentRegex);

        let targetEmotions = [];
        if (emotionsMatch && emotionsMatch[1]) {
            const emotionsString = emotionsMatch[1].trim();
            if (emotionsString && emotionsString !== 'None') {
                const emotionsArray = emotionsString.split(', ');

                targetEmotions = emotionsArray.map(emotionString => {
                    const [emotion, percentage] = emotionString.split(' (');
                    return {
                        emotion: emotion.trim(),
                        emotionPercentage: percentage ? parseFloat(percentage.replace('%)', '').trim()) : 0
                    };
                });
            }
        }

        const emotionalIntensity = intensityMatch ? intensityMatch[1] : '';
        const overallSentiment = sentimentMatch ? sentimentMatch[1] : '';

        return { emotionalIntensity, overallSentiment, targetEmotions };
    };

    const handleSaveToDiary = async () => {
        setIsSaving(true);
        setError('');

        try {
            const { emotionalIntensity, overallSentiment, targetEmotions } = parseTranscriptionOutput(outputText);

            if (targetEmotions.length === 0 || targetEmotions.some(emotion => emotion.emotion === 'None' || !emotion.emotion)) {
                alert('The target emotion is none. Please try another input.');
                setIsSaving(false);
                return;
            }

            const currentDate = new Date().toISOString().split('T')[0];
            const diaryEntry = {
                date: currentDate,
                inputText,
                emotionalIntensity,
                overallSentiment,
                targetEmotionsList: targetEmotions,
                userId: userId
            };

            await axios.post('/api/diaries/with-emotions', diaryEntry);
            alert('Diary entry saved successfully');
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleClearInputAndOuput = () => {
        setInputText('');
        setOutputText('');
        setIsInputChanged(true);
        setSelectedFile(null);
        setFileName('');
        setFileInputKey(Date.now());
    };

    return (
        <div className="transcribeVoicePage">
            <div className="transcribeVoiceContent">
                <div className="transcribeVoiceUsageLimit">Unlimited Transcribes</div>
                <div className="transcribeVoiceInputOutputContainer">
                    <div className="transcribeVoiceInputContainer">
                        <label>Input</label>
                        <textarea 
                            value={inputText}
                            onChange={(e) => {
                                setInputText(e.target.value);
                                setIsInputChanged(true);
                            }}
                            placeholder="Enter text or upload audio..."
                        />
                        <div className="transcribeVoiceWordCount">Words {wordCount}/400</div>
                        <div className="transcribeVoiceFileInfo">MP3/MP4/WAV files - max 25MB</div>
                        <input
                            key={fileInputKey}
                            type="file"
                            accept=".mp3,.mp4,.wav"
                            onChange={handleFileChange}
                            id="file-upload"
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="file-upload" className="transcribeVoiceUploadButton">
                            Upload
                        </label>
                        {fileName && <div className="transcribeVoiceFileName">Uploaded file: {fileName}</div>}
                        <button className="clearInputButton" onClick={handleClearInputAndOuput}>Clear all</button>
                    </div>
                    <button 
                        onClick={handleAudioToText}
                        className="transcribeVoiceTranscribeButton"
                        disabled={!selectedFile || isTranscribing || isSaving || isConverting}
                    >
                        {isConverting ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <CircularProgress size={24} />
                                Converting...
                            </Box>
                        ) : 'Convert Audio to Text'}
                    </button>
                    <button
                        onClick={handleTranscribe}
                        className="transcribeVoiceTranscribeButton"
                        disabled={wordCount > 400 || isTranscribing || isSaving || isInputEmptyOrWhitespace || isConverting}
                    >
                        {isTranscribing ? 'Transcribing...' : 'Transcribe ➔'}
                    </button>
                    {error && <div className="error">{error}</div>}
                    <div className="transcribeVoiceOutputContainer">
                        <label>Output</label>
                        <textarea 
                            className="transcribeVoiceOutputTextarea"
                            value={outputText}
                            readOnly
                        />
                        <button 
                            onClick={handleSaveToDiary}
                            className="transcribeVoiceSaveDiaryButton"
                            disabled={isSaving || isTranscribing || isInputChanged || isConverting}
                        >
                            {isSaving ? 'Saving...' : 'Save to Diary'}
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );

};

export default TranscribeVoice;
