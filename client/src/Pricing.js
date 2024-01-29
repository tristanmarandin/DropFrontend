import { useRef, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

import './Pricing.css';

const Pricing = () => {

    const navigate = useNavigate(); // Initialize the navigate function

    // Function to handle back navigation
    const goBack = () => {
        navigate(-1); // Navigates to the previous page in the history stack
    };

    const upgradeUser = async (newRole) => {
        try {

            const response = await fetch(`http://localhost:3000/api/user/upgradeUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    newRole: newRole
                }),

            });
            if (response.ok) {
                console.log('Payment Finalisation...');

                const StripeUrl = await response.text();
                window.location.href = StripeUrl;              

            } else {
                console.error('Failed during the payment process');
                window.location.href = "http://localhost:3000/payment-error";
            }
        } catch (error) {
            console.error(error);
            window.location.href = "http://localhost:3000/payment-error";
        }
      }  
    

    return (
        <>
            <div className="top-bar">
                <button onClick={goBack} className="back-arrow">←</button>
            </div>
            <div className="pricing-header">
                <h1>Pricing</h1>
                <p className="plan-description">
                    Choisissez le plan qui <span className="underline">vous</span> correspond.
                </p>
            </div>
            <div className="pricing-container">
                <div className="card">
                <div className="card-image truck"></div>
                <div className="card-content">
                    <h2>Occasionnel</h2>
                    <p className="price">4.99 €</p>
                    <p className="details">- 500 générations</p>
                    <button onClick={() => upgradeUser("PAYASYOUGO")}>Choisir</button>
                </div>
                </div>
                
                <div className="card">
                <div className="card-image plane"></div>
                <div className="card-content">
                    <h2>Premium</h2>
                    <p className="price">19.99 € /mois</p>
                    <p className="details">- Générations illimitées</p>
                    <button onClick={() => upgradeUser("PREMIUM")}>Choisir</button>
                </div>
                </div>
            </div>
            <div className="faq-section">
            <div className="faq-container">
                <h3>Can I upgrade or downgrade my plan?</h3>
                <p>You can change plans at any time by choosing a new plan above. If you upgrade you will be pro-rated (only pay the difference). If you downgrade you will have a discount applied to future months.</p>
            </div>
            <div className="faq-container">
                <h3>Do you accept PayPal?</h3>
                <p>We don't currently accept PayPal. You'll see all available payment methods on the checkout page after choosing a plan.</p>
            </div>
            <div className="faq-container">
                <h3>Can I keep my images private?</h3>
                <p>Sure, your work is yours. Just click on your image, then on the lock.</p>
            </div>
            <div className="faq-container">
                <h3>Can you give me a receipt or invoice for tax purposes?</h3>
                <p>Yes, you can download receipts and invoices once subscribed to a plan.</p>
            </div>
            <div className="faq-container">
                <h3>Can I use images for commercial purposes?</h3>
                <p>Sure.</p>
            </div>
            <div className="faq-container">
                <h3>Where can I ask more questions?</h3>
                <p>Call me to 07 86 22 66 04.</p>
            </div>
            </div>
        </>
    );
  };
  

export default Pricing