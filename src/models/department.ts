import { Guid } from "./types";
import { z } from "zod";

export type Department = {
  id: Guid;
  companyId: Guid;
  name: string;
};

export const CreateDepartmentSchema = z.object({
  companyId: z.string(),
  name: z.string().min(2).max(150),
});

export const UpdateDepartmentSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  name: z.string().min(2).max(150),
});

export type CreateDepartmentRequest = z.infer<typeof CreateDepartmentSchema>;
export type UpdateDepartmentRequest = z.infer<typeof UpdateDepartmentSchema>;
