import { Guid } from "./types";

export type Inventory = {
  itemId: Guid;
  departmentId: Guid;
  quantity: number;
}
