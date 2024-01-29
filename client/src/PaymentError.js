import React from 'react';

import { useNavigate } from 'react-router-dom'; // Assuming you're using react-router v6

import './PaymentProcess.css'; 



const PaymentError = () => {
  const navigate = useNavigate();

  // Function to navigate back to the home page
  const handleBackHome = () => {
    navigate('/');
  };

  const handleBackToPricing = () => {
    navigate('/pricing');
  };

  return (
    <div className="payment-confirmation-container">
      <div className="payment-confirmation">
        <div className="payment-confirmation-content">
          <div className="payment-confirmation-header">
            <h2>Payment failure</h2>
            <p>Nothing to worry about, you're almost there. Why don't you try again?</p>
          </div>
          
          <div className="payment-confirmation-actions">
          
          <button className="button-try-again" onClick={handleBackToPricing}>Try Again</button>
          <button className="button-back-home" onClick={handleBackHome}>Back Home</button>
        </div>
        </div>
        <div className="payment-confirmation-image">
          <img src={"https://img.freepik.com/vecteurs-premium/concept-mascotte-oiseau-rouge_105238-314.jpg"} alt="Payment Confirmation" />
        </div>
      </div>
    </div>
  );
};

export default PaymentError;
