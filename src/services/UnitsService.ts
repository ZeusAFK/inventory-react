import { Unit, CreateUnitRequest, UpdateUnitRequest } from "../models/units";
import { Guid } from "../models/types";
import { StorageService } from "./StorageService";

export async function CreateUnit(request: CreateUnitRequest): Promise<Unit> {
  const unit = StorageService.createUnit(request);

  return unit;
}

export async function UpdateUnit(request: UpdateUnitRequest): Promise<void> {
  StorageService.updateUnit(request);
}

export async function DeleteUnit(unitId: Guid): Promise<void> {
  StorageService.deleteUnit(unitId);
}

export async function GetUnits(signal?: AbortSignal): Promise<Unit[]> {
  const units = StorageService.getUnits();

  if (signal) {
    // DO NOTHING
  }

  return units;
}
