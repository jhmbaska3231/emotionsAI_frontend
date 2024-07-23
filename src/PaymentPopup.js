import React from 'react';
import './PaymentPopup.css';

const PaymentPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleExpirationInput = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    e.target.value = value;
  };

  return (
    <div className="pp-popup-overlay">
      <div className="pp-popup-container">
        <button className="pp-popup-close-button" onClick={onClose}>X</button>
        <h2 className="pp-popup-header">Payment</h2>
        <form className="pp-payment-form">
          <div className="pp-form-group">
            <label htmlFor="cardNumber">Card number</label>
            <input type="text" id="cardNumber" placeholder="1234 1234 1234 1234" />
          </div>
          <div className="pp-form-row">
            <div className="pp-form-group">
              <label htmlFor="expiration">Expiration</label>
              <input
                type="text"
                id="expiration"
                placeholder="MM/YY"
                maxLength="5"s
                onInput={handleExpirationInput}
              />
            </div>
            <div className="pp-form-group">
              <label htmlFor="cvc">CVC</label>
              <input type="text" id="cvc" placeholder="CVC" />
            </div>
          </div>
          <div className="pp-form-group">
            <label htmlFor="country">Country</label>
            <input type="text" id="country" placeholder="Country" />
          </div>
          <button type="submit" className="pp-confirm-button">Confirm</button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPopup;
