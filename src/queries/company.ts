import { queryOptions } from "@tanstack/react-query";

import { GetActiveCompany, GetCompanies } from "../services/CompaniesService";

export const getCompaniesQueryOptions = queryOptions({
  queryKey: ["companies"],
  queryFn: ({ signal }) => GetCompanies(signal),
});

export const getActiveCompanyQueryOptions = queryOptions({
  queryKey: ["active-company"],
  queryFn: ({ signal }) => GetActiveCompany(signal),
});
