import { RoleNavigation } from '@/components/role-navigation';
import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 bg-gradient-to-br from-background to-blue-100 dark:from-background dark:to-slate-900">
      <div className="text-center mb-12">
        <Image 
          src="https://placehold.co/150x150.png" 
          alt="Verydeli Logo" 
          width={120} 
          height={120} 
          className="mx-auto rounded-full shadow-lg mb-6"
          data-ai-hint="delivery logo" 
        />
        <h1 className="text-5xl font-headline font-bold text-primary mb-3">
          Welcome to Verydeli
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Streamlining your delivery operations with real-time tracking, status updates, and intelligent delay predictions.
        </p>
      </div>
      <div className="w-full max-w-3xl">
        <RoleNavigation />
      </div>
      <footer className="mt-16 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Verydeli Inc. All rights reserved.</p>
        <p>Efficiency delivered, every time.</p>
      </footer>
    </main>
  );
}
