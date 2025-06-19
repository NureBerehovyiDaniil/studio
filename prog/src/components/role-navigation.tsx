'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, User, Shield } from 'lucide-react';

export function RoleNavigation() {
  const roles = [
    {
      name: 'Courier',
      description: "Manage your orders and update delivery statuses.",
      href: '/courier',
      icon: User,
      cta: 'Go to Courier Portal',
    },
    {
      name: 'Admin',
      description: "Oversee operations, track couriers, and view analytics.",
      href: '/admin',
      icon: Shield,
      cta: 'Go to Admin Dashboard',
    },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {roles.map((role) => (
        <Card key={role.name} className="hover:shadow-xl transition-shadow duration-300 ease-in-out">
          <CardHeader className="flex flex-row items-center gap-4 pb-4">
            <role.icon className="w-10 h-10 text-primary" />
            <div>
              <CardTitle className="font-headline text-2xl">{role.name}</CardTitle>
              <CardDescription className="text-muted-foreground">{role.description}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href={role.href}>
                {role.cta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
