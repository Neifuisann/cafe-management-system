import React, { useState, useEffect } from 'react';
import { useCafe } from '../../contexts/CafeContext';
import { FaPlus, FaMinus, FaTrash, FaEdit, FaSave, FaFileInvoiceDollar, FaCheck, FaTimes } from 'react-icons/fa';
import MenuItemCard from './MenuItemCard';
import OrderForm from './OrderForm';
import '../../styles/Waiter.scss';

const Waiter = () => {
  const { menu, addOrder, orders, loading, error } = useCafe();
  
  const [cart, setCart] = useState([]);
  const [note, setNote] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [addedItemId, setAddedItemId] = useState(null);
  
  // Calculate total price
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };
  
  // Add item to cart with visual effect
  const addToCart = (menuItem) => {
    setAddedItemId(menuItem.id);
    
    // Reset the effect after animation completes
    setTimeout(() => {
      setAddedItemId(null);
    }, 500);
    
    const existingItem = cart.find(item => item.id === menuItem.id);
    
    if (existingItem) {
      // Item already in cart, increase quantity
      setCart(cart.map(item => 
        item.id === menuItem.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      // Add new item to cart
      setCart([...cart, { ...menuItem, quantity: 1 }]);
    }
  };
  
  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };
  
  // Increase item quantity
  const increaseQuantity = (itemId) => {
    setCart(cart.map(item => 
      item.id === itemId 
        ? { ...item, quantity: item.quantity + 1 } 
        : item
    ));
  };
  
  // Decrease item quantity
  const decreaseQuantity = (itemId) => {
    setCart(cart.map(item => 
      item.id === itemId 
        ? { ...item, quantity: Math.max(1, item.quantity - 1) } 
        : item
    ));
  };
  
  // Clear cart
  const clearCart = () => {
    setCart([]);
    setNote('');
  };
  
  // Place order
  const placeOrder = async () => {
    if (cart.length === 0) {
      return;
    }
    
    try {
      // Get the next order number based on existing orders
      const sortedOrders = [...orders].sort((a, b) => {
        const aTime = a.timestamp?.toDate?.() || a.timestamp;
        const bTime = b.timestamp?.toDate?.() || b.timestamp;
        return aTime - bTime;
      });
      
      const nextOrderNumber = sortedOrders.length + 1;
      setOrderNumber(nextOrderNumber);
      
      const order = {
        items: cart,
        note,
        total: parseFloat(calculateTotal()),
        orderNumber: nextOrderNumber,
        tableNumber: '', // Could be added in the future
        customerName: '', // Could be added in the future
        timestamp: new Date()
      };
      
      // Submit order
      await addOrder(order);
      setShowConfirmation(true);
      
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };
  
  // Close confirmation and reset
  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    clearCart();
  };

  // Group menu items into a 2x3 grid (6 items per page)
  const renderMenuGrid = () => {
    if (loading) {
      return (
        <div className="text-center col-12">
          <div className="spinner"></div>
          <p>Loading menu...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="alert alert-danger col-12">
          {error}
        </div>
      );
    }

    if (menu.length === 0) {
      return (
        <div className="text-center col-12">
          <p>No menu items available.</p>
        </div>
      );
    }

    // Create a 2x3 grid layout
    const rows = [];
    for (let i = 0; i < menu.length; i += 2) {
      const row = (
        <div key={`row-${i}`} className="menu-row">
          {menu[i] && (
            <div className="menu-item">
              <MenuItemCard
                item={menu[i]}
                onAddToCart={() => addToCart(menu[i])}
                isAdded={addedItemId === menu[i].id}
              />
            </div>
          )}
          {menu[i+1] && (
            <div className="menu-item">
              <MenuItemCard
                item={menu[i+1]}
                onAddToCart={() => addToCart(menu[i+1])}
                isAdded={addedItemId === menu[i+1].id}
              />
            </div>
          )}
        </div>
      );
      rows.push(row);
    }

    return <div className="menu-grid">{rows}</div>;
  };
  
  return (
    <div className="waiter-container">
      <h1 className="text-primary mb-3">Bảng gọi món</h1>
      
      <div className="waiter-layout">
        {/* Menu Items in 2x3 grid */}
        <div className="menu-section">
          <div className="card">
            <div className="card-header">
              <h2>Menu</h2>
            </div>
            <div className="card-body">
              {renderMenuGrid()}
            </div>
          </div>
        </div>
        
        {/* Order Form */}
        <div className="order-section">
          <div className="card">
            <div className="card-header">
              <h2>Thông tin đơn</h2>
            </div>
            <div className="card-body">
              <OrderForm 
                cart={cart}
                note={note}
                setNote={setNote}
                removeFromCart={removeFromCart}
                increaseQuantity={increaseQuantity}
                decreaseQuantity={decreaseQuantity}
                calculateTotal={calculateTotal}
                clearCart={clearCart}
                placeOrder={placeOrder}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Order Confirmation Modal */}
      {showConfirmation && (
        <div className="modal-overlay">
          <div className="modal-content confirmation-modal">
            <div className="confirmation-header">
              <FaCheck className="confirmation-icon" />
              <h2>Đã lên đơn!</h2>
            </div>
            
            <div className="confirmation-body">
              <div className="order-id">
                <span>Đơn số #</span>
                <span className="order-number">{orderNumber}</span>
              </div>
              
              <p>Đơn đã được xác nhận và gửi cho bếp.</p>
              <p className="total-confirmation">Tổng: ${calculateTotal()}</p>
            </div>
            
            <div className="confirmation-footer">
              <button 
                className="btn btn-lg btn-primary"
                onClick={handleConfirmationClose}
              >
                Xong
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Waiter; 