import { Guid } from "./types";
import { z } from "zod";

export type Company = {
  id: Guid;
  name: string;
};

export const CreateCompanySchema = z.object({
  name: z.string()
});


export const UpdateCompanySchema = z.object({
  id: z.string(),
  name: z.string().min(5).max(100),
});
  
export type CreateCompanyRequest = z.infer<typeof CreateCompanySchema>;
export type UpdateCompanyRequest = z.infer<typeof UpdateCompanySchema>;
