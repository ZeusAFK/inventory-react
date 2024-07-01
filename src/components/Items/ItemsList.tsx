import {
  DataTable,
  DataTableColumn,
  DataTableSortStatus,
} from "mantine-datatable";
import sortBy from "lodash/sortBy";
import { Item } from "../../models/item";
import { ActionIcon, Group, MultiSelect, Text, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { icons } from "../../assets";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Guid } from "../../models/types";
import { DeleteItem } from "../../services/ItemsService";
import { EditItem } from "./EditItem";
import { useTranslation } from "react-i18next";
import { Unit } from "../../models/units";
import { useDebouncedValue } from "@mantine/hooks";

export type ItemsListProps = {
  items: Item[];
  units: Unit[];
  onItemUpdated: (itemId: Guid) => Promise<void>;
  onItemDeleted: () => Promise<void>;
};

export function ItemsList({
  items,
  units,
  onItemUpdated,
  onItemDeleted,
}: ItemsListProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState(sortBy(items, "description"));
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<Item>>({
    columnAccessor: "name",
    direction: "asc",
  });

  const categories = useMemo(() => {
    const categories = new Set(
      items.map((x) => ({
        value: x.category,
        label: t(`sections.items.categories.${x.category}`),
      }))
    );
    return [...categories];
  }, [items, t]);

  useEffect(() => {
    const filteredRecords = items.filter((item) => {
      if (
        debouncedQuery !== "" &&
        !item.description
          .toLowerCase()
          .includes(debouncedQuery.trim().toLowerCase())
      ) {
        return false;
      }

      if (
        selectedCategories.length &&
        !selectedCategories.some((x) => x === item.category)
      ) {
        return false;
      }

      return true;
    });

    const data = sortBy(filteredRecords, sortStatus.columnAccessor) as Item[];
    setRecords(sortStatus.direction === "desc" ? data.reverse() : data);
  }, [debouncedQuery, items, selectedCategories, sortStatus]);

  const handleItemUpdate = useCallback(
    (item: Item) => {
      modals.open({
        title: t("sections.items.edit.title", { item: item.description }),
        children: (
          <EditItem item={item} units={units} onItemUpdated={onItemUpdated} />
        ),
        size: "md",
        closeOnClickOutside: false,
      });
    },
    [onItemUpdated, t, units]
  );

  const handleItemDelete = useCallback(
    (itemId: Guid) => {
      modals.openConfirmModal({
        title: t("sections.items.delete.title"),
        children: <Text size="sm">{t("sections.items.delete.warning")}</Text>,
        labels: {
          confirm: t("sections.items.buttons.deleteItem"),
          cancel: t("buttons.cancel"),
        },
        confirmProps: { color: "red" },
        closeOnClickOutside: false,
        onConfirm: () => {
          setLoading(true);
          DeleteItem(itemId)
            .then(async () => await onItemDeleted())
            .catch((err) => {
              notifications.show({
                color: "red",
                message: err.message || "Failed to delete item",
                icon: <icons.Error />,
              });
            })
            .finally(() => {
              setLoading(false);
            });
        },
      });
    },
    [onItemDeleted, t]
  );

  const columns = [
    {
      accessor: "description",
      title: t("sections.items.headers.description"),
      sortable: true,
      filter: (
        <TextInput
          placeholder="Buscar articulo..."
          leftSection={<icons.Search size={16} />}
          rightSection={
            <ActionIcon
              size="sm"
              variant="transparent"
              c="dimmed"
              onClick={() => setQuery("")}
            >
              <icons.Close size={14} />
            </ActionIcon>
          }
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
        />
      ),
      filtering: query !== "",
    },
    {
      accessor: "category",
      title: t("sections.items.headers.category"),
      sortable: true,
      width: 150,
      render: (item) => (
        <Text>{t(`sections.items.categories.${item.category}`)}</Text>
      ),
      filter: (
        <MultiSelect
          data={categories}
          value={selectedCategories}
          placeholder="Search area…"
          onChange={setSelectedCategories}
          leftSection={<icons.Search size={16} />}
          clearable
          searchable
        />
      ),
      filtering: selectedCategories.length > 0,
    },
    {
      accessor: "unit",
      title: t("sections.items.headers.unit"),
      sortable: true,
      width: 170,
      render: (item) => {
        const unit = units.find((x) => x.id === item.unit);

        if (unit) {
          return <Text>{unit.name}</Text>;
        }

        return t("sections.parameters.units.unknowUnit");
      },
    },
    {
      accessor: "actions",
      title: t("sections.items.headers.actions"),
      textAlign: "center",
      width: 100,
      render: (item) => (
        <Group gap={5} justify="space-evenly" wrap="nowrap">
          <ActionIcon
            size="sm"
            variant="subtle"
            color="blue"
            disabled={loading}
            onClick={() => handleItemUpdate(item)}
          >
            <icons.Edit />
          </ActionIcon>
          <ActionIcon
            size="sm"
            variant="subtle"
            color="red"
            disabled={loading}
            onClick={() => handleItemDelete(item.id)}
          >
            <icons.Delete />
          </ActionIcon>
        </Group>
      ),
    },
  ] satisfies DataTableColumn<Item>[];

  return (
    <DataTable<Item>
      idAccessor="id"
      columns={columns}
      records={records}
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
      withTableBorder
      withColumnBorders
      striped
      highlightOnHover
      textSelectionDisabled
    />
  );
}
