import { Item, CreateItemRequest, UpdateItemRequest } from "../models/item";
import { Guid } from "../models/types";
import { StorageService } from "./StorageService";

export async function CreateItem(request: CreateItemRequest): Promise<Item> {
  const item = StorageService.createItem(request);

  return item;
}

export async function UpdateItem(request: UpdateItemRequest): Promise<void> {
  StorageService.updateItem(request);
}

export async function DeleteItem(itemId: Guid): Promise<void> {
  StorageService.deleteItem(itemId);
}

export async function GetItems(signal?: AbortSignal): Promise<Item[]> {
  const items = StorageService.getItems();

  if (signal) {
    // DO NOTHING
  }

  return items;
}
