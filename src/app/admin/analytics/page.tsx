'use client';

import { SiteHeader } from '@/components/site-header';
import { BarChart3, Clock, Truck, CheckCircle, Users, Percent } from 'lucide-react';
import { DeliveryAnalyticsCharts } from '../components/delivery-analytics-charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';

// Mock data for summary cards - in a real app, this would come from an API
const mockSummaryData = {
  averageDeliveryTime: 35, // minutes
  onTimeDeliveries: 92, // percentage
  totalDeliveriesToday: 128,
  activeCouriers: 3,
};


export default function AnalyticsPage() {
  const [summaryData, setSummaryData] = useState(mockSummaryData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      // In a real app, fetch data here and set it
      // For example: fetch('/api/analytics/summary').then(res => res.json()).then(data => setSummaryData(data));
      setIsLoading(false);
    }, 1000);
  }, []);


  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader title="Delivery Analytics" Icon={BarChart3} showHomeLink={true} />
      <main className="flex-1 container mx-auto p-4 md:p-6 space-y-8">
        
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Avg. Delivery Time" 
            value={`${summaryData.averageDeliveryTime} min`} 
            icon={Clock} 
            isLoading={isLoading}
            description="Average time from pickup to delivery"
          />
          <StatCard 
            title="On-Time Deliveries" 
            value={`${summaryData.onTimeDeliveries}%`} 
            icon={CheckCircle} 
            isLoading={isLoading}
            description="Percentage of deliveries completed on schedule"
          />
          <StatCard 
            title="Deliveries Today" 
            value={summaryData.totalDeliveriesToday.toString()} 
            icon={Truck} 
            isLoading={isLoading}
            description="Total orders completed today"
          />
          <StatCard 
            title="Active Couriers" 
            value={summaryData.activeCouriers.toString()} 
            icon={Users} 
            isLoading={isLoading}
            description="Couriers currently on duty"
          />
        </section>

        <Card className="shadow-xl">
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center">
                    <Percent className="mr-2 h-6 w-6 text-primary" /> Performance Metrics
                </CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="h-[400px] flex items-center justify-center bg-muted rounded-md">
                        <p>Loading charts...</p>
                    </div>
                ) : (
                    <DeliveryAnalyticsCharts />
                )}
            </CardContent>
        </Card>
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground border-t">
        Verydeli Analytics Dashboard &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  isLoading: boolean;
  description?: string;
}

function StatCard({ title, value, icon: Icon, isLoading, description }: StatCardProps) {
  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
           <Icon className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="h-8 w-1/2 bg-muted rounded animate-pulse mb-1"></div>
          {description && <div className="h-4 w-3/4 bg-muted rounded animate-pulse"></div>}
        </CardContent>
      </Card>
    )
  }
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        {description && <p className="text-xs text-muted-foreground pt-1">{description}</p>}
      </CardContent>
    </Card>
  )
}
