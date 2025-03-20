import React, { useState, useEffect } from 'react';
import { useCafe } from '../../contexts/CafeContext';
import { 
  FaChartLine, 
  FaMoneyBillWave, 
  FaChartBar,
  FaCoffee,
  FaExclamationTriangle
} from 'react-icons/fa';
import '../../styles/Manager.scss';

const Manager = () => {
  const { menu, orders } = useCafe();
  
  // Dashboard Statistics
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    popularItems: [],
    lowStockItems: [],
    recentOrders: []
  });

  // Calculate dashboard statistics
  useEffect(() => {
    const calculateStats = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayOrders = orders.filter(order => {
        const orderDate = order.timestamp?.toDate?.() || new Date(order.timestamp);
        return orderDate >= today;
      });

      const totalRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
      
      // Calculate popular items
      const itemCounts = {};
      orders.forEach(order => {
        order.items.forEach(item => {
          itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
        });
      });

      const popularItems = Object.entries(itemCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));
      
      // Get low stock items
      const lowStockItems = menu.filter(item => item.stock < 10);
      
      setStats({
        totalOrders: todayOrders.length,
        totalRevenue,
        averageOrderValue: todayOrders.length > 0 ? totalRevenue / todayOrders.length : 0,
        popularItems,
        lowStockItems,
        recentOrders: orders.slice(0, 5)
      });
    };

    calculateStats();
  }, [orders, menu]);

  return (
    <div className="manager-container">
      <div className="manager-content">
        <div className="dashboard-grid">
          {/* Quick Stats */}
          <div className="stats-card">
            <div className="stat-item">
              <div className="stat-icon">
                <FaChartLine />
              </div>
              <div className="stat-info">
                <h3>Đơn Hôm Nay</h3>
                <p>{stats.totalOrders}</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <FaMoneyBillWave />
              </div>
              <div className="stat-info">
                <h3>Doanh Thu</h3>
                <p>${stats.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <FaChartBar />
              </div>
              <div className="stat-info">
                <h3>TB/Đơn</h3>
                <p>${stats.averageOrderValue.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Popular Items */}
          <div className="card">
            <div className="card-header">
              <h3>Món Bán Chạy</h3>
            </div>
            <div className="card-body">
              <div className="popular-items">
                {stats.popularItems.map((item, index) => (
                  <div key={index} className="popular-item">
                    <span className="item-name">{item.name}</span>
                    <span className="item-count">{item.count} đơn</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="card">
            <div className="card-header">
              <h3>Đơn Gần Đây</h3>
            </div>
            <div className="card-body">
              <div className="recent-orders">
                {stats.recentOrders.map(order => (
                  <div key={order.id} className="recent-order">
                    <div className="order-info">
                      <span className="order-id">Đơn #{order.orderNumber}</span>
                      <span className="order-time">
                        {order.timestamp?.toDate?.().toLocaleTimeString()}
                      </span>
                    </div>
                    <span className="order-amount">${order.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manager; 