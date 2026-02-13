import { Link, useLocation } from "wouter";
import { LayoutDashboard, Calendar, Star, Folder, Hash, Plus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProjects, useCreateProject } from "@/hooks/use-projects";
import { useTags } from "@/hooks/use-tags";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function Sidebar() {
  const [location] = useLocation();
  const { data: projects } = useProjects();
  const { data: tags } = useTags();
  const createProject = useCreateProject();
  const [newProjectName, setNewProjectName] = useState("");
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: "All Tasks", href: "/" },
    { icon: Calendar, label: "Today", href: "/today" },
    { icon: Star, label: "Important", href: "/important" },
  ];

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    createProject.mutate({
      name: newProjectName,
      slug: newProjectName.toLowerCase().replace(/\s+/g, "-"),
      color: "#000000"
    }, {
      onSuccess: () => {
        setIsProjectDialogOpen(false);
        setNewProjectName("");
      }
    });
  };

  return (
    <div className="w-64 border-r bg-card/50 backdrop-blur-xl h-screen flex flex-col fixed left-0 top-0 z-30 hidden md:flex">
      <div className="p-6">
        <h1 className="text-xl font-bold font-display tracking-tight flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-primary/20 flex items-center justify-center text-primary">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          TaskFlow
        </h1>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-6">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                  location === item.href 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}>
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </div>
              </Link>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between px-3 py-2">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Projects
              </h2>
              <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5 hover:bg-muted">
                    <Plus className="h-3 w-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create Project</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateProject} className="space-y-4 pt-4">
                    <Input 
                      placeholder="Project Name" 
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                    />
                    <Button type="submit" disabled={createProject.isPending}>
                      Create
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-1 mt-1">
              {projects?.map((project) => (
                <Link key={project.id} href={`/project/${project.id}`}>
                  <div className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                    location === `/project/${project.id}`
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}>
                    <Folder className="h-4 w-4" />
                    {project.name}
                  </div>
                </Link>
              ))}
              {(!projects || projects.length === 0) && (
                <div className="px-3 py-2 text-xs text-muted-foreground italic">
                  No projects yet
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Tags
            </h2>
            <div className="space-y-1 mt-1">
              {tags?.map((tag) => (
                <Link key={tag.id} href={`/tag/${tag.id}`}>
                  <div className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                    location === `/tag/${tag.id}`
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}>
                    <Hash className="h-4 w-4" />
                    {tag.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  );
}
