import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import './Pricing.css';
import FAQ from './FaqButton';
import Navbar from './Navbar';
import Footer from './Footer';

const Pricing = () => {
  return (
    <>
      <Navbar />
      <div className="pricing-page">
        <h1 className="pricing-header">Choose Your Subscription</h1>
        <p className="pricing-subheader">Unlock full access to EmotionsAI features without any limitations.</p>
        <div className="pricing-box-container">
          <div className="pricing-box">
            <p className="pricing-text-bold">FREE</p>
            <div className="pricing-price-container">
                <span className="pricing-price">$0</span><span className="pricing-period">/month</span>
            </div>
            <hr className="pricing-divider" />
            <div className="pricing-features">
              <p className="pricing-text-normal">
                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px' }} />
                Transcribe Text input to Target Emotion
              </p>
              <p className="pricing-text-normal">
                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px' }} />
                3 Transcribes daily
              </p>
              <p className="pricing-text-normal">
                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px' }} />
                Capped Word Count
              </p>
            </div>
            <button className="pricing-button">Choose this plan</button>
          </div>
          <div className="pricing-box">
            <p className="pricing-text-bold">MONTHLY</p>
            <div className="pricing-price-container">
              <span className="pricing-price">$12</span><span className="pricing-period">/month</span>
            </div>
            <hr className="pricing-divider" />
            <div className="pricing-features">
              <p className="pricing-text-normal">
                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px' }} />
                Transcribe Text input to Target Emotion
              </p>
              <p className="pricing-text-normal">
                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px' }} />
                Transcribe Audio Input to Target Emotion
              </p>
              <p className="pricing-text-normal">
                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px' }} />
                Emotion Analysis
              </p>
              <p className="pricing-text-normal">
                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px' }} />
                Diary Recording
              </p>
              <p className="pricing-text-normal">
                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px' }} />
                Unlimited Transcribes
              </p>
              <p className="pricing-text-normal">
                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px' }} />
                Full Word Count
              </p>
            </div>
            <button className="pricing-button">Choose this plan</button>
          </div>
          <div className="pricing-box">
            <p className="pricing-text-bold">YEARLY</p>
            <div className="pricing-price-container">
              <span className="pricing-price">$100</span><span className="pricing-period">/year</span>
            </div>
            <hr className="pricing-divider" />
            <div className="pricing-features">
              <p className="pricing-text-normal">
                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px' }} />
                Transcribe Text input to Target Emotion
              </p>
              <p className="pricing-text-normal">
                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px' }} />
                Transcribe Audio Input to Target Emotion
              </p>
              <p className="pricing-text-normal">
                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px' }} />
                Emotion Analysis
              </p>
              <p className="pricing-text-normal">
                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px' }} />
                Diary Recording
              </p>
              <p className="pricing-text-normal">
                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px' }} />
                Unlimited Transcribes
              </p>
              <p className="pricing-text-normal">
                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px' }} />
                Full Word Count
              </p>
            </div>
            <button className="pricing-button">Choose this plan</button>
          </div>
        </div>
      </div>
      <FAQ />
      <Footer />
    </>
  );
}

export default Pricing;
