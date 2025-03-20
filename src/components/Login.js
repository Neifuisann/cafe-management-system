import React, { useState, useEffect } from 'react';
import { FaUser, FaMugHot, FaChartLine } from 'react-icons/fa';
import '../styles/Login.scss';

const Login = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState('waiter');
  const [username, setUsername] = useState('');
  const [prevUsername, setPrevUsername] = useState('');
  
  // Check if user was previously logged in
  useEffect(() => {
    const prevUser = localStorage.getItem('cafeUser');
    if (prevUser) {
      try {
        const userData = JSON.parse(prevUser);
        if (userData.username) {
          setPrevUsername(userData.username);
        }
      } catch (error) {
        console.error('Error parsing previous user data:', error);
      }
    }
    
    // Set previously selected role if available
    const prevRole = localStorage.getItem('prevRole');
    if (prevRole) {
      setSelectedRole(prevRole);
    }
  }, []);
  
  // Store selected role for future use
  useEffect(() => {
    localStorage.setItem('prevRole', selectedRole);
  }, [selectedRole]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      alert('Please enter your username');
      return;
    }
    // Pass the entered username and empty password
    onLogin(username, '', selectedRole);
  };
  
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Vào Café</h2>
        
        {prevUsername && (
          <div className="welcome-back">
            Welcome back! You were previously logged in as <strong>{prevUsername}</strong>
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="username">Tên đăng nhập</label>
          <input 
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nhập tên đăng nhập"
            className="form-control"
          />
        </div>
        
        <div className="role-selector">
          <div 
            className={`role-option ${selectedRole === 'waiter' ? 'active' : ''}`}
            onClick={() => setSelectedRole('waiter')}
          >
            <div className="role-icon">
              <FaUser />
            </div>
            <div className="role-name">Gọi món</div>
          </div>
          
          <div 
            className={`role-option ${selectedRole === 'barista' ? 'active' : ''}`}
            onClick={() => setSelectedRole('barista')}
          >
            <div className="role-icon">
              <FaMugHot />
            </div>
            <div className="role-name">Pha chế</div>
          </div>
          
          <div 
            className={`role-option ${selectedRole === 'manager' ? 'active' : ''}`}
            onClick={() => setSelectedRole('manager')}
          >
            <div className="role-icon">
              <FaChartLine />
            </div>
            <div className="role-name">Quản lý</div>
          </div>
        </div>
        
        <button 
          onClick={handleSubmit} 
          className="btn btn-primary btn-login"
        >
          Vào làm {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
        </button>
      </div>
    </div>
  );
};

export default Login; 