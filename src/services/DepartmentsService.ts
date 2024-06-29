import {
  Department,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from "../models/department";
import { Guid } from "../models/types";
import { StorageService } from "./StorageService";

export async function CreateDepartment(
  request: CreateDepartmentRequest
): Promise<Department> {
  const department = StorageService.createDepartment(request);

  return department;
}

export async function UpdateDepartment(
  request: UpdateDepartmentRequest
): Promise<void> {
  StorageService.updateDepartment(request);
}

export async function GetActiveDepartment(
  signal?: AbortSignal
): Promise<Department | null> {
  if (signal) {
    // DO NOTHING
  }

  return StorageService.getActiveDepartment();
}

export async function SetActiveDepartment(departmentId: Guid): Promise<void> {
  StorageService.setActiveDepartment(departmentId);
}

export async function DeleteDepartment(departmentId: Guid): Promise<void> {
  StorageService.deleteDepartment(departmentId);
}

export async function GetDepartments(
  signal?: AbortSignal
): Promise<Department[]> {
  const departments = StorageService.getDepartments();

  if (signal) {
    // DO NOTHING
  }

  return departments;
}

export async function GetDepartmentsByCompany(
  companyId: Guid,
  signal?: AbortSignal
): Promise<Department[]> {
  const departments = StorageService.getDepartmentsByCompany(companyId);

  if (signal) {
    // DO NOTHING
  }

  return departments;
}
