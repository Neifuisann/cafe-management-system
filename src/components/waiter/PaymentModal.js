import React, { useState, useEffect } from 'react';
import { FaTimes, FaMoneyBillWave, FaCreditCard, FaCheck } from 'react-icons/fa';
import { useCafe } from '../../contexts/CafeContext';

const PaymentModal = ({ total, onClose, onSubmit }) => {
  const { calculateChange } = useCafe();
  
  const [amountPaid, setAmountPaid] = useState('');
  const [change, setChange] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [error, setError] = useState('');
  
  // Handle amount paid change
  const handleAmountChange = (e) => {
    const value = e.target.value;
    
    // Only allow numbers and decimal points
    if (/^\d*\.?\d*$/.test(value)) {
      setAmountPaid(value);
      
      // Calculate change if valid
      if (value && !isNaN(parseFloat(value))) {
        const calculatedChange = calculateChange(parseFloat(total), parseFloat(value));
        setChange(calculatedChange);
      } else {
        setChange(0);
      }
    }
  };
  
  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'cash' && (!amountPaid || parseFloat(amountPaid) < parseFloat(total))) {
      setError('The amount paid must be equal to or greater than the total.');
      return;
    }
    
    onSubmit(paymentMethod === 'cash' ? amountPaid : total);
  };
  
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Payment</h2>
          <button className="btn btn-text" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="modal-body">
          {error && <div className="alert alert-danger">{error}</div>}
          
          <div className="mb-2">
            <h3 className="text-center mb-1">Total: ${parseFloat(total).toFixed(2)}</h3>
          </div>
          
          <div className="payment-methods mb-2">
            <div className="flex justify-center gap-2">
              <button 
                className={`btn ${paymentMethod === 'cash' ? 'btn-primary' : 'btn-text'}`}
                onClick={() => setPaymentMethod('cash')}
              >
                <FaMoneyBillWave className="btn-icon" />
                Cash
              </button>
              
              <button 
                className={`btn ${paymentMethod === 'card' ? 'btn-primary' : 'btn-text'}`}
                onClick={() => setPaymentMethod('card')}
              >
                <FaCreditCard className="btn-icon" />
                Card
              </button>
            </div>
          </div>
          
          {paymentMethod === 'cash' && (
            <div className="form-group">
              <label htmlFor="amountPaid">Amount Paid</label>
              <input
                type="text"
                id="amountPaid"
                value={amountPaid}
                onChange={handleAmountChange}
                placeholder="Enter amount paid"
                autoFocus
              />
              
              {amountPaid && parseFloat(amountPaid) >= parseFloat(total) && (
                <div className="change-calculation mt-2">
                  <div className="flex justify-between">
                    <span>Change:</span>
                    <span className="text-primary font-bold">${change.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button className="btn btn-text" onClick={onClose}>
            Cancel
          </button>
          
          <button 
            className="btn btn-success" 
            onClick={handleSubmit}
            disabled={paymentMethod === 'cash' && (!amountPaid || parseFloat(amountPaid) < parseFloat(total))}
          >
            <FaCheck className="btn-icon" />
            Complete Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 