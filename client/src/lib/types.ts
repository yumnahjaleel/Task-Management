import { z } from "zod";

// Task priority levels
export const Priority = z.enum(["low", "medium", "high"]);
export type Priority = z.infer<typeof Priority>;

// Task status stages
export const Status = z.enum(["todo", "in-progress", "completed", "archived"]);
export type Status = z.infer<typeof Status>;

// Subtask model
export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

// Main Task model
export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  dueDate: string | null;
  tags: string[];
  subtasks: Subtask[];
  projectId: string | null;
  createdAt: string;
}

// Project model
export interface Project {
  id: string;
  name: string;
  color: string;
}

// Global App State
export interface AppState {
  tasks: Task[];
  projects: Project[];
  tags: string[];
  focusMode: boolean;
}
