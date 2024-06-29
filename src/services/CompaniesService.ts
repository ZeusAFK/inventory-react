import {
  Company,
  CreateCompanyRequest,
  UpdateCompanyRequest,
} from "../models/company";
import { Guid } from "../models/types";
import { StorageService } from "./StorageService";

export async function CreateCompany(
  request: CreateCompanyRequest
): Promise<Company> {
  const company = StorageService.createCompany(request);

  return company;
}

export async function UpdateCompany(
  request: UpdateCompanyRequest
): Promise<void> {
  StorageService.updateCompany(request);
}

export async function GetActiveCompany(
  signal?: AbortSignal
): Promise<Company | undefined> {
  if (signal) {
    // DO NOTHING
  }

  return StorageService.getActiveCompany();
}

export async function DeleteCompany(companyId: Guid): Promise<void> {
  StorageService.deleteCompany(companyId);
}

export async function GetCompanies(signal?: AbortSignal): Promise<Company[]> {
  const companies = StorageService.getCompanies();

  if (signal) {
    // DO NOTHING
  }

  return companies;
}
