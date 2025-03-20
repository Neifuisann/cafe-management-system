# Cozy Cafe Management System

A complete cafe management system for ordering, inventory tracking, and sales reporting.

## Overview

This application provides a comprehensive solution for managing a cafe business with three main user roles:

- **Waiters**: Take and submit orders from customers
- **Baristas**: View and manage the preparation of orders
- **Managers**: Manage inventory, menu items, and view sales reports

The system is built using React and Firebase, allowing for real-time updates and data synchronization across all devices.

## Features

### For Waiters
- Browse menu items
- Add items to order with quantity control
- Add special notes to orders
- Calculate total price
- Process payment and calculate change

### For Baristas
- See a queue of pending orders sorted by age
- Mark orders as in-progress or completed
- Pin important orders to the top
- Mark individual items in an order as complete
- View order notes

### For Managers
- Monitor inventory levels with low stock alerts
- Update inventory quantities
- Manage menu items and their ingredient requirements
- View detailed sales reports with filtering by date
- Export reports as CSV

## Technologies Used

- **Frontend**: React, React Router, SASS
- **State Management**: Context API with useReducer
- **Backend**: Firebase (Firestore)
- **Authentication**: Simple role-based (can be extended with Firebase Auth)
- **UI Components**: Custom components with React Icons
- **Styling**: Custom SCSS with responsive design

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cafe-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Enable Firestore database
   - Update the Firebase configuration in `src/firebase/config.js` with your project details:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

4. Start the development server:
```bash
npm start
```

## Usage

1. **Login Page**: Select a role (waiter, barista, or manager) and enter any username/password (for demo purposes)

2. **Waiter Dashboard**:
   - Browse menu items on the left
   - Click "Add to Order" to add items to the current order
   - Adjust quantities as needed
   - Add notes for special requests
   - Click "Place Order" to process the order
   - Enter the payment amount to calculate change

3. **Barista Dashboard**:
   - View all orders sorted by time
   - Pin important orders
   - Update status of orders or individual items
   - View order notes

4. **Manager Dashboard**:
   - View key metrics on the dashboard
   - Check low stock alerts
   - Manage inventory levels
   - Add/edit menu items
   - View sales reports and export data

## Database Structure

The application uses Firebase Firestore with the following collections:

- **menu**: Menu items with ingredients and pricing
- **inventory**: Inventory items with quantity tracking
- **orders**: Customer orders with status tracking

## Extending the Application

This application can be extended in several ways:

1. **User Authentication**: Implement proper authentication with Firebase Auth
2. **Table Management**: Add functionality for managing tables in the cafe
3. **Customer Profiles**: Track regular customers and their preferences
4. **Online Ordering**: Allow customers to place orders through a mobile app
5. **Kitchen Display System**: Add a dedicated interface for kitchen staff
6. **Loyalty Program**: Implement a rewards system for returning customers

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons provided by [React Icons](https://react-icons.github.io/react-icons/)
- Placeholder images from [Unsplash](https://unsplash.com/)
