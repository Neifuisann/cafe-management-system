import React, { useState } from 'react';
import { FaPlus, FaMinus, FaTrash, FaFileInvoiceDollar, FaTimes, FaArrowDown } from 'react-icons/fa';

const OrderForm = ({ 
  cart, 
  note, 
  setNote, 
  removeFromCart, 
  increaseQuantity, 
  decreaseQuantity, 
  calculateTotal, 
  clearCart, 
  placeOrder 
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [amountGiven, setAmountGiven] = useState('');
  const [change, setChange] = useState(0);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmountGiven(value);
    
    if (value) {
      const total = parseFloat(calculateTotal());
      const given = parseFloat(value);
      const calculatedChange = given - total;
      setChange(calculatedChange >= 0 ? calculatedChange : 0);
    } else {
      setChange(0);
    }
  };

  const handleSubmitPayment = () => {
    if (parseFloat(amountGiven) >= parseFloat(calculateTotal())) {
      placeOrder();
      setShowPaymentModal(false);
      setAmountGiven('');
      setChange(0);
    }
  };

  return (
    <div className="order-form">
      {cart.length === 0 ? (
        <div className="text-center mt-2 mb-2">
          <p className="empty-cart-message">chưa chọn món.</p>
          <p className="empty-cart-instruction">Thêm món để tạo đơn.</p>
        </div>
      ) : (
        <>
          <div className="order-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-details">
                  <div className="item-name">{item.name}</div>
                  <div className="item-price">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
                
                <div className="item-controls">
                  <div className="item-quantity">
                    <button 
                      className="quantity-btn decrease"
                      onClick={() => decreaseQuantity(item.id)}
                      aria-label="Decrease quantity"
                    >
                      <FaMinus size={14} />
                    </button>
                    
                    <span className="quantity-value">{item.quantity}</span>
                    
                    <button 
                      className="quantity-btn increase"
                      onClick={() => increaseQuantity(item.id)}
                      aria-label="Increase quantity"
                    >
                      <FaPlus size={14} />
                    </button>
                  </div>
                  
                  <button 
                    className="btn btn-danger remove-btn"
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove item"
                  >
                    <FaTrash />
                    Xoá
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="form-group mt-2">
            <label htmlFor="note">Ghi chú</label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Thêm ghi chú đặc biệt..."
            ></textarea>
          </div>
          
          <div className="order-summary">
            <div className="order-total">
              <span className="total-label">Tổng:</span>
              <span className="total-amount">${calculateTotal()}</span>
            </div>
          </div>
          
          <div className="order-actions">
            <button 
              className="btn btn-lg btn-danger clear-btn"
              onClick={clearCart}
            >
              <FaTimes className="btn-icon" />
              Xoá
            </button>
            
            <button 
              className="btn btn-lg btn-primary place-btn"
              onClick={() => setShowPaymentModal(true)}
              disabled={cart.length === 0}
            >
              <FaFileInvoiceDollar className="btn-icon" />
              Xác nhận
            </button>
          </div>

          {/* Payment Modal */}
          {showPaymentModal && (
            <div className="modal-overlay">
              <div className="modal-content payment-modal">
                <div className="payment-header">
                  <h2>Thanh toán</h2>
                  <button 
                    className="close-btn"
                    onClick={() => setShowPaymentModal(false)}
                  >
                    <FaTimes />
                  </button>
                </div>
                
                <div className="payment-body">
                  <div className="total-amount">
                    <span>Tổng:</span>
                    <span>${calculateTotal()}</span>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="amountGiven">Khách đưa:</label>
                    <input
                      type="number"
                      id="amountGiven"
                      value={amountGiven}
                      onChange={handleAmountChange}
                      placeholder="Nhập số tiền khách đưa "
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  {change > 0 && (
                    <div className="change-amount">
                      <span>Thối lại:</span>
                      <span>${change.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                
                <div className="payment-footer">
                  <button 
                    className="btn btn-lg btn-danger"
                    onClick={() => setShowPaymentModal(false)}
                  >
                    Huỷ
                  </button>
                  <button 
                    className="btn btn-lg btn-primary"
                    onClick={handleSubmitPayment}
                    disabled={!amountGiven || parseFloat(amountGiven) < parseFloat(calculateTotal())}
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderForm; 