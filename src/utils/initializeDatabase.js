import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../firebase/config';
import {seedMenu } from './seedDatabase';

// Initialize database with default data
export const initializeDatabase = async () => {
  try {
    console.log('Checking if initialization is needed...');
    
    // First try a simple query to test connectivity
    try {
      const testQuery = query(collection(db, 'menu'));
      await getDocs(testQuery);
    } catch (connectError) {
      console.error('Firebase connection error:', connectError);
      alert('Failed to connect to Firebase database. Please check your internet connection and Firebase configuration.');
      return false;
    }
    
    // Check if menu items already exist
    const menuQuery = query(collection(db, 'menu'));
    const menuSnapshot = await getDocs(menuQuery);
    
    // Check if inventory already exists
    const inventoryQuery = query(collection(db, 'inventory'));
    const inventorySnapshot = await getDocs(inventoryQuery);
    
    // If both collections are empty, initialize the database
    if (menuSnapshot.empty && inventorySnapshot.empty) {
      console.log('Initializing database with default data...');
      
      try {
        // Seed inventory items
        
        // Seed menu items
        await seedMenu();
        
        console.log('Database initialization complete!');
        return true;
      } catch (writeError) {
        console.error('Error writing to database:', writeError);
        alert('Failed to initialize the database. Please check your Firebase permissions.');
        return false;
      }
    } else {
      console.log('Database already initialized, skipping...');
      return true; // Return true if the database is already initialized
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    alert('An error occurred during database initialization. Please refresh the page or check console for details.');
    return false;
  }
};

// Call this function in your App.js or other startup component
// Example: useEffect(() => { initializeDatabase(); }, []); 