import { z } from 'zod';

export const createListingSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(150),
  titleAmharic: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  descriptionAmharic: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be positive'),
  currency: z.enum(['ETB', 'USD']).default('ETB'),
  negotiable: z.boolean().default(true),
  categoryId: z.string().min(1, 'Category is required'),
  condition: z.enum(['NEW', 'LIKE_NEW', 'USED_GOOD', 'USED_FAIR', 'FOR_PARTS']).default('USED_GOOD'),
  images: z.array(z.string().min(1)).optional(),
  location: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  contactPhone: z.string().optional(),
  contactWhatsapp: z.string().optional(),
  showPhone: z.boolean().default(true),
  attributes: z.record(z.any()).optional(),
});

export const updateListingSchema = createListingSchema.partial();

export const searchListingsSchema = z.object({
  query: z.string().optional(),
  categoryId: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  condition: z.enum(['NEW', 'LIKE_NEW', 'USED_GOOD', 'USED_FAIR', 'FOR_PARTS']).optional(),
  city: z.string().optional(),
  sortBy: z.enum(['newest', 'price_asc', 'price_desc', 'relevance']).default('newest'),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
export type SearchListingsInput = z.infer<typeof searchListingsSchema>;
