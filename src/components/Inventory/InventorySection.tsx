import {
  Alert,
  Button,
  Group,
  LoadingOverlay,
  Stack,
  Title,
} from "@mantine/core";
import { Company } from "../../models/company";
import { icons } from "../../assets";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDepartmentInventory } from "../../hooks/useDepartmentInventory";
import { Department } from "../../models/department";
import { AddInventory } from "./AddInventory";
import { useItems } from "../../hooks/useItems";
import { modals } from "@mantine/modals";
import { InventoryList } from "./InventoryList";

export type InventorySectionProps = {
  activeCompany: Company;
  activeDepartment: Department;
};

export function InventorySection({
  activeCompany,
  activeDepartment,
}: InventorySectionProps) {
  const { t } = useTranslation();
  const inventory = useDepartmentInventory(activeDepartment.id);
  const items = useItems();

  const fetchInventory = useCallback(async () => {
    if (!inventory.isLoading && !inventory.error) {
      await inventory.reload();
    }
  }, [inventory]);

  const handleCreateInventory = useCallback(() => {
    const availableItems = !items.isLoading && !items.error ? items.items : [];
    modals.open({
      title: t("sections.inventory.create.title"),
      children: (
        <AddInventory
          items={availableItems}
          activeDepartment={activeDepartment}
          onInventoryAdded={fetchInventory}
        />
      ),
      size: "lg",
      closeOnClickOutside: false,
    });
  }, [activeDepartment, fetchInventory, items, t]);

  if (inventory.isLoading || items.isLoading) {
    return <LoadingOverlay />;
  }

  if (inventory.error || items.error) {
    return (
      <Alert variant="light" color="red" title="Error" icon={<icons.Warning />}>
        {inventory.error?.message ?? items.error?.message}
      </Alert>
    );
  }

  return (
    <Stack>
      <Group justify="space-between">
        <Group>
          <icons.Inventory size={20} />
          <Title order={3}>
            {t("sections.inventory.title", {
              company: activeCompany.name,
              department: activeDepartment.name,
            })}
          </Title>
        </Group>
        <Button leftSection={<icons.Add />} onClick={handleCreateInventory}>
          {t("sections.inventory.buttons.createInventory")}
        </Button>
      </Group>
      <InventoryList
        inventory={inventory.inventory}
        items={items.items}
        onInventoryUpdated={fetchInventory}
        onInventoryDeleted={fetchInventory}
      />
    </Stack>
  );
}
