import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CafeProvider } from './contexts/CafeContext';
import { initializeDatabase } from './utils/initializeDatabase';
import DatabaseSeeder from './components/DatabaseSeeder';

// Import styles
import './styles/App.scss';
import './styles/Login.scss';
import './styles/Waiter.scss';

// Lazy load components for better performance
const Navbar = React.lazy(() => import('./components/Navbar'));
const Waiter = React.lazy(() => import('./components/waiter/Waiter'));
const Barista = React.lazy(() => import('./components/barista/Barista'));
const Manager = React.lazy(() => import('./components/manager/Manager'));
const Login = React.lazy(() => import('./components/Login'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="loading-fallback">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);

function App() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [initError, setInitError] = useState(null);
  
  // Load user data from localStorage on app startup
  useEffect(() => {
    const savedUser = localStorage.getItem('cafeUser');
    const savedRole = localStorage.getItem('cafeUserRole');
    
    if (savedUser && savedRole) {
      setUser(JSON.parse(savedUser));
      setUserRole(savedRole);
    }
  }, []);
  
  // Initialize database when app starts
  useEffect(() => {
    const initialize = async () => {
      try {
        const success = await initializeDatabase();
        if (!success) {
          setInitError("Failed to initialize database. See console for details.");
        }
        setInitializing(false);
      } catch (error) {
        console.error('Error initializing app:', error);
        setInitError("An unexpected error occurred during initialization.");
        setInitializing(false);
      }
    };
    
    initialize();
  }, []);
  
  // Updated login function to store username and role in localStorage
  const handleLogin = (username, password, role) => {
    const userData = { username: username || 'cafe_user' };
    setUser(userData);
    setUserRole(role);
    
    // Save to localStorage for persistence
    localStorage.setItem('cafeUser', JSON.stringify(userData));
    localStorage.setItem('cafeUserRole', role);
    
    return true;
  };
  
  // Logout function
  const handleLogout = () => {
    setUser(null);
    setUserRole(null);
    
    // Remove from localStorage
    localStorage.removeItem('cafeUser');
    localStorage.removeItem('cafeUserRole');
  };
  
  if (initializing) {
    return <LoadingFallback />;
  }
  
  if (initError) {
    return (
      <div className="error-container">
        <h2>Initialization Error</h2>
        <p>{initError}</p>
        <button 
          className="btn btn-primary" 
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }
  
  return (
    <Router>
      <CafeProvider>
        <div className="app">
          <React.Suspense fallback={<LoadingFallback />}>
            {user && <Navbar userRole={userRole} user={user} onLogout={handleLogout} />}
            
            <div className="content">
              <Routes>
                {/* Public route */}
                <Route 
                  path="/login" 
                  element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} 
                />
                
                {/* Database seeder route */}
                <Route
                  path="/setup-database"
                  element={<DatabaseSeeder />}
                />
                
                {/* Protected routes */}
                <Route
                  path="/waiter"
                  element={user ? (
                    <Waiter />
                  ) : (
                    <Navigate to="/login" />
                  )}
                />
                
                <Route
                  path="/barista"
                  element={user ? (
                    <Barista />
                  ) : (
                    <Navigate to="/login" />
                  )}
                />
                
                <Route
                  path="/manager/*"
                  element={user ? (
                    <Manager />
                  ) : (
                    <Navigate to="/login" />
                  )}
                />
                
                {/* Redirect based on role */}
                <Route
                  path="/"
                  element={
                    user ? (
                      userRole === 'waiter' ? (
                        <Navigate to="/waiter" />
                      ) : userRole === 'barista' ? (
                        <Navigate to="/barista" />
                      ) : userRole === 'manager' ? (
                        <Navigate to="/manager" />
                      ) : (
                        <Navigate to="/login" />
                      )
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
              </Routes>
            </div>
            
          </React.Suspense>
        </div>
      </CafeProvider>
    </Router>
  );
}

export default App;
