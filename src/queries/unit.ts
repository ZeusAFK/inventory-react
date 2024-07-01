import { queryOptions } from "@tanstack/react-query";

import { GetUnits } from "../services/UnitsService";

export const getUnitsQueryOptions = queryOptions({
  queryKey: ["units"],
  queryFn: ({ signal }) => GetUnits(signal),
});
