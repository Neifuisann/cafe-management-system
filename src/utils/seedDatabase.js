import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

// Function to seed the menu collection with initial data
const seedMenu = async () => {
  try {
    // Define menu items
    const menuItems = [
      {
        id: 'matcha',
        name: 'Matcha latte',
        price: 25,
        image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      },
      {
        id: 'cafe-flan',
        name: 'Cafe Flan',
        price: 15,
        image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      },
      {
        id: 'cacao',
        name: 'Cacao',
        price: 20,
        image: 'https://images.unsplash.com/photo-1579888071069-0960e7cd1200?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      },
      {
        id: 'soy-milk',
        name: 'Sữa đậu',
        price: 5,
        image: 'https://images.unsplash.com/photo-1579888071069-0960e7cd1200?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      },
      {
        id: 'ice-tea',
        name: 'Trà đá',
        price: 5,
        image: 'https://images.unsplash.com/photo-1579888071069-0960e7cd1200?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      }
    ];

    console.log('Starting to seed menu...');

    // Add each menu item to Firestore
    for (const item of menuItems) {
      await setDoc(doc(db, 'menu', item.id), item);
      console.log(`Added menu item: ${item.name}`);
    }

    console.log('Finished seeding menu!');
    return true;
  } catch (error) {
    console.error('Error seeding menu:', error);
    return false;
  }
};

// Main function to seed the entire database
const seedDatabase = async () => {
  console.log('Starting database seeding...');
  
  await seedMenu();
  
  console.log('Database seeding completed!');
};

export {seedMenu, seedDatabase }; 