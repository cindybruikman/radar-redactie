// src/components/Layout.tsx
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface LayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const Layout = ({ title, subtitle, children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="border-b bg-white px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
              {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
            </div>
            <SidebarTrigger />
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};
