import { z } from 'zod';
import { insertTaskSchema, insertProjectSchema, insertTagSchema, tasks, projects, tags } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  tasks: {
    list: {
      method: 'GET' as const,
      path: '/api/tasks' as const,
      input: z.object({
        projectId: z.coerce.number().optional(),
        status: z.string().optional(),
        search: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof tasks.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/tasks/:id' as const,
      responses: {
        200: z.custom<typeof tasks.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/tasks' as const,
      input: insertTaskSchema.extend({
        // Allow creating with tag IDs
        tagIds: z.array(z.number()).optional(),
      }),
      responses: {
        201: z.custom<typeof tasks.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/tasks/:id' as const,
      input: insertTaskSchema.partial().extend({
         tagIds: z.array(z.number()).optional(),
      }),
      responses: {
        200: z.custom<typeof tasks.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/tasks/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  projects: {
    list: {
      method: 'GET' as const,
      path: '/api/projects' as const,
      responses: {
        200: z.array(z.custom<typeof projects.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/projects' as const,
      input: insertProjectSchema,
      responses: {
        201: z.custom<typeof projects.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/projects/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  tags: {
    list: {
      method: 'GET' as const,
      path: '/api/tags' as const,
      responses: {
        200: z.array(z.custom<typeof tags.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/tags' as const,
      input: insertTagSchema,
      responses: {
        201: z.custom<typeof tags.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  ai: {
    process: {
      method: 'POST' as const,
      path: '/api/ai/process' as const,
      input: z.object({
        prompt: z.string(),
      }),
      responses: {
        200: z.object({
          tasks: z.array(insertTaskSchema),
          suggestedProject: z.string().optional(),
        }),
        500: errorSchemas.internal,
      },
    },
    breakdown: {
      method: 'POST' as const,
      path: '/api/ai/breakdown' as const,
      input: z.object({
        taskId: z.number(),
      }),
      responses: {
        200: z.object({
          subtasks: z.array(z.string()),
        }),
        404: errorSchemas.notFound,
        500: errorSchemas.internal,
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
