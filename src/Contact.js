import React, { useState } from 'react';
import Navbar from './Navbar';
import './Contact.css';

const EmptyFillableBox = () => {
    const [inputValue, setInputValue] = useState('');
  
    const handleChange = (event) => {
      setInputValue(event.target.value);
    };
  
    return (
      <div className="empty-fillable-box">
        <input
          type="text"
          className="input-field"
          value={inputValue}
          onChange={handleChange}
          placeholder="Enter text"
        />
      </div>
    );
  };

  const EmptyFillableBox2 = () => {
    const [inputValue, setInputValue] = useState('');
  
    const handleChange = (event) => {
      setInputValue(event.target.value);
    };
  
    return (
      <div className="empty-fillable-box2">
        <input
          type="text"
          className="input-field"
          value={inputValue}
          onChange={handleChange}
          placeholder="Enter text"
        />
      </div>
    );
  };

  const EmptyFillableBox3 = () => {
    const [inputValue, setInputValue] = useState('');
  
    const handleChange = (event) => {
      setInputValue(event.target.value);
    };
  
    return (
      <div className="empty-fillable-box3">
        <input
          type="text"
          className="input-field"
          value={inputValue}
          onChange={handleChange}
          placeholder="Enter text"
        />
      </div>
    );
  };

const Contact = () => {
  
  return (
    
    <div className="Contact-page">
      <Navbar />
        <div class="box-contact">
          <p class="text-bold">Contact Us</p>

          <p className="text-normal">Name</p>
    <div className="fillable-box-container">
      <EmptyFillableBox />
    </div>

<div className="form-row">
  <div className="form-column">
    <p className="text-normal">Email</p>
    <div className="fillable-box-container">
      <EmptyFillableBox />
    </div>
  </div>
  <div className="form-column">
    <p className="text-normal">Phone</p>
    <div className="fillable-box-container">
      <EmptyFillableBox />
    </div>
  </div>
</div>


<p className="text-normal">Subject</p>
    <div className="empty-fillable-box2">
      <EmptyFillableBox2 />
    </div>

    <p className="text-normal">Message</p>
    <div className="empty-fillable-box3">
      <EmptyFillableBox3 />
    </div>

    <button className="black-button" onClick={() => alert("Form Submitted")}>Submit</button>
        </div>
      </div>
  );
}

export default Contact;
