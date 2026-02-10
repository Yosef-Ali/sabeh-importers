import { z } from 'zod';

export const createOrderSchema = z.object({
  customerId: z.string().optional(),
  distributorId: z.string().optional(),
  type: z.enum(['SALES', 'PURCHASE', 'RETURN']).default('SALES'),
  source: z.enum(['DIRECT', 'WHATSAPP', 'PHONE', 'ONLINE', 'DISTRIBUTOR']).default('DIRECT'),
  currency: z.enum(['ETB', 'USD']).default('ETB'),
  shippingAddress: z.string().optional(),
  shippingCity: z.string().optional(),
  shippingRegion: z.string().optional(),
  shippingPhone: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(z.object({
    productId: z.string().min(1, 'Product is required'),
    quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
    unitPrice: z.coerce.number().min(0),
    discount: z.coerce.number().default(0),
  })).min(1, 'At least one item is required'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED']),
  notes: z.string().optional(),
});

export const createPaymentSchema = z.object({
  orderId: z.string().optional(),
  customerId: z.string().optional(),
  distributorId: z.string().optional(),
  amount: z.coerce.number().min(0.01, 'Amount must be positive'),
  currency: z.enum(['ETB', 'USD']).default('ETB'),
  method: z.enum(['CASH', 'BANK_TRANSFER', 'TELEBIRR', 'CBE_BIRR', 'MPESA', 'CHECK', 'CREDIT', 'STRIPE']),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
