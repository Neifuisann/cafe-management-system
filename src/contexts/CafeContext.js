import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc,
  getDocs
} from 'firebase/firestore';
import { db } from '../firebase/config';

const CafeContext = createContext();

const initialState = {
  orders: [],
  menu: [],
  loading: true,
  error: null
};

function cafeReducer(state, action) {
  switch (action.type) {
    case 'SET_ORDERS':
      return { ...state, orders: action.payload, loading: false };
    case 'SET_MENU':
      return { ...state, menu: action.payload, loading: false };
    case 'ADD_ORDER':
      return { ...state, orders: [...state.orders, action.payload], loading: false };
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id ? action.payload : order
        ),
        loading: false
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

export function CafeProvider({ children }) {
  const [state, dispatch] = useReducer(cafeReducer, initialState);

  // Fetch orders from Firestore with real-time updates
  const fetchOrders = () => {
    const ordersQuery = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      dispatch({ type: 'SET_ORDERS', payload: ordersData });
    }, (error) => {
      console.error('Error fetching orders:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    });

    return unsubscribe;
  };

  // Fetch menu from Firestore with real-time updates
  const fetchMenu = () => {
    const menuQuery = query(collection(db, 'menu'), orderBy('name'));
    const unsubscribe = onSnapshot(menuQuery, (snapshot) => {
      const menuData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      dispatch({ type: 'SET_MENU', payload: menuData });
    }, (error) => {
      console.error('Error fetching menu:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    });

    return unsubscribe;
  };

  // Add new order
  const addOrder = async (order) => {
    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        ...order,
        status: 'pending',
        timestamp: new Date()
      });
      
      const newOrder = {
        id: docRef.id,
        ...order,
        status: 'pending',
        timestamp: new Date()
      };
      
      dispatch({ type: 'ADD_ORDER', payload: newOrder });
      return newOrder;
    } catch (error) {
      console.error('Error adding order:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status });
      
      const updatedOrder = {
        ...state.orders.find(order => order.id === orderId),
        status
      };
      
      dispatch({ type: 'UPDATE_ORDER', payload: updatedOrder });
      return updatedOrder;
    } catch (error) {
      console.error('Error updating order:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // General update order function
  const updateOrder = async (orderId, updates) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, updates);
      
      const currentOrder = state.orders.find(order => order.id === orderId);
      if (!currentOrder) {
        throw new Error(`Order with ID ${orderId} not found`);
      }
      
      const updatedOrder = {
        ...currentOrder,
        ...updates
      };
      
      dispatch({ type: 'UPDATE_ORDER', payload: updatedOrder });
      return updatedOrder;
    } catch (error) {
      console.error('Error updating order:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Initialize data fetching
  useEffect(() => {
    const unsubscribeOrders = fetchOrders();
    const unsubscribeMenu = fetchMenu();

    return () => {
      if (unsubscribeOrders) unsubscribeOrders();
      if (unsubscribeMenu) unsubscribeMenu();
    };
  }, []);

  const value = {
    ...state,
    addOrder,
    updateOrderStatus,
    updateOrder
  };

  return (
    <CafeContext.Provider value={value}>
      {children}
    </CafeContext.Provider>
  );
}

export function useCafe() {
  const context = useContext(CafeContext);
  if (!context) {
    throw new Error('useCafe must be used within a CafeProvider');
  }
  return context;
} 