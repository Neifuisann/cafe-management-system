import React from 'react';
import { FaThumbtack, FaCheck, FaTimes, FaClock, FaSpinner } from 'react-icons/fa';

const OrderCard = ({ order, onTogglePin, onUpdateStatus, onUpdateItemStatus }) => {
  const { items, status, pinned, orderNumber } = order;
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock />;
      case 'in-progress':
        return <FaSpinner />;
      case 'completed':
        return <FaCheck />;
      default:
        return null;
    }
  };
  
  // Translate status text
  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ';
      case 'in-progress':
        return 'Làm';
      case 'completed':
        return 'Xong';
      default:
        return status;
    }
  };

  // Calculate percentage of completed items
  const totalItems = items.length;
  const completedItems = items.filter(item => item.completed).length;
  const completionPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <div className={`order-card ${pinned ? 'pinned' : ''}`}>
      <div className="order-header">
        <div className="order-info">
          <h3 className="order-title">Đơn #{orderNumber}</h3>
          <span className={`status-badge ${getStatusColor(status)}`}>
            {getStatusIcon(status)}
            <span className="status-text">{getStatusText(status)}</span>
          </span>
        </div>
        <button 
          className={`pin-btn ${pinned ? 'pinned' : ''}`}
          onClick={onTogglePin}
          title={pinned ? 'Bỏ ghim đơn hàng' : 'Ghim đơn hàng'}
        >
          <FaThumbtack />
        </button>
      </div>

      {completionPercentage > 0 && (
        <div className="progress-container">
          <div 
            className="progress-bar" 
            style={{width: `${completionPercentage}%`}}
          ></div>
          <span className="progress-text">{completedItems} / {totalItems} món đã hoàn thành</span>
        </div>
      )}

      <div className="order-items">
        {items.map((item, index) => (
          <div key={index} className={`order-item ${item.completed ? 'completed-item' : ''}`}>
            <div className="item-info">
              <span className="item-name">{item.name}</span>
              <span className="item-quantity">x{item.quantity}</span>
            </div>
            <button
              className={`complete-btn ${item.completed ? 'completed' : ''}`}
              onClick={() => onUpdateItemStatus(index, !item.completed)}
              title={item.completed ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}
            >
              {item.completed ? <FaCheck /> : <FaTimes />}
            </button>
          </div>
        ))}
      </div>

      <div className="order-actions">
        <button
          className={`action-btn ${status === 'pending' ? 'active' : ''}`}
          onClick={() => onUpdateStatus('pending')}
        >
          <FaClock className="action-icon" />
          Chờ
        </button>
        <button
          className={`action-btn ${status === 'in-progress' ? 'active' : ''}`}
          onClick={() => onUpdateStatus('in-progress')}
        >
          <FaSpinner className="action-icon" />
          Làm
        </button>
        <button
          className={`action-btn ${status === 'completed' ? 'active' : ''}`}
          onClick={() => onUpdateStatus('completed')}
        >
          <FaCheck className="action-icon" />
          Xong
        </button>
      </div>
    </div>
  );
};

export default OrderCard; 