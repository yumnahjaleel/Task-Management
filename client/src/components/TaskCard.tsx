import { useState } from "react";
import { format } from "date-fns";
import { Check, Calendar, MoreVertical, Sparkles } from "lucide-react";
import { type Task } from "@shared/schema";
import { useUpdateTask, useDeleteTask } from "@/hooks/use-tasks";
import { useAIBreakdown } from "@/hooks/use-ai";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const priorityColors = {
  low: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  high: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
};

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const aiBreakdown = useAIBreakdown();
  const [isHovered, setIsHovered] = useState(false);

  const isCompleted = task.status === "completed";

  const handleToggleStatus = () => {
    updateTask.mutate({
      id: task.id,
      status: isCompleted ? "todo" : "completed",
    });
  };

  const handleDelete = () => {
    deleteTask.mutate(task.id);
  };

  const handleBreakdown = () => {
    aiBreakdown.mutate(task.id);
  };

  return (
    <div
      className={cn(
        "group relative flex items-start gap-4 rounded-xl border p-4 transition-all duration-200",
        isCompleted ? "bg-muted/30 border-transparent" : "bg-card border-border/50 hover:shadow-md hover:border-border",
        "hover:-translate-y-0.5"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggleStatus}
        className={cn(
          "mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20",
          isCompleted
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/30 hover:border-primary/50"
        )}
      >
        {isCompleted && <Check className="h-3.5 w-3.5 stroke-[3px]" />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <p
          className={cn(
            "text-base font-medium leading-none transition-all",
            isCompleted ? "text-muted-foreground line-through decoration-border" : "text-foreground"
          )}
        >
          {task.title}
        </p>
        
        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {task.dueDate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(task.dueDate), "MMM d")}</span>
            </div>
          )}
          
          <Badge 
            variant="secondary" 
            className={cn("text-xs font-normal px-2 py-0.5 h-auto capitalize", priorityColors[task.priority as keyof typeof priorityColors])}
          >
            {task.priority}
          </Badge>
        </div>
      </div>

      {/* Actions */}
      <div className={cn("opacity-0 transition-opacity", isHovered || isCompleted ? "opacity-100" : "opacity-0")}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              Edit Task
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleBreakdown} disabled={aiBreakdown.isPending}>
              <Sparkles className="mr-2 h-4 w-4 text-indigo-500" />
              {aiBreakdown.isPending ? "Generating..." : "AI Breakdown"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleDelete}
              className="text-destructive focus:text-destructive focus:bg-destructive/10"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
