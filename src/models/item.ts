import { Guid } from "./types";

export type ItemCategory = 'Office' | 'Cleaning' | 'Cafeteria';

export type Item = {
  id: Guid;
  category: ItemCategory;
  description: string;
  unit: string;
}
