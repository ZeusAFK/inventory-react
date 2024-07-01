import { Stack, Space, Group, NumberInput, Text } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  Inventory,
  UpdateInventoryRequest,
  UpdateInventorySchema,
} from "../../models/inventory";
import { icons } from "../../assets";
import { ValidatedForm } from "../ValidatedForm";
import { zodResolver } from "@mantine/form";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { UpdateInventory } from "../../services/InventoryService";
import { modals } from "@mantine/modals";
import { Item } from "../../models/item";
import { Guid } from "../../models/types";

export type EditInventoryProps = {
  inventory: Inventory;
  items: Item[];
  onInventoryUpdated: (inventoryId: Guid) => Promise<void>;
};

export function EditInventory({
  inventory,
  items,
  onInventoryUpdated,
}: EditInventoryProps) {
  const { t } = useTranslation();

  const item = useMemo(() => {
    return (
      items.find((x) => x.id === inventory.itemId)?.description ??
      inventory.itemId
    );
  }, [inventory, items]);

  const handleSubmit = useCallback(
    async (request: UpdateInventoryRequest) => {
      await UpdateInventory(request);
      await onInventoryUpdated(request.id);
      modals.closeAll();
    },
    [onInventoryUpdated]
  );

  const initialValues = {
    id: inventory.id,
    itemId: inventory.itemId,
    quantity: inventory.quantity,
    date: new Date(inventory.date),
  } satisfies UpdateInventoryRequest;

  return (
    <ValidatedForm<UpdateInventoryRequest>
      name="update-inventory-form"
      validate={zodResolver(UpdateInventorySchema)}
      initialValues={initialValues}
      onValidSubmit={handleSubmit}
    >
      {({ form, renderSubmitButton }) => (
        <Stack>
          <Text>{item}</Text>
          <Group grow>
            <NumberInput
              label={t("sections.inventory.edit.labels.quantity")}
              placeholder={t("sections.inventory.placeholders.quantity")}
              {...form.getInputProps("quantity")}
            />
            <DateInput
              label={t("sections.inventory.edit.labels.date")}
              placeholder={t("sections.inventory.placeholders.date")}
              valueFormat="DD/M/YYYY"
              {...form.getInputProps("date")}
            />
          </Group>
          <Space />
          {renderSubmitButton({
            text: t("sections.inventory.buttons.updateInventory"),
            disableIfInvalid: true,
            rightSection: <icons.Add />,
            color: "green",
          })}
        </Stack>
      )}
    </ValidatedForm>
  );
}
