import { useQuery } from "@tanstack/react-query";
import { Unit } from "../models/units";
import { getUnitsQueryOptions } from "../queries/unit";

type UnitsResponse =
  | { isLoading: true }
  | {
      isLoading: false;
      units: Unit[];
      error: null;
      reload: () => Promise<void>;
    }
  | { isLoading: false; error: Error };

export function useUnits(): UnitsResponse {
  const {
    data: units,
    error,
    isLoading,
    refetch,
  } = useQuery(getUnitsQueryOptions);

  async function reload() {
    await refetch();
  }

  if (isLoading) {
    return { isLoading: true };
  }

  if (error) {
    return { isLoading: false, error };
  }

  if (!units) {
    throw new Error("Failed to get units");
  }

  return {
    isLoading,
    error,
    units,
    reload,
  };
}
