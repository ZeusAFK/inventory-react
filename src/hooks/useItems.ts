import { useQuery } from "@tanstack/react-query";
import { Item } from "../models/item";
import { getItemsQueryOptions } from "../queries/item";

type ItemsResponse =
  | { isLoading: true }
  | {
      isLoading: false;
      items: Item[];
      error: null;
      reload: () => Promise<void>;
    }
  | { isLoading: false; error: Error };

export function useItems(): ItemsResponse {
  const {
    data: items,
    error,
    isLoading,
    refetch,
  } = useQuery(getItemsQueryOptions);

  async function reload() {
    await refetch();
  }

  if (isLoading) {
    return { isLoading: true };
  }

  if (error) {
    return { isLoading: false, error };
  }

  if (!items) {
    throw new Error("Failed to get items");
  }

  return {
    isLoading,
    error,
    items,
    reload,
  };
}
