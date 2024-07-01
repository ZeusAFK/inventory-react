import { queryOptions } from "@tanstack/react-query";

import { Guid } from "../models/types";
import { GetInventoryByDepartment } from "../services/InventoryService";

export const getInventoryByDepartmentQueryOptions = (departmentId: Guid) =>
  queryOptions({
    queryKey: ["inventory", departmentId],
    queryFn: ({ signal }) => GetInventoryByDepartment(departmentId, signal),
  });
