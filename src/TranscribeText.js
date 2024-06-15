import React, { useState } from 'react';
import './TranscribeText.css';

const TranscribeText = () => {

    const handleLogout = () => {
        console.log('logging out now...');
        props.logOut();
        alert('logout...');
    }

    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [usageCount, setUsageCount] = useState(0);
    const usageLimit = 3;

    const handleTranscribe = () => {
        if (usageCount < usageLimit) {
            // Add your transcription logic here
            setOutputText(inputText); // This is a placeholder, replace with actual transcription logic
            setUsageCount(usageCount + 1);
        } else {
            alert('Usage limit reached');
        }
    };

    return (
        <div className="transcribeTextPage">
            <div className="transcribeTextContent">
                <div className="transcribeTextUsageLimit">Usage Limit {usageCount}/{usageLimit}</div>
                <div className="transcribeTextInputOutputContainer">
                    <div className="transcribeTextInputContainer">
                        <label>Input</label>
                        <textarea 
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Enter text"
                        />
                        <div className="transcribeTextWordCount">Words {inputText.split(' ').filter(Boolean).length}/280</div>
                    </div>
                    <button 
                        onClick={handleTranscribe}
                        className="transcribeTextButton"
                        disabled={usageCount >= usageLimit}
                    >
                        Transcribe ➔
                    </button>
                    <div className="transcribeTextOutputContainer">
                        <label>Output</label>
                        <textarea 
                            value={outputText}
                            readOnly
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TranscribeText;
