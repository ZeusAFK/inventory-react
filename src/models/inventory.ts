import { z } from "zod";
import { Guid } from "./types";

export type Inventory = {
  id: Guid;
  itemId: Guid;
  departmentId: Guid;
  quantity: number;
  date: Date;
};

export const CreateInventorySchema = z.object({
  itemId: z.string(),
  departmentId: z.string(),
  quantity: z.number().min(0),
  date: z.date(),
});

export const UpdateInventorySchema = z.object({
  id: z.string(),
  itemId: z.string(),
  quantity: z.number().min(0),
  date: z.date(),
});

export type CreateInventoryRequest = z.infer<typeof CreateInventorySchema>;
export type UpdateInventoryRequest = z.infer<typeof UpdateInventorySchema>;
