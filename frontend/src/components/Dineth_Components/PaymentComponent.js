import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, useElements, useStripe, Elements } from '@stripe/react-stripe-js';
import axios from 'axios';

// Load Stripe with your public key
const stripePromise = loadStripe('pk_test_51R5PyFC8IDGMDNld0b2JntyZKfEuwelrOBGnNaK7MhZjy8ZBebz1zg7OhNitFPmBu6rLPdkGEdHAUJFvWVo2WWmr00gAdanMVQ');  // Replace with your actual publishable key

const PaymentComponent = () => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('usd');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const stripe = useStripe();
  const elements = useElements();

  // Function to handle the payment
  const handlePayment = async () => {
    if (!amount || !currency) {
      setError('Please enter a valid amount and currency.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Request to create Payment Intent on the server
      const { data } = await axios.post('http://localhost:5000/api/payment/create-payment-intent', {
        amount: amount * 100,  // Stripe requires the amount in cents
        currency,
      });

      const clientSecret = data.clientSecret;

      // Confirm the payment with the client secret and card element
      const cardElement = elements.getElement(CardElement);
      const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (stripeError) {
        setError(stripeError.message);
      } else {
        alert('Payment Successful!');
      }
    } catch (err) {
      setError('Something went wrong! Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Payment</h2>
      
      <div className="space-y-4">
        {/* Input for Amount */}
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          min="1"
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
        
        {/* Select Currency */}
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
          <option value="gbp">GBP</option>
        </select>
        
        {/* Stripe Card Element */}
        <div className="p-3 border border-gray-300 rounded-md bg-gray-50">
          <CardElement className="w-full p-2" />
        </div>
        
        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none disabled:bg-blue-300"
        >
          {loading ? 'Processing...' : 'Pay'}
        </button>
        
        {/* Error Message */}
        {error && <p className="text-red-500 text-center">{error}</p>}
      </div>
    </div>
  );
};

// Wrapper to initialize Stripe Elements
const PaymentWithStripe = () => (
  <Elements stripe={stripePromise}>
    <PaymentComponent />
  </Elements>
);

export default PaymentWithStripe;
