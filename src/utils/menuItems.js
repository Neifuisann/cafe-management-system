// This file is deprecated in favor of seedDatabase.js
// Import the seed functions from seedDatabase.js instead
import {seedMenu, seedDatabase } from './seedDatabase';

// Re-export seed functions
export {seedMenu, seedDatabase };

// Keep the original arrays for reference, but they are no longer used
export const defaultMenuItems = []; // Now defined in seedDatabase.js
export const defaultInventoryItems = []; // Now defined in seedDatabase.js 