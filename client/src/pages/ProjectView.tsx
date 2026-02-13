import { useState } from "react";
import { useRoute } from "wouter";
import { useTasks } from "@/hooks/use-tasks";
import { useProjects } from "@/hooks/use-projects";
import { Layout } from "@/components/Layout";
import { QuickAdd } from "@/components/QuickAdd";
import { TaskCard } from "@/components/TaskCard";
import { TaskDialog } from "@/components/TaskDialog";
import { type Task } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderOpen } from "lucide-react";

export default function ProjectView() {
  const [match, params] = useRoute("/project/:id");
  const projectId = params?.id ? parseInt(params.id) : undefined;
  
  const { data: projects } = useProjects();
  const { data: tasks, isLoading } = useTasks({ projectId });
  
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const project = projects?.find(p => p.id === projectId);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-4">
          <Skeleton className="h-12 w-48 mb-8" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold">Project not found</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <header>
          <div className="flex items-center gap-3 text-muted-foreground mb-2">
            <FolderOpen className="h-5 w-5" />
            <span>Project</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground tracking-tight">
            {project.name}
          </h1>
        </header>

        <QuickAdd />

        <div className="space-y-4">
          {tasks && tasks.length > 0 ? (
            <div className="grid gap-4">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={handleEdit} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed rounded-xl border-muted">
              <p className="text-muted-foreground">No tasks in this project yet.</p>
            </div>
          )}
        </div>

        <TaskDialog 
          open={isDialogOpen} 
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setEditingTask(null);
          }}
          task={editingTask}
        />
      </div>
    </Layout>
  );
}
