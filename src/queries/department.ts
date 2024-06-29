import { queryOptions } from "@tanstack/react-query";

import {
  GetActiveDepartment,
  GetDepartmentsByCompany,
} from "../services/DepartmentsService";
import { Guid } from "../models/types";

export const getDepartmentsByCompanyQueryOptions = (companyId: Guid) =>
  queryOptions({
    queryKey: ["departments", companyId],
    queryFn: ({ signal }) => GetDepartmentsByCompany(companyId, signal),
  });

export const getActiveDepartmentQueryOptions = queryOptions({
  queryKey: ["active-department"],
  queryFn: ({ signal }) => GetActiveDepartment(signal),
});
