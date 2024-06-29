import { useQuery } from "@tanstack/react-query";
import { Company } from "../models/company";
import { getActiveCompanyQueryOptions } from "../queries/active-company";

type ActiveCompanyResponse =
  | { isLoading: true }
  | { isLoading: false; company: Company; error: null; reload: () => void }
  | { isLoading: false; error: Error };

export function useActiveCompany(): ActiveCompanyResponse {
  const {
    data: company,
    error,
    isLoading,
    refetch,
  } = useQuery(getActiveCompanyQueryOptions);

  async function reload() {
    await refetch();
  }

  if (isLoading) {
    return { isLoading: true };
  }

  if (error) {
    return { isLoading: false, error };
  }

  if (!company) {
    throw new Error("Failed to get active company");
  }

  return {
    isLoading,
    error,
    company,
    reload,
  };
}
