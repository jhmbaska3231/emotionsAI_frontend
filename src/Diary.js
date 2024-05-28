import React from 'react';
import PaidNavbar from './PaidNavbar';
import Footer from './Footer';
import './Diary.css';

// Import FontAwesome components and icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faBarChart, faBook } from '@fortawesome/free-solid-svg-icons';

const Diary = () => {
    return (
        <div className="diary-container">
            <PaidNavbar />
            <div className="main-content">
                <div className="sidebar">
                    <h1>Dashboard</h1>
                    <ul>
                        <li>
                            <FontAwesomeIcon icon={faList} className="icon" />
                            Dashboard
                        </li>
                    </ul>
                    <h1>Utilities</h1>
                    <ul>
                        <li>
                            <FontAwesomeIcon icon={faBarChart} className="icon" />
                            Monthly Analysis
                        </li>
                        <li>
                            <FontAwesomeIcon icon={faBook} className="icon" />
                            Diary Ledge
                        </li>
                    </ul>
                </div>
                <div className="diary-content">
                    <div className="ledger-box">
                        <h2>Diary Ledger</h2>
                        <div className="ledger-content">
                            <div className="ledger-row">
                                <div className="ledger-column date-column">
                                    <h3>Date</h3>
                                    <p>2024-05-01</p>
                                </div>
                                <div className="ledger-column diary-column">
                                    <h3>Diary</h3>
                                    <p>Today I started a new projectJKNASF NKJANFNIWAONIFOWANIOFNWAINFIAWNFIWANLFNjksanfawnfiuawnifwSAKJNFIPUAWFKSA FIAUWBFUIW</p>
                                </div>
                                <div className="ledger-column emotion-column">
                                    <h3>Emotion Analysis</h3>
                                    <p>HaJKBS FLKSBFIUAWBIFLNSLKAJLBFIWUBFKSAAOISFJNOIWABNIUFAWppy</p>
                                </div>
                            </div>
                            <div className="ledger-row">
                                <div className="ledger-column date-column">
                                    <p>2024-05-02</p>
                                </div>
                                <div className="ledger-column diary-column">
                                    <p>Work was challenging but rewarding...</p>
                                </div>
                                <div className="ledger-column emotion-column">
                                    <p>Stressed</p>
                                </div>
                            </div>
                            <div className="ledger-row">
                                <div className="ledger-column date-column">
                                    <p>2024-05-03</p>
                                </div>
                                <div className="ledger-column diary-column">
                                    <p>Had a productive meeting with the team...</p>
                                </div>
                                <div className="ledger-column emotion-column">
                                    <p>Motivated</p>
                                </div>
                            </div>
                            <div className="ledger-row">
                                <div className="ledger-column date-column">
                                    <p>2024-05-04</p>
                                </div>
                                <div className="ledger-column diary-column">
                                    <p>Completed the task ahead of schedule...</p>
                                </div>
                                <div className="ledger-column emotion-column">
                                    <p>Accomplished</p>
                                </div>
                            </div>
                            <div className="ledger-row">
                                <div className="ledger-column date-column">
                                    <p>2024-05-05</p>
                                </div>
                                <div className="ledger-column diary-column">
                                    <p>Reflecting on the week's achievements...</p>
                                </div>
                                <div className="ledger-column emotion-column">
                                    <p>Satisfied</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Diary;
