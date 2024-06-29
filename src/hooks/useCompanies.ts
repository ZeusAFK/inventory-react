import { useQuery } from "@tanstack/react-query";
import { Company } from "../models/company";
import { getCompaniesQueryOptions } from "../queries/company";

type CompaniesResponse =
  | { isLoading: true }
  | {
      isLoading: false;
      companies: Company[];
      error: null;
      reload: () => Promise<void>;
    }
  | { isLoading: false; error: Error };

export function useCompanies(): CompaniesResponse {
  const {
    data: companies,
    error,
    isLoading,
    refetch,
  } = useQuery(getCompaniesQueryOptions);

  async function reload() {
    await refetch();
  }

  if (isLoading) {
    return { isLoading: true };
  }

  if (error) {
    return { isLoading: false, error };
  }

  if (!companies) {
    throw new Error("Failed to get companies");
  }

  return {
    isLoading,
    error,
    companies,
    reload,
  };
}
