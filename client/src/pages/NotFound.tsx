import { Link } from "wouter";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center max-w-md text-center space-y-4">
        <AlertCircle className="h-16 w-16 text-muted-foreground opacity-20" />
        <h1 className="text-4xl font-bold tracking-tight text-foreground">404</h1>
        <p className="text-muted-foreground text-lg">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button size="lg" className="mt-4">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
