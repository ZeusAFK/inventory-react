import { useQuery } from "@tanstack/react-query";
import { Company } from "../models/company";
import { getActiveCompanyQueryOptions } from "../queries/active-company";

type ActiveCompanyResponse =
  | { isLoading: true }
  | { isLoading: false; company: Company | null; error: null; reload: () => void }
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

  return {
    isLoading,
    error,
    company: company ?? null,
    reload,
  };
}
