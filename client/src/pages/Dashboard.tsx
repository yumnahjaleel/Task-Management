import { useState } from "react";
import { useTasks } from "@/hooks/use-tasks";
import { Layout } from "@/components/Layout";
import { QuickAdd } from "@/components/QuickAdd";
import { TaskCard } from "@/components/TaskCard";
import { TaskDialog } from "@/components/TaskDialog";
import { type Task } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const { data: tasks, isLoading } = useTasks({ search });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) setEditingTask(null);
  };

  const today = format(new Date(), "EEEE, MMMM do");

  // Group tasks
  const todoTasks = tasks?.filter(t => t.status !== "completed") || [];
  const completedTasks = tasks?.filter(t => t.status === "completed") || [];

  return (
    <Layout>
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground tracking-tight">
              Good Morning
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              It's {today}. You have {todoTasks.length} tasks to do.
            </p>
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search tasks..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card"
            />
          </div>
        </header>

        <QuickAdd />

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        ) : (
          <div className="space-y-10">
            {/* Active Tasks */}
            <section className="space-y-4">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                To Do
              </h2>
              {todoTasks.length > 0 ? (
                <div className="grid gap-4">
                  {todoTasks.map((task) => (
                    <TaskCard key={task.id} task={task} onEdit={handleEdit} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-xl border-muted">
                  <p className="text-muted-foreground">No tasks pending. Enjoy your day!</p>
                </div>
              )}
            </section>

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <section className="space-y-4 opacity-60 hover:opacity-100 transition-opacity">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                  Completed
                </h2>
                <div className="grid gap-4">
                  {completedTasks.map((task) => (
                    <TaskCard key={task.id} task={task} onEdit={handleEdit} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        <TaskDialog 
          open={isDialogOpen} 
          onOpenChange={handleOpenChange}
          task={editingTask}
        />
      </div>
    </Layout>
  );
}
