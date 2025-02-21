import { z } from 'zod';
import validator from 'validator';

export const cartAddItemSchema = z.object({
  productId: z
    .string()
    .refine((input) => validator.isMongoId(input), 'Invalid product ID'),
  quantity: z.number().min(1),
});

export const cartRemoveItemSchema = z.object({
  cartItemId: z
    .string()
    .refine((input) => validator.isMongoId(input), 'Invalid cart item ID'),
});

export const cartUpdateItemQuantitySchema = z.object({
  cartItemId: z
    .string()
    .refine((input) => validator.isMongoId(input), 'Invalid cart item ID'),
  quantity: z.number().min(1),
});

export function validateInput<T>(
  schema: z.ZodType<T>,
  data: unknown,
): {
  success: boolean;
  data?: T;
  error?: string;
} {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map((e) => e.message).join(', ');
      return { success: false, error: errorMessage };
    }
    return { success: false, error: 'Validation failed' };
  }
}
