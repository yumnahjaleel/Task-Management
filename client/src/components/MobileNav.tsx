import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";

export function MobileNav() {
  return (
    <div className="md:hidden flex items-center p-4 border-b bg-background/80 backdrop-blur sticky top-0 z-50">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          {/* We reuse the sidebar content but remove the 'hidden md:flex' classes internally via wrapper */}
          <div className="relative h-full w-full">
            <div className="absolute inset-0 bg-background">
              <Sidebar />
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <span className="ml-2 font-bold font-display">TaskFlow</span>
    </div>
  );
}
