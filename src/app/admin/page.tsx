'use client';

import { useState, useEffect } from 'react';
import type { Courier, Order } from '@/lib/types';
import { mockCouriers, mockOrders } from '@/lib/mock-data';
import { CourierMap } from './components/courier-map';
import { DelayPredictionCard } from './components/delay-prediction-card';
import { SiteHeader } from '@/components/site-header';
import { Map, BarChart3, Users, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AdminPage() {
  const [couriers, setCouriers] = useState<Courier[]>(mockCouriers);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedCourier, setSelectedCourier] = useState<Courier | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Simulate real-time courier location updates
    const intervalId = setInterval(() => {
      setCouriers(prevCouriers =>
        prevCouriers.map(courier => ({
          ...courier,
          currentLocation: {
            lat: courier.currentLocation.lat + (Math.random() - 0.5) * 0.001,
            lng: courier.currentLocation.lng + (Math.random() - 0.5) * 0.001,
          },
        }))
      );
    }, 5000); // Update every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  const handleCourierSelect = (courier: Courier) => {
    setSelectedCourier(courier);
  };

  const getCourierOrders = (courierId: string) => {
    return orders.filter(order => order.assignedCourierId === courierId && (order.status === 'Out for Delivery' || order.status === 'Picked Up'));
  };
  
  const getCourierInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader title="Admin Dashboard" Icon={Map} showHomeLink={true} />
      <main className="flex-1 container mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center">
                <Users className="mr-2 h-6 w-6 text-primary" /> Couriers Real-Time Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isClient && (
                 <div className="h-[400px] md:h-[500px] rounded-md overflow-hidden border">
                    <CourierMap couriers={couriers} onCourierSelect={handleCourierSelect} selectedCourierId={selectedCourier?.id} />
                 </div>
              )}
              {!isClient && <div className="h-[400px] md:h-[500px] bg-muted rounded-md flex items-center justify-center"><p>Loading map...</p></div>}
            </CardContent>
          </Card>
           <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center">
                <AlertTriangle className="mr-2 h-6 w-6 text-destructive" /> Potential Delay Prediction
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isClient ? (
                <DelayPredictionCard selectedCourier={selectedCourier} orders={orders} />
              ) : (
                <p className="text-muted-foreground">Loading prediction tool...</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center">
                <Users className="mr-2 h-6 w-6 text-primary" /> Courier Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <ul className="space-y-3">
                  {couriers.map(courier => {
                    const activeOrders = getCourierOrders(courier.id);
                    return (
                      <li key={courier.id} 
                          className={`p-3 rounded-md border cursor-pointer transition-all ${selectedCourier?.id === courier.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'}`}
                          onClick={() => handleCourierSelect(courier)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && handleCourierSelect(courier)}
                          aria-label={`Select courier ${courier.name}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={`https://placehold.co/40x40.png?text=${getCourierInitials(courier.name)}`} alt={courier.name} data-ai-hint="avatar person" />
                              <AvatarFallback>{getCourierInitials(courier.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">{courier.name}</p>
                              <p className="text-xs text-muted-foreground">{courier.vehicleType}</p>
                            </div>
                          </div>
                          <Badge variant={activeOrders.length > 0 ? 'default' : 'outline'}>
                            {activeOrders.length} active
                          </Badge>
                        </div>
                        {activeOrders.length > 0 && (
                          <div className="mt-2 pl-4 border-l-2 border-primary/20">
                            <p className="text-xs font-medium mb-1">Active Orders:</p>
                            <ul className="space-y-0.5">
                            {activeOrders.slice(0,2).map(order => (
                                <li key={order.id} className="text-xs text-muted-foreground">
                                  #{order.id} to {order.customerName}
                                </li>
                            ))}
                            {activeOrders.length > 2 && <li className="text-xs text-muted-foreground">...and {activeOrders.length - 2} more</li>}
                            </ul>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
         
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center">
                <BarChart3 className="mr-2 h-6 w-6 text-primary" /> Delivery Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                View detailed analytics on delivery times, courier performance, and more.
              </p>
              <Button asChild className="w-full">
                <Link href="/admin/analytics">
                  Go to Analytics Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
       <footer className="py-4 text-center text-sm text-muted-foreground border-t">
        Verydeli Admin Dashboard &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
