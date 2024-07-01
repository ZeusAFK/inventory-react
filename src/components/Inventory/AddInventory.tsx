import { Stack, Space, Group, NumberInput, Autocomplete } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  CreateInventoryRequest,
  CreateInventorySchema,
} from "../../models/inventory";
import { icons } from "../../assets";
import { ValidatedForm } from "../ValidatedForm";
import { zodResolver } from "@mantine/form";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { CreateInventory } from "../../services/InventoryService";
import { modals } from "@mantine/modals";
import { Item } from "../../models/item";
import { Department } from "../../models/department";

export type AddInventoryProps = {
  items: Item[];
  activeDepartment: Department;
  onInventoryAdded: () => Promise<void>;
};

export function AddInventory({
  items,
  activeDepartment,
  onInventoryAdded,
}: AddInventoryProps) {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (request: CreateInventoryRequest) => {
      const item = items.find((x) => x.description == request.itemId);
      if (item === undefined) {
        return;
      }
      const itemName = request.itemId;
      request.itemId = item.id;

      setError(null);
      try {
        await CreateInventory(request);
        await onInventoryAdded();
        modals.closeAll();
      } catch (err) {
        request.itemId = itemName;
        setError(
          t((err as Error).message || "Failed to create inventory item")
        );
      }
    },
    [items, onInventoryAdded, t]
  );

  const initialValues = {
    departmentId: activeDepartment.id,
    itemId: "",
    quantity: 1,
    date: new Date(),
  } satisfies CreateInventoryRequest;

  return (
    <ValidatedForm<CreateInventoryRequest>
      name="create-inventory-form"
      validate={zodResolver(CreateInventorySchema)}
      initialValues={initialValues}
      onValidSubmit={handleSubmit}
    >
      {({ form, renderSubmitButton }) => (
        <Stack>
          <Autocomplete
            label={t("sections.inventory.create.labels.item")}
            data={items.map((item) => ({
              value: item.id,
              label: item.description,
            }))}
            placeholder={t("sections.inventory.create.placeholders.item")}
            {...form.getInputProps("itemId")}
            error={error}
          />
          <Group grow>
            <NumberInput
              label={t("sections.inventory.create.labels.quantity")}
              placeholder={t("sections.inventory.placeholders.quantity")}
              {...form.getInputProps("quantity")}
            />
            <DateInput
              label={t("sections.inventory.create.labels.date")}
              placeholder={t("sections.inventory.placeholders.date")}
              valueFormat="DD/M/YYYY"
              {...form.getInputProps("date")}
            />
          </Group>
          <Space />
          {renderSubmitButton({
            text: t("sections.inventory.buttons.createInventory"),
            disableIfInvalid: true,
            rightSection: <icons.Add />,
            color: "green",
          })}
        </Stack>
      )}
    </ValidatedForm>
  );
}
