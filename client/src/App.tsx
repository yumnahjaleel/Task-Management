import { useState, useEffect, useMemo } from "react";
import { Plus, Search, Filter, LayoutGrid, List, Settings, Moon, Sun, Sidebar as SidebarIcon, CheckCircle2, Circle, Clock, AlertCircle, ChevronRight, Hash, Folder, BrainCircuit, Target, MoreVertical, Trash2, Edit2, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from "@/components/ui/sidebar";
import { AppState, Task, Project, Priority, Status } from "@/lib/types";
import { localStorageUtils } from "@/lib/localStorage";
import { taskParser } from "@/lib/taskParser";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [state, setState] = useState<AppState>(localStorageUtils.loadState());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<Status | "all">("all");
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputTask, setInputTask] = useState("");

  // Sync state to localStorage
  useEffect(() => {
    localStorageUtils.saveState(state);
  }, [state]);

  // Handle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTask.trim()) return;

    const parsed = taskParser.parse(inputTask);
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: parsed.title,
      description: "",
      priority: "medium",
      status: "todo",
      dueDate: parsed.dueDate,
      tags: activeTag ? [activeTag] : [],
      subtasks: [],
      projectId: activeProject,
      createdAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
    }));
    setInputTask("");
  };

  const toggleTaskStatus = (taskId: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => 
        t.id === taskId 
          ? { ...t, status: t.status === "completed" ? "todo" : "completed" } 
          : t
      )
    }));
  };

  const deleteTask = (taskId: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== taskId)
    }));
  };

  const filteredTasks = useMemo(() => {
    return state.tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = activeTab === "all" || task.status === activeTab;
      const matchesProject = !activeProject || task.projectId === activeProject;
      const matchesTag = !activeTag || task.tags.includes(activeTag);
      
      return matchesSearch && matchesStatus && matchesProject && matchesTag;
    });
  }, [state.tasks, searchQuery, activeTab, activeProject, activeTag]);

  const getPriorityColor = (p: Priority) => {
    switch(p) {
      case "high": return "text-red-500 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900";
      case "medium": return "text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900";
      case "low": return "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900";
    }
  };

  const getDueDateLabel = (date: string | null) => {
    if (!date) return null;
    const d = new Date(date);
    if (isToday(d)) return { text: "Today", color: "text-amber-600" };
    if (isTomorrow(d)) return { text: "Tomorrow", color: "text-blue-600" };
    if (isPast(d)) return { text: "Overdue", color: "text-red-600" };
    return { text: format(d, "MMM d"), color: "text-slate-500" };
  };

  return (
    <SidebarProvider>
      <div className={`flex min-h-screen w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans ${state.focusMode ? 'focus-mode' : ''}`}>
        
        {/* Sidebar */}
        {!state.focusMode && (
          <Sidebar className="border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <SidebarContent className="p-4">
              <div className="flex items-center gap-2 px-2 py-4 mb-4">
                <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">T</div>
                <span className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">TaskSync</span>
              </div>

              <SidebarGroup>
                <SidebarGroupLabel className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Navigation</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => { setActiveProject(null); setActiveTag(null); }}
                      className={!activeProject && !activeTag ? "bg-slate-100 dark:bg-slate-800 text-indigo-600" : ""}
                    >
                      <LayoutGrid className="w-4 h-4 mr-2" /> All Tasks
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Zap className="w-4 h-4 mr-2" /> Today
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>

              <SidebarGroup className="mt-6">
                <SidebarGroupLabel className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Projects</SidebarGroupLabel>
                <SidebarMenu>
                  {state.projects.map(project => (
                    <SidebarMenuItem key={project.id}>
                      <SidebarMenuButton 
                        onClick={() => setActiveProject(project.id)}
                        className={activeProject === project.id ? "bg-slate-100 dark:bg-slate-800 text-indigo-600 font-medium" : ""}
                      >
                        <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: project.color }} />
                        {project.name}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>

              <SidebarGroup className="mt-6">
                <SidebarGroupLabel className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Tags</SidebarGroupLabel>
                <SidebarMenu>
                  {state.tags.map(tag => (
                    <SidebarMenuItem key={tag}>
                      <SidebarMenuButton 
                        onClick={() => setActiveTag(tag)}
                        className={activeTag === tag ? "bg-slate-100 dark:bg-slate-800 text-indigo-600 font-medium" : ""}
                      >
                        <Hash className="w-3 h-3 mr-3 text-slate-400" />
                        {tag}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Header */}
          <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 px-6 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              {!state.focusMode && <SidebarTrigger />}
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Search tasks..." 
                  className="pl-10 bg-slate-50 dark:bg-slate-800 border-none focus-visible:ring-indigo-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="text-slate-500"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button 
                variant={state.focusMode ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setState(s => ({ ...s, focusMode: !s.focusMode }))}
                className="hidden sm:flex gap-2"
              >
                <Target className="w-4 h-4" />
                {state.focusMode ? "Focus On" : "Focus Mode"}
              </Button>
              <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden border border-slate-300 dark:border-slate-700">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Felix`} alt="avatar" />
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 overflow-x-hidden">
            <div className="max-w-4xl mx-auto">
              
              {/* Daily Focus Hint */}
              {!state.focusMode && (
                <div className="mb-8 p-4 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-xl flex items-center gap-4">
                  <div className="h-10 w-10 bg-white dark:bg-indigo-900 rounded-lg flex items-center justify-center shadow-sm">
                    <BrainCircuit className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">Daily Insight</h3>
                    <p className="text-xs text-indigo-700/80 dark:text-indigo-400">You have {state.tasks.filter(t => t.status !== "completed").length} tasks pending. Start with "Complete project proposal" to maximize impact today.</p>
                  </div>
                </div>
              )}

              {/* Add Task Input */}
              <Card className="mb-8 border-none shadow-sm dark:bg-slate-900 overflow-visible">
                <CardContent className="p-2">
                  <form onSubmit={addTask} className="flex items-center gap-2">
                    <div className="flex-1 flex items-center px-3 gap-3">
                      <Zap className="w-4 h-4 text-indigo-500 animate-pulse" />
                      <Input 
                        placeholder='Type a task... e.g. "Finish DBMS notes tomorrow 5pm"' 
                        className="border-none shadow-none focus-visible:ring-0 text-lg bg-transparent py-6"
                        value={inputTask}
                        onChange={(e) => setInputTask(e.target.value)}
                      />
                    </div>
                    <Button type="submit" size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6">
                      Add Task
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Task Tabs */}
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {activeProject ? state.projects.find(p => p.id === activeProject)?.name : 
                   activeTag ? `#${activeTag}` : "My Tasks"}
                </h1>
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-auto">
                  <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1">
                    <TabsTrigger value="all" className="text-xs px-4">All</TabsTrigger>
                    <TabsTrigger value="todo" className="text-xs px-4">Todo</TabsTrigger>
                    <TabsTrigger value="in-progress" className="text-xs px-4">In Progress</TabsTrigger>
                    <TabsTrigger value="completed" className="text-xs px-4">Done</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Task List */}
              <ScrollArea className="h-full">
                <div className="space-y-3 pb-20">
                  <AnimatePresence mode="popLayout">
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map((task) => (
                        <motion.div
                          key={task.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Card className={`group border-none shadow-sm hover:shadow-md transition-all dark:bg-slate-900 relative overflow-hidden ${task.status === "completed" ? "opacity-60" : ""}`}>
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <CardContent className="p-4 flex items-start gap-4">
                              <button 
                                onClick={() => toggleTaskStatus(task.id)}
                                className="mt-1 transition-transform hover:scale-110 active:scale-95"
                              >
                                {task.status === "completed" ? (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                ) : (
                                  <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                                )}
                              </button>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className={`font-semibold text-slate-900 dark:text-white truncate ${task.status === "completed" ? "line-through" : ""}`}>
                                    {task.title}
                                  </h3>
                                  <Badge variant="outline" className={`text-[10px] py-0 px-2 font-medium border-slate-200 dark:border-slate-800 ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                  </Badge>
                                </div>
                                
                                <div className="flex flex-wrap items-center gap-3 mt-2">
                                  {task.dueDate && (
                                    <div className="flex items-center gap-1.5">
                                      <Clock className={`w-3 h-3 ${getDueDateLabel(task.dueDate)?.color}`} />
                                      <span className={`text-xs font-medium ${getDueDateLabel(task.dueDate)?.color}`}>
                                        {getDueDateLabel(task.dueDate)?.text}
                                      </span>
                                    </div>
                                  )}
                                  
                                  {task.projectId && (
                                    <div className="flex items-center gap-1.5">
                                      <Folder className="w-3 h-3 text-slate-400" />
                                      <span className="text-xs text-slate-500">
                                        {state.projects.find(p => p.id === task.projectId)?.name}
                                      </span>
                                    </div>
                                  )}

                                  {task.tags.map(tag => (
                                    <div key={tag} className="flex items-center gap-1">
                                      <Hash className="w-3 h-3 text-indigo-400" />
                                      <span className="text-xs text-slate-500 font-medium">{tag}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500" onClick={() => deleteTask(task.id)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
                          <CheckCircle2 className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                        </div>
                        <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-1">Clear as Day</h3>
                        <p className="text-slate-500 text-sm max-w-xs">No tasks found matching your filters. Take a breath, you're all caught up.</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
