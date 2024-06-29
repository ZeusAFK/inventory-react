import { v4 as uuid } from "uuid";
import {
  Company,
  CreateCompanyRequest,
  UpdateCompanyRequest,
} from "../models/company";
import { LocalStorageService, StorageKey } from "./LocalStorageService";
import { Guid } from "../models/types";

export class StorageService {
  private static readonly STORAGE_KEY: StorageKey = "companies";

  static setActiveCompany(companyId: Guid): void {
    LocalStorageService.setItem("activeCompany", companyId);
  }

  static getActiveCompany(): Company | undefined {
    const companyId = LocalStorageService.getItem<Guid>("activeCompany");

    if (companyId === null) {
      return undefined;
    }

    const companies = this.getCompanies() || [];
    const existingCompany = companies.find(
      (company) => company.id === companyId
    );

    return existingCompany;
  }

  static createCompany(request: CreateCompanyRequest): Company {
    const companies = this.getCompanies() || [];

    const existingCompany = companies.find(
      (company) => company.name === request.name
    );
    if (existingCompany) {
      throw new Error("Ya existe una empresa con el nombre especificado");
    }

    const company: Company = { id: uuid(), name: request.name };
    companies.push(company);
    LocalStorageService.setItem(this.STORAGE_KEY, companies);
    return company;
  }

  static getCompanies(): Company[] {
    return LocalStorageService.getItem<Company[]>(this.STORAGE_KEY) || [];
  }

  static deleteCompany(companyId: string): void {
    let companies = this.getCompanies();
    companies = companies.filter((company) => company.id !== companyId);
    LocalStorageService.setItem(this.STORAGE_KEY, companies);
  }

  static updateCompany(request: UpdateCompanyRequest): Company {
    const companies = this.getCompanies();

    const companyIndex = companies.findIndex(
      (company) => company.id === request.id
    );
    if (companyIndex === -1) {
      throw new Error("Empresa no encontrada");
    }

    const existingCompanyWithName = companies.find(
      (company) => company.name === request.name && company.id !== request.id
    );
    if (existingCompanyWithName) {
      throw new Error("Ya existe una empresa con el nombre especificado");
    }

    companies[companyIndex].name = request.name;
    LocalStorageService.setItem(this.STORAGE_KEY, companies);

    return companies[companyIndex];
  }
}
