import { z } from "zod";
import { Guid } from "./types";

export type Unit = {
  id: Guid;
  name: string;
};

export const CreateUnitSchema = z.object({
  name: z.string().min(2).max(150),
});

export const UpdateUnitSchema = z.object({
  id: z.string(),
  name: z.string().min(2).max(150),
});

export type CreateUnitRequest = z.infer<typeof CreateUnitSchema>;
export type UpdateUnitRequest = z.infer<typeof UpdateUnitSchema>;
