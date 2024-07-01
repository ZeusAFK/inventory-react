import { queryOptions } from "@tanstack/react-query";

import { GetItems } from "../services/ItemsService";

export const getItemsQueryOptions = queryOptions({
  queryKey: ["items"],
  queryFn: ({ signal }) => GetItems(signal),
});
