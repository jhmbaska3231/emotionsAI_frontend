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
                    <h1>Diary</h1>
                    {/* Add the content and functionality for the Diary page here */}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Diary;
