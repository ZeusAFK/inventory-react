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
import { CreateUnitRequest, Unit, UpdateUnitRequest } from "../models/units";
import { CreateItemRequest, Item, UpdateItemRequest } from "../models/item";

export class StorageService {
  private static readonly COMPANY_STORAGE_KEY: StorageKey = "companies";
  private static readonly DEPARTMENT_STORAGE_KEY: StorageKey = "departments";
  private static readonly UNIT_STORAGE_KEY: StorageKey = "units";
  private static readonly ITEM_STORAGE_KEY: StorageKey = "items";

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
      throw new Error("sections.company.errors.companyAlreadyExists");
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

  static deleteCompany(companyId: Guid): void {
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
      throw new Error("sections.company.errors.companyNotFound");
    }

    const existingCompanyWithName = companies.find(
      (company) => company.name === request.name && company.id !== request.id
    );
    if (existingCompanyWithName) {
      throw new Error("sections.company.errors.companyAlreadyExists");
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
      throw new Error("sections.departments.errors.departmentAlreadyExists");
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

  static deleteDepartment(departmentId: Guid): void {
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
      throw new Error("sections.departments.errors.departmentNotFound");
    }

    const existingDepartmentWithName = departments.find(
      (department) =>
        department.name === request.name &&
        department.companyId === request.companyId &&
        department.id !== request.id
    );
    if (existingDepartmentWithName) {
      throw new Error("sections.departments.errors.departmentNotFound");
    }

    departments[departmentIndex].name = request.name;
    LocalStorageService.setItem(this.DEPARTMENT_STORAGE_KEY, departments);

    return departments[departmentIndex];
  }

  static getUnits(): Unit[] {
    return LocalStorageService.getItem<Unit[]>(this.UNIT_STORAGE_KEY) || [];
  }

  static createUnit(request: CreateUnitRequest): Unit {
    const units = this.getUnits() || [];

    const existingUnit = units.find((x) => x.name === request.name);
    if (existingUnit) {
      throw new Error("sections.units.errors.unitAlreadyExists");
    }

    const unit: Unit = { id: uuid(), name: request.name };
    units.push(unit);
    LocalStorageService.setItem(this.UNIT_STORAGE_KEY, units);
    return unit;
  }

  static updateUnit(request: UpdateUnitRequest): Unit {
    const units = this.getUnits();

    const unitIndex = units.findIndex((unit) => unit.id === request.id);
    if (unitIndex === -1) {
      throw new Error("sections.units.errors.unitNotFound");
    }

    const existingUnitWithName = units.find(
      (unit) => unit.name === request.name && unit.id !== request.id
    );
    if (existingUnitWithName) {
      throw new Error("sections.units.errors.unitAlreadyExists");
    }

    units[unitIndex].name = request.name;
    LocalStorageService.setItem(this.UNIT_STORAGE_KEY, units);

    return units[unitIndex];
  }

  static deleteUnit(unitId: Guid): void {
    let units = this.getUnits();
    units = units.filter((unit) => unit.id !== unitId);
    LocalStorageService.setItem(this.UNIT_STORAGE_KEY, units);
  }

  static createItem(request: CreateItemRequest): Item {
    const items = this.getItems() || [];

    const existingItem = items.find(
      (x) => x.description === request.description
    );
    if (existingItem) {
      throw new Error("sections.items.errors.itemAlreadyExists");
    }

    const item: Item = {
      id: uuid(),
      category: request.category,
      description: request.description,
      unit: request.unit,
    };
    items.push(item);
    LocalStorageService.setItem(this.ITEM_STORAGE_KEY, items);
    return item;
  }

  static updateItem(request: UpdateItemRequest): Item {
    const items = this.getItems();

    const itemIndex = items.findIndex((item) => item.id === request.id);
    if (itemIndex === -1) {
      throw new Error("sections.items.errors.itemNotFound");
    }

    const existingItemWithDescription = items.find(
      (item) =>
        item.description === request.description && item.id !== request.id
    );
    if (existingItemWithDescription) {
      throw new Error("sections.items.errors.itemAlreadyExists");
    }

    items[itemIndex].category = request.category;
    items[itemIndex].description = request.description;
    items[itemIndex].unit = request.unit;
    LocalStorageService.setItem(this.ITEM_STORAGE_KEY, items);

    return items[itemIndex];
  }

  static deleteItem(itemId: Guid): void {
    let items = this.getItems();
    items = items.filter((item) => item.id !== itemId);
    LocalStorageService.setItem(this.ITEM_STORAGE_KEY, items);
  }

  static getItems(): Item[] {
    return LocalStorageService.getItem<Item[]>(this.ITEM_STORAGE_KEY) || [];
  }
}
