import type { Order, Courier } from './types';

export const mockCouriers: Courier[] = [
  {
    id: 'courier-1',
    name: 'John Doe',
    currentLocation: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
    phone: '555-1234',
    vehicleType: 'Bike',
  },
  {
    id: 'courier-2',
    name: 'Jane Smith',
    currentLocation: { lat: 34.0550, lng: -118.2500 }, // Near LA
    phone: '555-5678',
    vehicleType: 'Car',
  },
  {
    id: 'courier-3',
    name: 'Mike Ross',
    currentLocation: { lat: 34.0480, lng: -118.2450 }, // Near LA
    phone: '555-8765',
    vehicleType: 'Van',
  },
];

export const mockOrders: Order[] = [
  {
    id: 'order-101',
    customerName: 'Alice Wonderland',
    address: '123 Main St, Los Angeles, CA',
    items: ['Large Pizza', 'Soda'],
    status: 'Pending Assignment',
    estimatedDeliveryTime: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(), // 1 hour from now
    deliveryLat: 34.0600,
    deliveryLon: -118.2500,
    assignedCourierId: 'courier-1',
  },
  {
    id: 'order-102',
    customerName: 'Bob The Builder',
    address: '456 Oak Ave, Los Angeles, CA',
    items: ['Sushi Platter', 'Green Tea'],
    status: 'Out for Delivery',
    estimatedDeliveryTime: new Date(Date.now() + 0.5 * 60 * 60 * 1000).toISOString(), // 30 mins from now
    deliveryLat: 34.0500,
    deliveryLon: -118.2300,
    assignedCourierId: 'courier-1',
  },
  {
    id: 'order-103',
    customerName: 'Charlie Brown',
    address: '789 Pine Ln, Los Angeles, CA',
    items: ['Burger and Fries'],
    status: 'Delivered',
    estimatedDeliveryTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    deliveryLat: 34.0700,
    deliveryLon: -118.2600,
    assignedCourierId: 'courier-2',
  },
  {
    id: 'order-104',
    customerName: 'Diana Prince',
    address: '321 Maple Dr, Los Angeles, CA',
    items: ['Salad Bowl', 'Smoothie'],
    status: 'Picked Up',
    estimatedDeliveryTime: new Date(Date.now() + 0.75 * 60 * 60 * 1000).toISOString(), // 45 mins from now
    deliveryLat: 34.0450,
    deliveryLon: -118.2200,
    assignedCourierId: 'courier-2',
  },
   {
    id: 'order-105',
    customerName: 'Edward Scissorhands',
    address: '567 Palm Rd, Los Angeles, CA',
    items: ['Pasta Carbonara', 'Garlic Bread'],
    status: 'Pending Assignment',
    estimatedDeliveryTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    deliveryLat: 34.0650,
    deliveryLon: -118.2550,
    assignedCourierId: 'courier-3',
  },
];
