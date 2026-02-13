import { db } from "./db";
import {
  tasks, projects, tags, taskTags,
  type Task, type InsertTask, type Project, type InsertProject, type Tag, type InsertTag
} from "@shared/schema";
import { eq, inArray, ilike, and, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Tasks
  getTasks(params?: { projectId?: number; status?: string; search?: string }): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask, tagIds?: number[]): Promise<Task>;
  updateTask(id: number, updates: Partial<InsertTask>, tagIds?: number[]): Promise<Task>;
  deleteTask(id: number): Promise<void>;

  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  deleteProject(id: number): Promise<void>;

  // Tags
  getTags(): Promise<Tag[]>;
  createTag(tag: InsertTag): Promise<Tag>;
  
  // Relations
  getTaskTags(taskId: number): Promise<Tag[]>;
}

export class DatabaseStorage implements IStorage {
  async getTasks(params?: { projectId?: number; status?: string; search?: string }): Promise<Task[]> {
    const conditions = [];
    if (params?.projectId) conditions.push(eq(tasks.projectId, params.projectId));
    if (params?.status) conditions.push(eq(tasks.status, params.status));
    if (params?.search) conditions.push(ilike(tasks.title, `%${params.search}%`));

    return await db.select()
      .from(tasks)
      .where(and(...conditions))
      .orderBy(desc(tasks.createdAt));
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }

  async createTask(insertTask: InsertTask, tagIds?: number[]): Promise<Task> {
    const [task] = await db.insert(tasks).values(insertTask).returning();
    
    if (tagIds && tagIds.length > 0) {
      await db.insert(taskTags).values(
        tagIds.map(tagId => ({ taskId: task.id, tagId }))
      );
    }
    
    return task;
  }

  async updateTask(id: number, updates: Partial<InsertTask>, tagIds?: number[]): Promise<Task> {
    const [updated] = await db.update(tasks)
      .set(updates)
      .where(eq(tasks.id, id))
      .returning();

    if (tagIds) {
      // Replace tags
      await db.delete(taskTags).where(eq(taskTags.taskId, id));
      if (tagIds.length > 0) {
        await db.insert(taskTags).values(
          tagIds.map(tagId => ({ taskId: id, tagId }))
        );
      }
    }

    return updated;
  }

  async deleteTask(id: number): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Tags
  async getTags(): Promise<Tag[]> {
    return await db.select().from(tags);
  }

  async createTag(tag: InsertTag): Promise<Tag> {
    const [newTag] = await db.insert(tags).values(tag).returning();
    return newTag;
  }

  async getTaskTags(taskId: number): Promise<Tag[]> {
    const results = await db.select({
      id: tags.id,
      name: tags.name,
      color: tags.color
    })
    .from(taskTags)
    .innerJoin(tags, eq(taskTags.tagId, tags.id))
    .where(eq(taskTags.taskId, taskId));
    
    return results;
  }
}

export const storage = new DatabaseStorage();
