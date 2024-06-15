import React, { useState } from 'react';
import './TranscribeVoice.css';
import PaidNavbar from './PaidNavbar';

const TranscribeVoice = () => {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const handleTranscribe = () => {
        if (selectedFile) {
            // Add your audio file transcription logic here
            // Example: process the selectedFile and get the transcription result
            // Here, it's just a placeholder logic
            const transcriptionResult = "Transcribed text from audio file";
            setOutputText(transcriptionResult);
        } else {
            setOutputText(inputText);
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSaveToDiary = () => {
        // Add your save to diary logic here
        alert('Saved to diary!');
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
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Enter text"
                        />
                        <div className="transcribeVoiceWordCount">Words {inputText.split(' ').filter(Boolean).length}/400</div>
                        <div className="transcribeVoiceFileInfo">MP3/WAV files</div>
                        <input 
                            type="file" 
                            accept=".mp3,.wav" 
                            onChange={handleFileChange} 
                            id="file-upload" 
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="file-upload" className="transcribeVoiceUploadButton">
                            Upload
                        </label>
                    </div>
                    <button 
                        onClick={handleTranscribe}
                        className="transcribeVoiceTranscribeButton"
                    >
                        Transcribe ➔
                    </button>
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
                        >
                            Save to Diary
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TranscribeVoice;