import { useQuery } from "@tanstack/react-query";
import { Department } from "../models/department";
import { getDepartmentsByCompanyQueryOptions } from "../queries/department";
import { Guid } from "../models/types";

type DepartmentsResponse =
  | { isLoading: true }
  | {
      isLoading: false;
      departments: Department[];
      error: null;
      reload: () => Promise<void>;
    }
  | { isLoading: false; error: Error };

export function useCompanyDepartments(companyId: Guid): DepartmentsResponse {
  const {
    data: departments,
    error,
    isLoading,
    refetch,
  } = useQuery(getDepartmentsByCompanyQueryOptions(companyId));

  async function reload() {
    await refetch();
  }

  if (isLoading) {
    return { isLoading: true };
  }

  if (error) {
    return { isLoading: false, error };
  }

  if (!departments) {
    throw new Error(`Failed to get departments for company ${companyId}`);
  }

  return {
    isLoading,
    error,
    departments,
    reload,
  };
}
