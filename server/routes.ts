import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // === Tasks ===
  app.get(api.tasks.list.path, async (req, res) => {
    try {
      // Manually parse query params because Express treats them as strings
      const params = {
        projectId: req.query.projectId ? Number(req.query.projectId) : undefined,
        status: req.query.status as string | undefined,
        search: req.query.search as string | undefined
      };
      
      const tasks = await storage.getTasks(params);
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.get(api.tasks.get.path, async (req, res) => {
    const task = await storage.getTask(Number(req.params.id));
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  });

  app.post(api.tasks.create.path, async (req, res) => {
    try {
      const input = api.tasks.create.input.parse(req.body);
      const { tagIds, ...taskData } = input;
      const task = await storage.createTask(taskData, tagIds);
      res.status(201).json(task);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.patch(api.tasks.update.path, async (req, res) => {
    try {
      const input = api.tasks.update.input.parse(req.body);
      const { tagIds, ...updates } = input;
      const task = await storage.updateTask(Number(req.params.id), updates, tagIds);
      res.json(task);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      return res.status(404).json({ message: 'Task not found' });
    }
  });

  app.delete(api.tasks.delete.path, async (req, res) => {
    await storage.deleteTask(Number(req.params.id));
    res.status(204).send();
  });

  // === Projects ===
  app.get(api.projects.list.path, async (req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.post(api.projects.create.path, async (req, res) => {
    try {
      const input = api.projects.create.input.parse(req.body);
      const project = await storage.createProject(input);
      res.status(201).json(project);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.projects.delete.path, async (req, res) => {
    await storage.deleteProject(Number(req.params.id));
    res.status(204).send();
  });

  // === Tags ===
  app.get(api.tags.list.path, async (req, res) => {
    const tags = await storage.getTags();
    res.json(tags);
  });

  app.post(api.tags.create.path, async (req, res) => {
    try {
      const input = api.tags.create.input.parse(req.body);
      const tag = await storage.createTag(input);
      res.status(201).json(tag);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // === AI Endpoints ===
  app.post(api.ai.process.path, async (req, res) => {
    try {
      const { prompt } = req.body;
      
      const completion = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          {
            role: "system",
            content: `You are a productivity assistant. Extract tasks from the user's natural language input.
            Return a JSON object with a "tasks" array. Each task should have:
            - title: string
            - description: string (optional)
            - priority: "low" | "medium" | "high" (infer from context, default medium)
            - dueDate: ISO string (optional, infer from "tomorrow", "next week", etc.)
            
            Example input: "Finish the report by Friday and email John"
            Example output: { "tasks": [{ "title": "Finish report", "dueDate": "2023-10-27T00:00:00Z" }, { "title": "Email John" }] }`
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(completion.choices[0].message.content || "{}");
      res.json(result);
    } catch (error) {
      console.error("AI Process Error:", error);
      res.status(500).json({ message: "Failed to process AI request" });
    }
  });

  app.post(api.ai.breakdown.path, async (req, res) => {
    try {
      const { taskId } = req.body;
      const task = await storage.getTask(taskId);
      if (!task) return res.status(404).json({ message: "Task not found" });

      const completion = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          {
            role: "system",
            content: `Break down the following task into 3-5 smaller, actionable subtasks. Return a JSON object with a "subtasks" array of strings.`
          },
          { role: "user", content: `Task: ${task.title}\nDescription: ${task.description || "No description"}` }
        ],
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(completion.choices[0].message.content || "{}");
      res.json(result);
    } catch (error) {
      console.error("AI Breakdown Error:", error);
      res.status(500).json({ message: "Failed to generate breakdown" });
    }
  });

  // Seed the database on startup
  await seedDatabase();

  return httpServer;
}

// Helper for seeding
export async function seedDatabase() {
  const existingTasks = await storage.getTasks();
  if (existingTasks.length === 0) {
    // Create Default Projects
    const work = await storage.createProject({ name: "Work", slug: "work", color: "#3b82f6" });
    const personal = await storage.createProject({ name: "Personal", slug: "personal", color: "#10b981" });
    
    // Create Tags
    const urgent = await storage.createTag({ name: "Urgent", color: "#ef4444" });
    const learning = await storage.createTag({ name: "Learning", color: "#8b5cf6" });

    // Create Tasks
    await storage.createTask({
      title: "Complete project proposal",
      description: "Draft the initial requirements and timeline",
      priority: "high",
      status: "todo",
      projectId: work.id
    }, [urgent.id]);

    await storage.createTask({
      title: "Buy groceries",
      description: "Milk, eggs, bread",
      priority: "medium",
      status: "todo",
      projectId: personal.id
    });

    await storage.createTask({
      title: "Learn TypeScript Generics",
      description: "Read documentation and practice",
      priority: "low",
      status: "in_progress",
      projectId: personal.id
    }, [learning.id]);
  }
}
