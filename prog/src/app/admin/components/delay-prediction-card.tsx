'use client';

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { predictDeliveryDelay, type PredictDeliveryDelayInput, type PredictDeliveryDelayOutput } from '@/ai/flows/predict-delivery-delay';
import type { Courier, Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertTriangle, CheckCircle, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const delayPredictionSchema = z.object({
  courierId: z.string().min(1, "Courier selection is required."),
  orderId: z.string().min(1, "Order selection is required."),
  trafficConditions: z.string().min(1, "Traffic conditions are required."),
  weatherConditions: z.string().min(1, "Weather conditions are required."),
});

type DelayPredictionFormValues = z.infer<typeof delayPredictionSchema>;

interface DelayPredictionCardProps {
  selectedCourier: Courier | null;
  orders: Order[];
}

export function DelayPredictionCard({ selectedCourier, orders: allOrders }: DelayPredictionCardProps) {
  const [predictionResult, setPredictionResult] = useState<PredictDeliveryDelayOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [courierOrders, setCourierOrders] = useState<Order[]>([]);
  const { toast } = useToast();

  const form = useForm<DelayPredictionFormValues>({
    resolver: zodResolver(delayPredictionSchema),
    defaultValues: {
      courierId: '',
      orderId: '',
      trafficConditions: 'Normal',
      weatherConditions: 'Clear',
    },
  });

  useEffect(() => {
    if (selectedCourier) {
      form.setValue('courierId', selectedCourier.id);
      const filteredOrders = allOrders.filter(
        order => order.assignedCourierId === selectedCourier.id && (order.status === 'Out for Delivery' || order.status === 'Picked Up')
      );
      setCourierOrders(filteredOrders);
      if (filteredOrders.length > 0) {
        form.setValue('orderId', filteredOrders[0].id); // Default to first active order
      } else {
        form.setValue('orderId', ''); // Clear if no active orders
      }
    } else {
      form.reset(); // Reset form if no courier selected
      setCourierOrders([]);
    }
    setPredictionResult(null); // Clear previous prediction when courier changes
  }, [selectedCourier, allOrders, form]);

  const onSubmit: SubmitHandler<DelayPredictionFormValues> = async (data) => {
    setIsLoading(true);
    setPredictionResult(null);

    const courier = selectedCourier; // Use the passed selectedCourier
    const order = courierOrders.find(o => o.id === data.orderId);

    if (!courier || !order) {
      toast({
        title: "Error",
        description: "Courier or Order details not found. Please select a valid courier and order.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const input: PredictDeliveryDelayInput = {
      courierId: courier.id,
      orderId: order.id,
      currentLocationLat: courier.currentLocation.lat,
      currentLocationLon: courier.currentLocation.lng,
      destinationLat: order.deliveryLat,
      destinationLon: order.deliveryLon,
      estimatedArrivalTime: order.estimatedDeliveryTime,
      trafficConditions: data.trafficConditions,
      weatherConditions: data.weatherConditions,
    };

    try {
      const result = await predictDeliveryDelay(input);
      setPredictionResult(result);
    } catch (error) {
      console.error("Error predicting delay:", error);
      toast({
        title: "Prediction Failed",
        description: "An error occurred while trying to predict the delay. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedCourier) {
    return (
      <div className="p-6 rounded-lg border border-dashed text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
        <p className="font-medium">No Courier Selected</p>
        <p className="text-sm text-muted-foreground">
          Please select a courier from the map or list to predict delivery delays.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="courierId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Courier</FormLabel>
                <Input {...field} value={selectedCourier.name} readOnly disabled className="bg-muted/50" />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="orderId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Active Order for {selectedCourier.name}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={courierOrders.length === 0}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={courierOrders.length > 0 ? "Select an active order" : "No active orders"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courierOrders.map(order => (
                      <SelectItem key={order.id} value={order.id}>
                        Order #{order.id} (To: {order.customerName})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {courierOrders.length === 0 && <p className="text-sm text-muted-foreground mt-1">This courier has no active orders (Picked Up / Out for Delivery).</p>}
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="trafficConditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Traffic Conditions</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select traffic conditions" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Light">Light</SelectItem>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Heavy">Heavy</SelectItem>
                      <SelectItem value="Standstill">Standstill</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weatherConditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weather Conditions</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select weather conditions" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Clear">Clear</SelectItem>
                      <SelectItem value="Rainy">Rainy</SelectItem>
                      <SelectItem value="Snowy">Snowy</SelectItem>
                      <SelectItem value="Foggy">Foggy</SelectItem>
                      <SelectItem value="Stormy">Stormy</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isLoading || courierOrders.length === 0} className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Predict Delay
          </Button>
        </form>
      </Form>

      {predictionResult && (
        <Alert variant={predictionResult.isDelayed ? 'destructive' : 'default'} className="mt-6 transition-all duration-300 ease-in-out animate-in fade-in-50">
          {predictionResult.isDelayed ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
          <AlertTitle className="font-headline text-lg">
            {predictionResult.isDelayed ? 'Potential Delay Predicted' : 'Delivery On Track'}
          </AlertTitle>
          <AlertDescription className="space-y-1">
            <p>
              {predictionResult.isDelayed 
                ? `Reason: ${predictionResult.delayReason}` 
                : predictionResult.delayReason || "No significant delays anticipated."}
            </p>
            {predictionResult.isDelayed && (
              <p>Estimated Delay: {new Date(predictionResult.estimatedDelayTime).toLocaleTimeString()}</p>
            )}
            <p>Confidence: {(predictionResult.confidenceScore * 100).toFixed(0)}%</p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
