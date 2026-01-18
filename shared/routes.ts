import { z } from 'zod';
import { 
  insertDonationSchema, 
  insertNgoRequestSchema, 
  donations, 
  ngoRequests, 
  type InsertDonation,
  type InsertNgoRequest
} from './schema';

export { 
  insertDonationSchema, 
  insertNgoRequestSchema, 
  donations, 
  ngoRequests, 
  type InsertDonation,
  type InsertNgoRequest 
};

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  donations: {
    create: {
      method: 'POST' as const,
      path: '/api/donations',
      input: insertDonationSchema,
      responses: {
        201: z.custom<typeof donations.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/donations',
      responses: {
        200: z.array(z.custom<typeof donations.$inferSelect>()),
      },
    },
  },
  ngoRequests: {
    create: {
      method: 'POST' as const,
      path: '/api/ngo-requests',
      input: insertNgoRequestSchema,
      responses: {
        201: z.custom<typeof ngoRequests.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/ngo-requests',
      responses: {
        200: z.array(z.custom<typeof ngoRequests.$inferSelect>()),
      },
    },
  },
  inventory: {
    list: {
      method: 'GET' as const,
      path: '/api/inventory',
      responses: {
        200: z.array(z.custom<typeof donations.$inferSelect>()),
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
