import { Guid } from "./types";
import { z } from "zod";

export type Company = {
  id: Guid;
  name: string;
};

export type CompanyListItem = Company;

export type CreateCompanyRequest = {
  name: string;
};

export const UpdateCompanySchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type UpdateCompanyRequest = z.infer<typeof UpdateCompanySchema>;
