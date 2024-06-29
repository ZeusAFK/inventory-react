import { v4 as uuid } from "uuid";
import {
  Company,
  CreateCompanyRequest,
  UpdateCompanyRequest,
} from "../models/company";
import {
  Department,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from "../models/department";
import { LocalStorageService, StorageKey } from "./LocalStorageService";
import { Guid } from "../models/types";

export class StorageService {
  private static readonly COMPANY_STORAGE_KEY: StorageKey = "companies";
  private static readonly DEPARTMENT_STORAGE_KEY: StorageKey = "departments";

  static setActiveCompany(companyId: Guid): void {
    LocalStorageService.setItem("activeCompany", companyId);
  }

  static getActiveCompany(): Company | null {
    const companyId = LocalStorageService.getItem<Guid>("activeCompany");

    if (companyId === null) {
      return null;
    }

    const companies = this.getCompanies() || [];
    const existingCompany = companies.find(
      (company) => company.id === companyId
    );

    return existingCompany ?? null;
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
    LocalStorageService.setItem(this.COMPANY_STORAGE_KEY, companies);
    return company;
  }

  static getCompanies(): Company[] {
    return (
      LocalStorageService.getItem<Company[]>(this.COMPANY_STORAGE_KEY) || []
    );
  }

  static deleteCompany(companyId: string): void {
    let companies = this.getCompanies();
    companies = companies.filter((company) => company.id !== companyId);
    LocalStorageService.setItem(this.COMPANY_STORAGE_KEY, companies);
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
    LocalStorageService.setItem(this.COMPANY_STORAGE_KEY, companies);

    return companies[companyIndex];
  }

  static setActiveDepartment(departmentId: Guid): void {
    LocalStorageService.setItem("activeDepartment", departmentId);
  }

  static getActiveDepartment(): Department | null {
    const departmentId = LocalStorageService.getItem<Guid>("activeDepartment");

    if (departmentId === null) {
      return null;
    }

    const departments = this.getDepartments() || [];
    const existingDepartment = departments.find(
      (department) => department.id === departmentId
    );

    return existingDepartment ?? null;
  }

  static createDepartment(request: CreateDepartmentRequest): Department {
    const departments = this.getDepartments() || [];

    const existingDepartment = departments.find(
      (department) =>
        department.name === request.name &&
        department.companyId === request.companyId
    );
    if (existingDepartment) {
      throw new Error(
        "Ya existe un departamento con el nombre especificado en esta empresa"
      );
    }

    const department: Department = {
      id: uuid(),
      companyId: request.companyId,
      name: request.name,
    };
    departments.push(department);
    LocalStorageService.setItem(this.DEPARTMENT_STORAGE_KEY, departments);
    return department;
  }

  static getDepartments(): Department[] {
    return (
      LocalStorageService.getItem<Department[]>(this.DEPARTMENT_STORAGE_KEY) ||
      []
    );
  }

  static getDepartmentsByCompany(companyId: Guid): Department[] {
    const departments =
      LocalStorageService.getItem<Department[]>(this.DEPARTMENT_STORAGE_KEY) ||
      [];
    const companyDepartments = departments.filter(
      (x) => x.companyId === companyId
    );

    return companyDepartments;
  }

  static deleteDepartment(departmentId: string): void {
    let departments = this.getDepartments();
    departments = departments.filter(
      (department) => department.id !== departmentId
    );
    LocalStorageService.setItem(this.DEPARTMENT_STORAGE_KEY, departments);
  }

  static updateDepartment(request: UpdateDepartmentRequest): Department {
    const departments = this.getDepartments();

    const departmentIndex = departments.findIndex(
      (department) => department.id === request.id
    );
    if (departmentIndex === -1) {
      throw new Error("Departamento no encontrado");
    }

    const existingDepartmentWithName = departments.find(
      (department) =>
        department.name === request.name &&
        department.companyId === request.companyId &&
        department.id !== request.id
    );
    if (existingDepartmentWithName) {
      throw new Error(
        "Ya existe un departamento con el nombre especificado en esta empresa"
      );
    }

    departments[departmentIndex].name = request.name;
    LocalStorageService.setItem(this.DEPARTMENT_STORAGE_KEY, departments);

    return departments[departmentIndex];
  }
}
