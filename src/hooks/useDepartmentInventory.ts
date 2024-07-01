import { useQuery } from "@tanstack/react-query";
import { Inventory } from "../models/inventory";
import { getInventoryByDepartmentQueryOptions } from "../queries/inventory";
import { Guid } from "../models/types";

type InventoryResponse =
  | { isLoading: true }
  | {
      isLoading: false;
      inventory: Inventory[];
      error: null;
      reload: () => Promise<void>;
    }
  | { isLoading: false; error: Error };

export function useDepartmentInventory(departmentId: Guid): InventoryResponse {
  const {
    data: inventory,
    error,
    isLoading,
    refetch,
  } = useQuery(getInventoryByDepartmentQueryOptions(departmentId));

  async function reload() {
    await refetch();
  }

  if (isLoading) {
    return { isLoading: true };
  }

  if (error) {
    return { isLoading: false, error };
  }

  if (!inventory) {
    throw new Error(`Failed to get inventory for department ${departmentId}`);
  }

  return {
    isLoading,
    error,
    inventory,
    reload,
  };
}
