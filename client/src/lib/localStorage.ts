import { AppState, Task, Project } from "./types";

const STORAGE_KEY = "task_manager_state";

const DEFAULT_STATE: AppState = {
  tasks: [
    {
      id: "1",
      title: "Complete project proposal",
      description: "Draft the initial requirements and timeline for the new task manager.",
      priority: "high",
      status: "todo",
      dueDate: new Date().toISOString(),
      tags: ["Design", "CS"],
      subtasks: [],
      projectId: "p1",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Review DBMS lecture notes",
      description: "Normalization and indexing topics.",
      priority: "medium",
      status: "in-progress",
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      tags: ["DBMS"],
      subtasks: [],
      projectId: "p1",
      createdAt: new Date().toISOString(),
    }
  ],
  projects: [
    { id: "p1", name: "University", color: "#3b82f6" },
    { id: "p2", name: "Personal", color: "#10b981" },
    { id: "p3", name: "Side Projects", color: "#f59e0b" },
  ],
  tags: ["CS", "DBMS", "DSA", "Design"],
  focusMode: false,
};

export const localStorageUtils = {
  saveState: (state: AppState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Error saving state to localStorage", error);
    }
  },

  loadState: (): AppState => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Error loading state from localStorage", error);
    }
    return DEFAULT_STATE;
  },

  clearState: () => {
    localStorage.removeItem(STORAGE_KEY);
  },
};
