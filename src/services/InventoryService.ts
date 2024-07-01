import {
  Inventory,
  CreateInventoryRequest,
  UpdateInventoryRequest,
} from "../models/inventory";
import { Guid } from "../models/types";
import { StorageService } from "./StorageService";

export async function CreateInventory(
  request: CreateInventoryRequest
): Promise<Inventory> {
  const inventory = StorageService.createInventory(request);

  return inventory;
}

export async function UpdateInventory(
  request: UpdateInventoryRequest
): Promise<void> {
  StorageService.updateInventory(request);
}

export async function DeleteInventory(inventoryId: Guid): Promise<void> {
  StorageService.deleteInventory(inventoryId);
}

export async function GetInventory(signal?: AbortSignal): Promise<Inventory[]> {
  const inventoryItems = StorageService.getInventory();

  if (signal) {
    // DO NOTHING
  }

  return inventoryItems;
}

export async function GetInventoryByDepartment(
  departmentId: Guid,
  signal?: AbortSignal
): Promise<Inventory[]> {
  const inventoryItems = StorageService.getInventoryByDepartment(departmentId);

  if (signal) {
    // DO NOTHING
  }

  return inventoryItems;
}
