import { useQuery } from "@tanstack/react-query";
import { Department } from "../models/department";
import { getActiveDepartmentQueryOptions } from "../queries/department";

type ActiveDepartmentResponse =
  | { isLoading: true }
  | {
      isLoading: false;
      department: Department | null;
      error: null;
      reload: () => void;
    }
  | { isLoading: false; error: Error };

export function useActiveDepartment(): ActiveDepartmentResponse {
  const {
    data: department,
    error,
    isLoading,
    refetch,
  } = useQuery(getActiveDepartmentQueryOptions);

  async function reload() {
    await refetch();
  }

  if (isLoading) {
    return { isLoading: true };
  }

  if (error) {
    return { isLoading: false, error };
  }

  return {
    isLoading,
    error,
    department: department ?? null,
    reload,
  };
}
