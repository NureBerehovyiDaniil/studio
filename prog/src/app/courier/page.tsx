'use client';

import { useState, useEffect } from 'react';
import type { Order } from '@/lib/types';
import { mockOrders, mockCouriers } from '@/lib/mock-data';
import { OrderCard } from './components/order-card';
import { SiteHeader } from '@/components/site-header';
import { Truck, ListFilter, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

// Assume a logged-in courier for demo purposes
const CURRENT_COURIER_ID = 'courier-1'; 

export default function CourierPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const courierOrders = mockOrders.filter(order => order.assignedCourierId === CURRENT_COURIER_ID);
      setOrders(courierOrders);
      setFilteredOrders(courierOrders);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let tempOrders = orders;

    if (statusFilter !== 'all') {
      tempOrders = tempOrders.filter(order => order.status.toLowerCase().replace(' ', '-') === statusFilter);
    }

    if (searchTerm) {
      tempOrders = tempOrders.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredOrders(tempOrders);
  }, [statusFilter, searchTerm, orders]);

  const handleOrderStatusUpdate = (orderId: string, newStatus: Order['status']) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };
  
  const courierName = mockCouriers.find(c => c.id === CURRENT_COURIER_ID)?.name || "Courier";

  const refreshOrders = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const courierOrders = mockOrders.filter(order => order.assignedCourierId === CURRENT_COURIER_ID);
      setOrders(courierOrders);
      setFilteredOrders(courierOrders); // Reset filters or reapply
      setStatusFilter('all');
      setSearchTerm('');
      setIsLoading(false);
    }, 500);
  };

  const availableStatuses = ['all', 'pending-assignment', 'picked-up', 'out-for-delivery', 'delivered', 'delayed'];

  if (isLoading) {
    return (
      <>
        <SiteHeader title={`${courierName}'s Dashboard`} Icon={Truck} showHomeLink={true} />
        <main className="flex-1 container mx-auto p-4 md:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-10 w-1/4" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <CardSkeleton key={i}/>
            ))}
          </div>
        </main>
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader title={`${courierName}'s Dashboard`} Icon={Truck} showHomeLink={true} />
      <main className="flex-1 container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center p-4 bg-card rounded-lg shadow">
          <Input 
            placeholder="Search by Order ID, Customer, Address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex gap-2 items-center">
             <ListFilter className="text-muted-foreground h-5 w-5" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {availableStatuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={refreshOrders} aria-label="Refresh orders">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {filteredOrders.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredOrders.map(order => (
              <OrderCard key={order.id} order={order} onStatusUpdate={handleOrderStatusUpdate} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Truck className="mx-auto h-24 w-24 text-muted-foreground opacity-50" />
            <h2 className="mt-6 text-2xl font-headline">No orders found</h2>
            <p className="mt-2 text-muted-foreground">
              {searchTerm || statusFilter !== 'all' ? "Try adjusting your filters or search term." : "You currently have no assigned orders."}
            </p>
            <Button onClick={refreshOrders} className="mt-6">
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh Orders
            </Button>
          </div>
        )}
      </main>
       <footer className="py-4 text-center text-sm text-muted-foreground border-t">
        Verydeli Courier Portal &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-card p-6 rounded-lg shadow space-y-4">
      <div className="flex justify-between items-start">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-5 w-1/4" />
      </div>
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-10 w-1/2" />
      </div>
    </div>
  )
}
