// src/components/Layout.tsx
import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Badge } from '@/components/ui/badge';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  badgeText?: string;
}

export const Layout = ({ children, title = "RedactieRadar", subtitle = "Omroep Tilburg", badgeText }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="border-b bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                  <p className="text-sm text-gray-600">{subtitle}</p>
                </div>
              </div>
              {badgeText && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {badgeText}
                  </Badge>
                </div>
              )}
            </div>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};
