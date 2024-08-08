import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './Checkout.css';

const stripePromise = loadStripe('your-publishable-key-here');

const CheckoutForm = ({ cart, handleCheckout }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);

  const processCheckout = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        email: email
      }
    });

    if (error) {
      console.error(error);
      setIsProcessing(false);
      setPaymentResult({ success: false, message: error.message });
    } else {
      console.log('Payment method created:', paymentMethod);
      // Handle the payment processing here (e.g., send to your backend)
      const response = await fetch('/api/charge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          items: cart,
          email
        })
      });
      
      const paymentResult = await response.json();

      setIsProcessing(false);
      setPaymentResult(paymentResult);

      if (paymentResult.success) {
        handleCheckout();
      }
    }
  };

  return (
    <form onSubmit={processCheckout}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <CardElement className="stripe-element" />
      <button type="submit" disabled={!stripe || isProcessing}>
        {isProcessing ? 'Processing...' : 'Place Order'}
      </button>
      {paymentResult && (
        <div className={paymentResult.success ? 'success' : 'error'}>
          {paymentResult.message}
        </div>
      )}
    </form>
  );
};

const Checkout = ({ cart, handleCheckout }) => {
  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="checkout">
        <h2>Checkout</h2>
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div>{item.name}</div>
              <div>${item.price.toFixed(2)}</div>
              <div>Quantity: {item.quantity}</div>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <div>Total Price: ${calculateTotal()}</div>
        </div>
        <CheckoutForm cart={cart} handleCheckout={handleCheckout} />
      </div>
    </Elements>
  );
};

export default Checkout;
