import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaCoffee, FaSignOutAlt, FaUser } from 'react-icons/fa';

const Navbar = ({ userRole, user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if a nav link is active
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  // Handle logout click
  const handleLogout = (e) => {
    e.preventDefault();
    onLogout();
    navigate('/login');
  };
  
  return (
    <nav className="navbar">
      <div className="logo">
        <FaCoffee size={24} color="#d85a71" />
        <h1>Cafe</h1>
      </div>
      
      <div className="nav-links">
        {/* Show different navigation links based on user role */}
        {userRole === 'waiter' && (
          <Link 
            to="/waiter" 
            className={`nav-link ${isActive('/waiter') ? 'active' : ''}`}
          >
            Gọi món
          </Link>
        )}
        
        {userRole === 'barista' && (
          <Link 
            to="/barista" 
            className={`nav-link ${isActive('/barista') ? 'active' : ''}`}
          >
            Danh sách đơn
          </Link>
        )}
        
        {userRole === 'manager' && (
          <>
            <Link 
              to="/manager" 
              className={`nav-link ${isActive('/manager') ? 'active' : ''}`}
            >
              Dashboard
            </Link>
          </>
        )}
        
        <div className="user-info">
          <FaUser size={14} />
          <span className="username">{user.username}</span>
          <span className="role-badge">{userRole}</span>
        </div>
        
        <a href="#" className="nav-link logout-link" onClick={handleLogout}>
          <FaSignOutAlt size={16} style={{ marginRight: '5px' }} />
          Đổi
        </a>
      </div>
    </nav>
  );
};

export default Navbar; 