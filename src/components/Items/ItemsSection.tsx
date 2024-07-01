import {
  Alert,
  Button,
  Group,
  LoadingOverlay,
  Stack,
  Title,
} from "@mantine/core";
import { icons } from "../../assets";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import { modals } from "@mantine/modals";
import { AddItem } from "./AddItem";
import { useItems } from "../../hooks/useItems";
import { ItemsList } from "./ItemsList";
import { useUnits } from "../../hooks/useUnits";

export function ItemsSection() {
  const { t } = useTranslation();
  const items = useItems();
  const units = useUnits();

  const fetchItems = useCallback(async () => {
    if (!items.isLoading && !items.error) {
      await items.reload();
    }
  }, [items]);

  const handleCreateItem = useCallback(() => {
    const availableUnits = !units.isLoading && !units.error ? units.units : [];
    modals.open({
      title: t("sections.items.create.title"),
      children: <AddItem units={availableUnits} onItemAdded={fetchItems} />,
      size: "lg",
      closeOnClickOutside: false,
    });
  }, [fetchItems, t, units]);

  if (items.isLoading || units.isLoading) {
    return <LoadingOverlay visible />;
  }

  if (items.error || units.error) {
    return (
      <Alert variant="light" color="red" title="Error" icon={<icons.Warning />}>
        {items.error?.message ?? units.error?.message}
      </Alert>
    );
  }

  if (units.units.length === 0) {
    return (
      <Alert variant="light" color="blue" icon={<icons.Warning />}>
        {t("sections.items.createFirstUnitWarning")}
      </Alert>
    );
  }

  return (
    <Stack>
      <Group justify="space-between">
        <Group>
          <icons.Company size={20} />
          <Title order={3}>{t("sections.items.title")}</Title>
        </Group>
        <Button leftSection={<icons.Add />} onClick={handleCreateItem}>
          {t("sections.items.buttons.createItem")}
        </Button>
      </Group>
      <ItemsList
        items={items.items}
        units={units.units}
        onItemUpdated={fetchItems}
        onItemDeleted={fetchItems}
      />
    </Stack>
  );
}
