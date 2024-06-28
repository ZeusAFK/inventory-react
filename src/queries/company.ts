import { queryOptions } from '@tanstack/react-query';

import { GetCompanies } from "../services/CompaniesService";

export const getCompaniesQueryOptions = queryOptions({
  queryKey: ['companies'],
  queryFn: ({ signal }) => GetCompanies(signal),
});
