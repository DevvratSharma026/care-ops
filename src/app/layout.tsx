import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CareOps - Business Automation',
  description: 'Manage leads, bookings, and operations in one place.',
};

import { ToastProvider } from '@/components/ui/ToastContext';
import AutomationInitializer from '@/components/logic/AutomationInitializer';

// ...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased min-h-screen bg-gray-50 text-gray-900">
        <ToastProvider>
          <AutomationInitializer />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
