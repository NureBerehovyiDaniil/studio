export type OrderStatus = 'Pending Assignment' | 'Out for Delivery' | 'Delivered' | 'Delayed' | 'Picked Up';

export interface Order {
  id: string;
  customerName: string;
  address: string;
  items: string[];
  status: OrderStatus;
  estimatedDeliveryTime: string; // ISO string
  deliveryLat: number;
  deliveryLon: number;
  pickupLat?: number; // Optional: if different from courier start
  pickupLon?: number; // Optional: if different from courier start
  assignedCourierId?: string;
}

export interface Courier {
  id: string;
  name: string;
  currentLocation: {
    lat: number;
    lng: number;
  };
  phone: string;
  vehicleType: 'Bike' | 'Car' | 'Van';
}
