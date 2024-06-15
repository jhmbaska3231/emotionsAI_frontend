import React from 'react';
import './Pricing.css';
import Navbar from './Navbar';
import Footer from './Footer';
import tick_icon from './pictures/tick_icon.png';

const Pricing = () => {
  return (
    <div className="pricing-page">
      <Navbar />

      <button className="button-time">Pay Monthly</button>
        <div className="box1">
          <p className="text-bold">Free</p>
        <button className="black-button">Try now</button>
          <p className="text-normal">
            <img src={tick_icon} alt="Price Logo" style={{ height: '20px' }} />
            Transcribe Text input to Target Emotion
          </p>
          <p className="text-normal">
            <img src={tick_icon} alt="Price Logo" style={{ height: '20px' }} />
            3 Transcribes daily
          </p>
          <p className="text-normal">
            <img src={tick_icon} alt="Price Logo" style={{ height: '20px' }} />
            Capped Word Count
          </p>
        </div>

        <button className="button-time2">Pay Yearly</button>
        <div className="box2">
          <p className="text-bold">$24</p>
          <button className="black-button">Subscribe</button>
          <p className="text-normal">
            <img src={tick_icon} alt="Price Logo" style={{ height: '20px' }} />
            Transcribe Text input to Target Emotion
          </p>
          <p className="text-normal">
            <img src={tick_icon} alt="Price Logo" style={{ height: '20px' }} />
            Transcribe Audio Input to Target Emotion
          </p>
          <p className="text-normal">
            <img src={tick_icon} alt="Price Logo" style={{ height: '20px' }} />
            Emotion Analysis
          </p>
          <p className="text-normal">
            <img src={tick_icon} alt="Price Logo" style={{ height: '20px' }} />
            Diary Recording
          </p>
          <p className="text-normal">
            <img src={tick_icon} alt="Price Logo" style={{ height: '20px' }} />
            Unlimited Transcribes
          </p>
          <p className="text-normal">
            <img src={tick_icon} alt="Price Logo" style={{ height: '20px' }} />
            Full Word Count
          </p>
        </div>
        <Footer />
    </div>
  );
}

export default Pricing;
