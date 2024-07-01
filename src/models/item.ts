import { Guid } from "./types";
import { z } from "zod";

export type ItemCategory = "office" | "cleaning" | "cafeteria" | "stationery";

export const itemCategories: ItemCategory[] = [
  "office",
  "cafeteria",
  "cleaning",
  "stationery",
];

export type Item = {
  id: Guid;
  category: ItemCategory;
  description: string;
  unit: Guid;
};

export const CreateItemSchema = z.object({
  category: z.enum(["office", "cafeteria", "cleaning", "stationery"]),
  description: z.string().min(2).max(500),
  unit: z.string().min(1).max(50),
});

export const UpdateItemSchema = z.object({
  id: z.string(),
  category: z.enum(["office", "cafeteria", "cleaning", "stationery"]),
  description: z.string().min(2).max(500),
  unit: z.string().min(1).max(50),
});

export type CreateItemRequest = z.infer<typeof CreateItemSchema>;
export type UpdateItemRequest = z.infer<typeof UpdateItemSchema>;
