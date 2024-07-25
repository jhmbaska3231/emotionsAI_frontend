import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import './FreeUserUpgradePage.css';
import FAQ from './FaqButton';
import Footer from './Footer';
import PaymentPopup from './PaymentPopup';

const FreeUserUpgradePage = () => {
  const [isPaymentPopupOpen, setIsPaymentPopupOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');

  const openPaymentPopup = (plan) => {
    setSelectedPlan(plan);
    setIsPaymentPopupOpen(true);
  };

  const closePaymentPopup = () => {
    setIsPaymentPopupOpen(false);
  };

  return (
    <>
      <div className="free-upgrade-page">
        <h1 className="free-upgrade-header">Choose Your Subscription</h1>
        <p className="free-upgrade-subheader">Unlock full access to EmotionsAI features without any limitations.</p>
        <div className="free-upgrade-box-container">
          <div className="free-upgrade-box">
            <p className="free-upgrade-text-bold">FREE</p>
            <div className="free-upgrade-price-container">
                <span className="free-upgrade-price">$0</span><span className="free-upgrade-period">/month</span>
            </div>
            <hr className="free-upgrade-divider" />
            <div className="free-upgrade-features">
              <p className="free-upgrade-text-normal">
                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px' }} />
                Transcribe Text input to Target Emotion
              </p>
              <p className="free-upgrade-text-normal">
                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px' }} />
                3 Transcribes daily
              </p>
              <p className="free-upgrade-text-normal">
                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px' }} />
                Capped Word Count
              </p>
            </div>
            <button className="free-upgrade-button" disabled>Current Plan</button>
          </div>
          <div className="free-upgrade-box">
            <p className="free-upgrade-text-bold">MONTHLY</p>
            <div className="free-upgrade-price-container">
              <span className="free-upgrade-price">$100</span><span className="free-upgrade-period">/month</span>
            </div>
            <hr className="free-upgrade-divider" />
            <div className="free-upgrade-features">
              <p className="free-upgrade-text-normal">
                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px' }} />
                Transcribe Text input to Target Emotion
              </p>
              <p className="free-upgrade-text-normal">
                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px' }} />
                Transcribe Audio Input to Target Emotion
              </p>
              <p className="free-upgrade-text-normal">
                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px' }} />
                Emotion Analysis
              </p>
              <p className="free-upgrade-text-normal">
                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px' }} />
                Diary Recording
              </p>
              <p className="free-upgrade-text-normal">
                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px' }} />
                Unlimited Transcribes
              </p>
              <p className="free-upgrade-text-normal">
                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px' }} />
                Full Word Count
              </p>
            </div>
            <button className="free-upgrade-button" onClick={() => openPaymentPopup('MONTHLY')}>Choose this plan</button>
          </div>
          <div className="free-upgrade-box">
            <p className="free-upgrade-text-bold">YEARLY</p>
            <div className="free-upgrade-price-container">
              <span className="free-upgrade-price">$1080</span><span className="free-upgrade-period">/year</span>
            </div>
            <hr className="free-upgrade-divider" />
            <div className="free-upgrade-features">
              <p className="free-upgrade-text-normal">
                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px' }} />
                Transcribe Text input to Target Emotion
              </p>
              <p className="free-upgrade-text-normal">
                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px' }} />
                Transcribe Audio Input to Target Emotion
              </p>
              <p className="free-upgrade-text-normal">
                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px' }} />
                Emotion Analysis
              </p>
              <p className="free-upgrade-text-normal">
                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px' }} />
                Diary Recording
              </p>
              <p className="free-upgrade-text-normal">
                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px' }} />
                Unlimited Transcribes
              </p>
              <p className="free-upgrade-text-normal">
                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px' }} />
                Full Word Count
              </p>
            </div>
            <button className="free-upgrade-button" onClick={() => openPaymentPopup('YEARLY')}>Choose this plan</button>
          </div>
        </div>
      </div>
      <FAQ />
      <Footer />
      <PaymentPopup isOpen={isPaymentPopupOpen} onClose={closePaymentPopup} subscriptionPlan={selectedPlan} />
    </>
  );
}

export default FreeUserUpgradePage;
