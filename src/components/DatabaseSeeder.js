import React, { useState } from 'react';
import {seedMenu, seedDatabase } from '../utils/seedDatabase';

const DatabaseSeeder = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedingComplete, setSeedingComplete] = useState(false);
  const [error, setError] = useState(null);

  const handleSeedMenu = async () => {
    setIsSeeding(true);
    setError(null);
    try {
      await seedMenu();
      setSeedingComplete(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleSeedAll = async () => {
    setIsSeeding(true);
    setError(null);
    try {
      await seedDatabase();
      setSeedingComplete(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="database-seeder" style={{ 
      padding: '20px', 
      margin: '20px auto', 
      maxWidth: '600px', 
      border: '1px solid #ccc', 
      borderRadius: '8px',
      background: '#f9f9f9'
    }}>
      <h2>Database Seeder</h2>
      <p>
        Use these buttons to seed your Firebase database with initial data.
        This is useful when setting up the application for the first time.
      </p>
      
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button 
          onClick={handleSeedMenu} 
          disabled={isSeeding}
          style={{
            padding: '8px 16px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isSeeding ? 'not-allowed' : 'pointer'
          }}
        >
          Seed Menu Only
        </button>
        
        <button 
          onClick={handleSeedAll} 
          disabled={isSeeding}
          style={{
            padding: '8px 16px',
            backgroundColor: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isSeeding ? 'not-allowed' : 'pointer'
          }}
        >
          Seed Everything
        </button>
      </div>
      
      {isSeeding && (
        <p style={{ marginTop: '10px', color: '#666' }}>
          Seeding database... Please wait.
        </p>
      )}
      
      {seedingComplete && !isSeeding && (
        <p style={{ marginTop: '10px', color: 'green' }}>
          Database seeding completed successfully! You can now use the application.
        </p>
      )}
      
      {error && (
        <p style={{ marginTop: '10px', color: 'red' }}>
          Error: {error}
        </p>
      )}
    </div>
  );
};

export default DatabaseSeeder; 