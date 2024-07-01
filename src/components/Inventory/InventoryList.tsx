import {
  DataTable,
  DataTableColumn,
  DataTableSortStatus,
} from "mantine-datatable";
import sortBy from "lodash/sortBy";
import { Inventory } from "../../models/inventory";
import { ActionIcon, Group, MultiSelect, Text, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { icons } from "../../assets";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Guid } from "../../models/types";
import { DeleteInventory } from "../../services/InventoryService";
import { useTranslation } from "react-i18next";
import { Item } from "../../models/item";
import { useDebouncedValue } from "@mantine/hooks";
import { EditInventory } from "./EditInventory";

export type InventoryListProps = {
  inventory: Inventory[];
  items: Item[];
  onInventoryUpdated: (inventoryId: Guid) => Promise<void>;
  onInventoryDeleted: () => Promise<void>;
};

export function InventoryList({
  inventory,
  items,
  onInventoryUpdated,
  onInventoryDeleted,
}: InventoryListProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState(sortBy(inventory, "date"));
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<Inventory>>({
    columnAccessor: "date",
    direction: "desc",
  });

  const categories = useMemo(() => {
    const options = new Set(
      inventory.map((x) => {
        const item = items.find((i) => i.id == x.itemId);
        return {
          value: item?.category ?? "",
          label: t(`sections.items.categories.${item?.category}`),
        };
      })
    );
    return [...options];
  }, [inventory, items, t]);

  useEffect(() => {
    const filteredRecords = inventory.filter((record) => {
      const item = items.find((x) => x.id === record.itemId);
      if (!item) return false;

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

    const data = sortBy(
      filteredRecords,
      sortStatus.columnAccessor
    ) as Inventory[];
    setRecords(sortStatus.direction === "desc" ? data.reverse() : data);
  }, [debouncedQuery, inventory, selectedCategories, sortStatus, items]);

  const handleInventoryUpdate = useCallback(
    (record: Inventory) => {
      modals.open({
        title: t("sections.inventory.edit.title"),
        children: (
          <EditInventory
            inventory={record}
            items={items}
            onInventoryUpdated={onInventoryUpdated}
          />
        ),
        size: "md",
        closeOnClickOutside: false,
      });
    },
    [items, onInventoryUpdated, t]
  );

  const handleInventoryDelete = useCallback(
    (inventoryId: Guid) => {
      modals.openConfirmModal({
        title: t("sections.inventory.delete.title"),
        children: (
          <Text size="sm">{t("sections.inventory.delete.warning")}</Text>
        ),
        labels: {
          confirm: t("sections.inventory.buttons.deleteInventory"),
          cancel: t("buttons.cancel"),
        },
        confirmProps: { color: "red" },
        closeOnClickOutside: false,
        onConfirm: () => {
          setLoading(true);
          DeleteInventory(inventoryId)
            .then(async () => await onInventoryDeleted())
            .catch((err) => {
              notifications.show({
                color: "red",
                message: err.message || "Failed to delete inventory",
                icon: <icons.Error />,
              });
            })
            .finally(() => {
              setLoading(false);
            });
        },
      });
    },
    [onInventoryDeleted, t]
  );

  const columns = [
    {
      accessor: "item.name",
      title: t("sections.inventory.headers.item"),
      sortable: true,
      render: (inventory) => {
        const item = items.find((x) => x.id == inventory.itemId);
        return <Text>{item?.description ?? inventory.itemId}</Text>;
      },
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
      accessor: "item.category",
      title: t("sections.inventory.headers.category"),
      width: 170,
      sortable: true,
      filter: (
        <MultiSelect
          data={categories}
          value={selectedCategories}
          placeholder="Search item…"
          onChange={setSelectedCategories}
          leftSection={<icons.Search size={16} />}
          clearable
          searchable
        />
      ),
      filtering: selectedCategories.length > 0,
      render: (record) => {
        const item = items.find((x) => x.id === record.itemId);
        return item !== undefined ? (
          <Text>{t(`sections.items.categories.${item.category}`)}</Text>
        ) : (
          <Text>{t("sections.inventory.unknowInventory")}</Text>
        );
      },
    },
    {
      accessor: "quantity",
      title: t("sections.inventory.headers.quantity"),
      sortable: true,
      width: 120,
      render: (record) => <Text>{record.quantity}</Text>,
    },
    {
      accessor: "date",
      title: t("sections.inventory.headers.date"),
      sortable: true,
      width: 120,
      render: (record) => (
        <Text>{new Date(record.date).toLocaleDateString()}</Text>
      ),
    },
    {
      accessor: "actions",
      title: t("sections.inventory.headers.actions"),
      textAlign: "center",
      width: 100,
      render: (record) => (
        <Group gap={5} justify="space-evenly" wrap="nowrap">
          <ActionIcon
            size="sm"
            variant="subtle"
            color="blue"
            disabled={loading}
            onClick={() => handleInventoryUpdate(record)}
          >
            <icons.Edit />
          </ActionIcon>
          <ActionIcon
            size="sm"
            variant="subtle"
            color="red"
            disabled={loading}
            onClick={() => handleInventoryDelete(record.id)}
          >
            <icons.Delete />
          </ActionIcon>
        </Group>
      ),
    },
  ] satisfies DataTableColumn<Inventory>[];

  return (
    <DataTable<Inventory>
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
