import React from 'react';

import { useNavigate } from 'react-router-dom'; // Assuming you're using react-router v6

import './PaymentProcess.css'; 



const PaymentConfirmation = () => {
  const navigate = useNavigate();

  // Function to navigate back to the home page
  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div className="payment-confirmation-container">
      <div className="payment-confirmation">
        <div className="payment-confirmation-content">
          <div className="payment-confirmation-header">
            <h2>Payment successful</h2>
            <p>Look like you're part of family now !</p>
          </div>
          
          <div className="payment-confirmation-actions">
            <button className="button-try-again" onClick={handleBackHome}>Back Home</button>
          </div>
        </div>
        <div className="payment-confirmation-image">
          <img src={"https://img.freepik.com/vecteurs-premium/logo-mascotte-hibou_990404-1996.jpg"} alt="Payment Confirmation" />
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
