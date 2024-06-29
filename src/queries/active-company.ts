import { queryOptions } from "@tanstack/react-query";

import { GetActiveCompany } from "../services/CompaniesService";

export const getActiveCompanyQueryOptions = queryOptions({
  queryKey: ["active-company"],
  queryFn: ({ signal }) => GetActiveCompany(signal),
});
