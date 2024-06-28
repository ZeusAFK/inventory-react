import { useQuery } from '@tanstack/react-query';
import { Company } from '../models/company';
import { getCompaniesQueryOptions } from '../queries/company';

type CompaniesResponse =
  | { isLoading: true, refetch: () => void }
  | { isLoading: false; companies: Company[]; error: null, refetch: () => void }
  | { isLoading: false; error: Error, refetch: () => void };

export function useCompanies(): CompaniesResponse {
  const { data: companies, error, isLoading, refetch } = useQuery(getCompaniesQueryOptions);

  if (isLoading) {
    return { isLoading: true, refetch };
  }

  if (error) {
    return { isLoading: false, error, refetch };
  }

  if (!companies) {
    throw new Error('Failed to get companies');
  }

  return {
    isLoading,
    error,
    companies,
    refetch,
  };
}
