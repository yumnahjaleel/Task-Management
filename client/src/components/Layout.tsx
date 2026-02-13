import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { cn } from "@/lib/utils";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 md:pl-64 flex flex-col">
        <MobileNav />
        <main className="flex-1 p-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full animate-in">
          {children}
        </main>
      </div>
    </div>
  );
}
