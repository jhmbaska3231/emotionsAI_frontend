import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentPopup.css';

import axios, { setBearerToken } from './api/axiosConfig';
import { fetchAuthSession, signOut } from 'aws-amplify/auth';

const PaymentPopup = ({ isOpen, onClose, subscriptionPlan }) => {
  
  const [cardNumber, setCardNumber] = useState('');
  const [expiration, setExpiration] = useState('');
  const [cvc, setCvc] = useState('');
  const [country, setCountry] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleExpirationInput = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setExpiration(value);

    if (value.length === 5) {
      const [month, year] = value.split('/');
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;

      const monthInt = parseInt(month, 10);
      const yearInt = parseInt(year, 10) + 2000;

      if (monthInt < 1 || monthInt > 12) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          expiration: 'Month must be between 01 and 12',
        }));
      } else if (yearInt < currentYear || (yearInt === currentYear && monthInt < currentMonth)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          expiration: 'Expiration date cannot be in the past',
        }));
      } else {
        setErrors((prevErrors) => {
          const { expiration, ...rest } = prevErrors;
          return rest;
        });
      }
    }
};

  const handleCardNumberInput = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 16);
    value = value.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(value);
  };

  const handleCvcInput = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 3) {
      value = value.slice(0, 3);
    }
    setCvc(value);
  };

  const handleCountryInput = (e) => {
    let value = e.target.value.replace(/[^a-zA-Z]/g, '');
    setCountry(value);
  };

  const validateForm = () => {
    const errors = {};
    if (!cardNumber || !/^\d{16}$/.test(cardNumber.replace(/\s+/g, ''))) {
      errors.cardNumber = 'Card number is required and should be 16 digits';
    }
    if (!expiration) {
      errors.expiration = 'Expiration date is required';
    } else {
      const [month, year] = expiration.split('/');
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;

      const monthInt = parseInt(month, 10);
      const yearInt = parseInt(year, 10) + 2000;

      if (monthInt < 1 || monthInt > 12) {
          errors.expiration = 'Month must be between 01 and 12';
      } else if (yearInt < currentYear || (yearInt === currentYear && monthInt < currentMonth)) {
          errors.expiration = 'Expiration date cannot be in the past';
      }
    }
    if (!cvc || !/^\d{3}$/.test(cvc)) {
      errors.cvc = 'CVC is required and should be 3 digits';
    }
    if (!country) {
      errors.country = 'Country is required';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const session = await fetchAuthSession();
        const { accessToken, idToken } = session.tokens ?? {};
        if (accessToken && idToken) {
          setBearerToken(accessToken.toString());

          const userId = idToken.payload.sub;
          await axios.post(`/api/users/${userId}/upgrade`, null, {
            params: { subscriptionPlan },
          });
          
          setSuccess(true);
          setTimeout(async () => {
            alert('Your account has been upgraded!');
            await signOut({ global: true });
            navigate('/');
          }, 1000);
        } else {
          console.error('ID token not found in session');
        }
      } catch (error) {
        console.error('Error upgrading user:', error);
      }
    }
  };

  const handleClose = () => {
    setCardNumber('');
    setExpiration('');
    setCvc('');
    setCountry('');
    setErrors({});
    setSuccess(false);
    onClose();
  };

  return (
    <div className="pp-popup-overlay">
      <div className="pp-popup-container">
        <button className="pp-popup-close-button" onClick={handleClose}>X</button>
        <h2 className="pp-popup-header">Payment</h2>
        <form className="pp-payment-form" onSubmit={handleSubmit}>
          <div className="pp-form-group">
            <label htmlFor="cardNumber">Card number</label>
            <input
              type="text"
              id="cardNumber"
              placeholder="1234 1234 1234 1234"
              value={cardNumber}
              onChange={handleCardNumberInput}
            />
            {errors.cardNumber && <span className="pp-error">{errors.cardNumber}</span>}
          </div>
          <div className="pp-form-row">
            <div className="pp-form-group">
              <label htmlFor="expiration">Expiration</label>
              <input
                type="text"
                id="expiration"
                placeholder="MM/YY"
                maxLength="5"
                value={expiration}
                onChange={handleExpirationInput}
              />
              {errors.expiration && <span className="pp-error">{errors.expiration}</span>}
            </div>
            <div className="pp-form-group">
              <label htmlFor="cvc">CVC</label>
              <input
                type="text"
                id="cvc"
                placeholder="CVC"
                value={cvc}
                onChange={handleCvcInput}
              />
              {errors.cvc && <span className="pp-error">{errors.cvc}</span>}
            </div>
          </div>
          <div className="pp-form-group">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              placeholder="Country"
              value={country}
              onChange={handleCountryInput}
            />
            {errors.country && <span className="pp-error">{errors.country}</span>}
          </div>
          <button type="submit" className="pp-confirm-button">Confirm</button>
        </form>
        {success && <div className="pp-success-message">Payment successful!</div>}
      </div>
    </div>
  );

};

export default PaymentPopup;
