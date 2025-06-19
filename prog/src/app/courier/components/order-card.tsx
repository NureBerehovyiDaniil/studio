'use client';

import type { Order, OrderStatus } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, UserCircle, MapPin, Clock, CheckCircle, Truck, AlertTriangle, Ban } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface OrderCardProps {
  order: Order;
  onStatusUpdate: (orderId: string, newStatus: OrderStatus) => void;
}

export function OrderCard({ order, onStatusUpdate }: OrderCardProps) {
  const handlePickUp = () => {
    onStatusUpdate(order.id, 'Picked Up');
  };

  const handleDeliver = () => {
    onStatusUpdate(order.id, 'Delivered');
  };

  const getStatusVariant = (status: OrderStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Picked Up':
        return 'default'; // Primary color
      case 'Out for Delivery':
        return 'secondary';
      case 'Delivered':
        return 'default'; // Greenish, but shadcn default is fine
      case 'Delayed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'Picked Up':
        return <Truck className="h-4 w-4 mr-1" />;
      case 'Out for Delivery':
        return <Truck className="h-4 w-4 mr-1" />;
      case 'Delivered':
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case 'Delayed':
        return <AlertTriangle className="h-4 w-4 mr-1" />;
      case 'Pending Assignment':
        return <Clock className="h-4 w-4 mr-1" />;
      default:
        return <Package className="h-4 w-4 mr-1" />;
    }
  };


  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-headline mb-1">Order #{order.id}</CardTitle>
          <Badge variant={getStatusVariant(order.status)} className="whitespace-nowrap flex items-center">
            {getStatusIcon(order.status)}
            {order.status}
          </Badge>
        </div>
        <CardDescription className="flex items-center text-sm">
          <UserCircle className="h-4 w-4 mr-2 text-muted-foreground" />
          {order.customerName}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex items-start">
          <MapPin className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
          <p className="text-sm">{order.address}</p>
        </div>
        <div className="flex items-center">
          <Package className="h-4 w-4 mr-2 text-muted-foreground" />
          <p className="text-sm">{order.items.join(', ')}</p>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
          <p className="text-sm">ETA: {format(parseISO(order.estimatedDeliveryTime), "PPpp")}</p>
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        <div className="w-full flex gap-3">
          <Button
            onClick={handlePickUp}
            disabled={order.status === 'Picked Up' || order.status === 'Out for Delivery' || order.status === 'Delivered'}
            className="w-full"
            aria-label={`Mark order ${order.id} as picked up`}
          >
            <Truck className="mr-2 h-4 w-4" /> Picked Up
          </Button>
          <Button
            onClick={handleDeliver}
            disabled={order.status !== 'Picked Up' && order.status !== 'Out for Delivery'}
            variant={order.status === 'Delivered' ? "default" : "outline"}
            className="w-full"
            aria-label={`Mark order ${order.id} as delivered`}
          >
            {order.status === 'Delivered' ? 
              <CheckCircle className="mr-2 h-4 w-4" /> : 
              <Ban className="mr-2 h-4 w-4" />
            }
            {order.status === 'Delivered' ? 'Delivered' : 'Deliver'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
