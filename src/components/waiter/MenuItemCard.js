import React from 'react';
import { FaPlus, FaShoppingCart } from 'react-icons/fa';

const MenuItemCard = ({ item, onAddToCart, isAdded }) => {
  return (
    <div className={`menu-card mb-2 ${isAdded ? 'item-added' : ''}`}>
      <div className="menu-image">
        <img src={item.image || 'https://via.placeholder.com/300x200?text=No+Image'} alt={item.name} />
      </div>
      <div className="menu-content">
        <h3>{item.name}</h3>
        <div className="menu-price">${item.price.toFixed(2)}</div>
        
        <div className="flex justify-between items-center mt-2">
          <button 
            className="btn btn-primary btn-sm add-to-cart-btn"
            onClick={onAddToCart}
          >
            <FaShoppingCart className="btn-icon" />
            Thêm
          </button>
        </div>
      </div>
      
      {isAdded && <div className="added-indicator">Đã thên vào đơn!</div>}
    </div>
  );
};

export default MenuItemCard; 