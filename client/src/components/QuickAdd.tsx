import { useState } from "react";
import { Sparkles, Plus, Loader2 } from "lucide-react";
import { useAIProcess } from "@/hooks/use-ai";
import { useCreateTask } from "@/hooks/use-tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function QuickAdd() {
  const [value, setValue] = useState("");
  const aiProcess = useAIProcess();
  const createTask = useCreateTask();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;

    // Simple heuristic: if it looks complicated or asks for suggestions, use AI.
    // Otherwise just create a task directly for speed.
    const isComplex = value.length > 20 || value.toLowerCase().includes("plan") || value.toLowerCase().includes("schedule");

    if (isComplex) {
      aiProcess.mutate(value, {
        onSuccess: () => setValue(""),
      });
    } else {
      createTask.mutate({
        title: value,
        priority: "medium",
        status: "todo",
      }, {
        onSuccess: () => setValue(""),
      });
    }
  };

  const isLoading = aiProcess.isPending || createTask.isPending;

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 relative z-10">
      <form onSubmit={handleSubmit} className="relative group">
        <div className={cn(
          "absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl transition-opacity duration-500",
          isLoading ? "opacity-100" : "opacity-0 group-hover:opacity-50"
        )} />
        
        <div className="relative flex items-center bg-card rounded-2xl shadow-lg border border-border/50 overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <div className="pl-4 text-muted-foreground">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            ) : (
              <Plus className="h-5 w-5" />
            )}
          </div>
          
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Add a task... (Try 'Plan a marketing strategy for next week')"
            className="border-0 shadow-none focus-visible:ring-0 h-14 text-lg bg-transparent"
            disabled={isLoading}
          />
          
          <div className="pr-2">
            <Button 
              size="sm" 
              type="submit"
              disabled={!value.trim() || isLoading}
              className={cn(
                "rounded-xl transition-all duration-300",
                value.trim() ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted"
              )}
            >
              {isLoading ? (
                "Processing"
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Add
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
