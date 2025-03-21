import React, { useState, useEffect } from 'react';
import { useCafe } from '../../contexts/CafeContext';
import { 
  FaSort, 
  FaThumbtack, 
  FaFilter, 
  FaClock, 
  FaCheckCircle, 
  FaSpinner, 
  FaHourglassHalf,
  FaListUl,
  FaBell
} from 'react-icons/fa';
import OrderCard from './OrderCard';
import '../../styles/Barista.scss';

const Barista = () => {
  const { orders, updateOrder } = useCafe();
  
  const [sortMethod, setSortMethod] = useState('oldest'); // 'oldest' or 'newest'
  const [filter, setFilter] = useState('pending'); // Only 'pending' or 'in-progress' now
  const [orderCounts, setOrderCounts] = useState({
    pending: 0,
    'in-progress': 0
  });
  
  // Calculate order counts for each status
  useEffect(() => {
    const uniqueOrders = Array.from(
      new Map(orders.map(order => [order.id, order])).values()
    );
    
    const counts = {
      pending: uniqueOrders.filter(order => order.status === 'pending').length,
      'in-progress': uniqueOrders.filter(order => order.status === 'in-progress').length,
    };
    
    setOrderCounts(counts);
  }, [orders]);
  
  // Toggle pin status of an order
  const togglePinOrder = async (orderId, isPinned) => {
    try {
      const result = await updateOrder(orderId, { pinned: !isPinned });
      if (!result) {
        console.warn(`Could not pin order ${orderId}, it may have been completed or removed`);
      }
    } catch (error) {
      console.error('Error toggling pin status:', error);
    }
  };
  
  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      const result = await updateOrder(orderId, { status });
      if (!result) {
        console.warn(`Could not update status for order ${orderId}, it may have been completed or removed`);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };
  
  // Mark specific items in an order as complete
  const updateOrderItemStatus = async (orderId, itemIndex, isComplete) => {
    try {
      // Get the current order
      const order = orders.find(o => o.id === orderId);
      
      if (order) {
        // Create updated items array
        const updatedItems = [...order.items];
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          completed: isComplete
        };
        
        // Check if all items are complete
        const allItemsComplete = updatedItems.every(item => item.completed);
        
        // Update the order
        const result = await updateOrder(orderId, { 
          items: updatedItems,
          status: allItemsComplete ? 'completed' : 'in-progress'
        });
        
        if (!result && allItemsComplete) {
          // If we're completing the order but can't update it, it's likely already completed
          console.info(`Order ${orderId} items marked as complete. Order may have been removed from view.`);
        } else if (!result) {
          console.warn(`Could not update items for order ${orderId}, it may have been completed or removed`);
        }
      } else {
        console.warn(`Order ${orderId} not found in current state`);
      }
    } catch (error) {
      console.error('Error updating item status:', error);
    }
  };
  
  // Filter orders
  const filterOrders = () => {
    // First, deduplicate orders to prevent duplicates with same ID
    const uniqueOrders = Array.from(
      new Map(orders.map(order => [order.id, order])).values()
    );
    
    // Sort all orders by timestamp first to establish the base order numbers
    const sortedOrders = [...uniqueOrders].sort((a, b) => {
      const aTime = a.timestamp?.toDate?.() || a.timestamp;
      const bTime = b.timestamp?.toDate?.() || b.timestamp;
      return aTime - bTime;
    });

    // Assign order numbers based on creation time
    const ordersWithNumbers = sortedOrders.map((order, index) => ({
      ...order,
      orderNumber: index + 1
    }));
    
    let filteredOrders = [...ordersWithNumbers];
    
    // Apply status filter - only pending or in-progress
    filteredOrders = filteredOrders.filter(order => order.status === filter);
    
    // Sort filtered orders based on pin status and timestamp
    filteredOrders.sort((a, b) => {
      // Pinned orders always come first
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      
      // Sort by timestamp
      const aTime = a.timestamp?.toDate?.() || a.timestamp;
      const bTime = b.timestamp?.toDate?.() || b.timestamp;
      
      if (sortMethod === 'oldest') {
        return aTime - bTime;
      } else {
        return bTime - aTime;
      }
    });
    
    return filteredOrders;
  };
  
  // Get filtered and sorted orders
  const filteredOrders = filterOrders();
  
  // Helper to get status name
  const getStatusName = (statusKey) => {
    switch(statusKey) {
      case 'pending': return 'Chờ';
      case 'in-progress': return 'Làm';
      default: return statusKey;
    }
  };
  
  return (
    <div className="barista-container">
      <div className="card main-card">
        <div className="card-header">
          <div className="header-title">
            <h2>Bảng Nhận Order</h2>
            {orderCounts.pending > 0 && (
              <div className="notification-badge">
                <FaBell />
                <span>{orderCounts.pending}</span>
              </div>
            )}
          </div>
          
          <div className="filter-controls">
            {/* Filter options */}
            <div className="filter-group">
              <label className="filter-label">
                <FaFilter className="filter-icon" />
                Lọc:
              </label>
              <div className="filter-buttons">
                <button 
                  className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                  onClick={() => setFilter('pending')}
                  title="Đơn Hàng Đang Chờ"
                >
                  <FaClock />
                  {orderCounts.pending > 0 && (
                    <span className="count-badge urgent">{orderCounts.pending}</span>
                  )}
                </button>
                <button 
                  className={`filter-btn ${filter === 'in-progress' ? 'active' : ''}`}
                  onClick={() => setFilter('in-progress')}
                  title="Đơn Hàng Đang Thực Hiện"
                >
                  <FaSpinner />
                  {orderCounts['in-progress'] > 0 && (
                    <span className="count-badge">{orderCounts['in-progress']}</span>
                  )}
                </button>
              </div>
            </div>
            
            {/* Sort button */}
            <div className="sort-group">
              <label className="sort-label">
                <FaSort className="sort-icon" />
                Sắp Xếp:
              </label>
              <button 
                className={`sort-btn ${sortMethod === 'oldest' ? 'active' : ''}`}
                onClick={() => setSortMethod(sortMethod === 'oldest' ? 'newest' : 'oldest')}
                title={`Sắp xếp theo ${sortMethod === 'oldest' ? 'mới nhất' : 'cũ nhất'} trước`}
              >
                <FaHourglassHalf />
                {sortMethod === 'oldest' ? 'Cũ Nhất Trước' : 'Mới Nhất Trước'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="filter-info">
          <span>Hiển thị <strong>{filteredOrders.length}</strong> {getStatusName(filter)}</span>
        </div>
        
        <div className="card-body">
          {filteredOrders.length === 0 ? (
            <div className="text-center mt-2 mb-2">
              <p>Không có {filter !== 'all' ? getStatusName(filter).toLowerCase() : ''} đơn hàng nào để hiển thị.</p>
            </div>
          ) : (
            <div className="orders-list">
              {filteredOrders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onTogglePin={() => togglePinOrder(order.id, order.pinned)}
                  onUpdateStatus={(status) => updateOrderStatus(order.id, status)}
                  onUpdateItemStatus={(itemIndex, isComplete) => 
                    updateOrderItemStatus(order.id, itemIndex, isComplete)
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Barista; 