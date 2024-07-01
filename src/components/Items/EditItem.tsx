import { Select, TextInput, Stack, Space, Group } from "@mantine/core";
import {
  Item,
  UpdateItemRequest,
  UpdateItemSchema,
  itemCategories,
} from "../../models/item";
import { icons } from "../../assets";
import { ValidatedForm } from "../ValidatedForm";
import { zodResolver } from "@mantine/form";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { modals } from "@mantine/modals";
import { Unit } from "../../models/units";
import { UpdateItem } from "../../services/ItemsService";
import { Guid } from "../../models/types";

export type EditItemProps = {
  item: Item;
  units: Unit[];
  onItemUpdated: (itemId: Guid) => Promise<void>;
};

export function EditItem({ item, units, onItemUpdated }: EditItemProps) {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (request: UpdateItemRequest) => {
      setError(null);
      try {
        await UpdateItem(request);
        await onItemUpdated(request.id);
        modals.closeAll();
      } catch (err) {
        setError(t((err as Error).message || "Failed to update item"));
      }
    },
    [onItemUpdated, t]
  );

  const initialValues = {
    id: item.id,
    category: itemCategories[0],
    description: item.description,
    unit: item.unit,
  } satisfies UpdateItemRequest;

  return (
    <ValidatedForm<UpdateItemRequest>
      name="update-item-form"
      validate={zodResolver(UpdateItemSchema)}
      initialValues={initialValues}
      onValidSubmit={handleSubmit}
    >
      {({ form, renderSubmitButton }) => (
        <Stack>
          <Group grow>
            <Select
              label={t("sections.items.edit.labels.category")}
              data={itemCategories.map((category) => ({
                value: category,
                label: t(`sections.items.categories.${category}`),
              }))}
              placeholder={t("sections.items.placeholders.category")}
              {...form.getInputProps("category")}
              error={error}
            />
            <Select
              label={t("sections.items.edit.labels.unit")}
              data={units.map((unit) => ({
                value: unit.id,
                label: unit.name,
              }))}
              placeholder={t("sections.items.placeholders.unit")}
              {...form.getInputProps("unit")}
              error={error}
            />
          </Group>
          <TextInput
            label={t("sections.items.edit.labels.description")}
            placeholder={t("sections.items.placeholders.description")}
            {...form.getInputProps("description")}
            error={error}
          />
          <Space />
          {renderSubmitButton({
            text: t("buttons.save"),
            disableIfInvalid: true,
            rightSection: <icons.Add />,
            color: "green",
          })}
        </Stack>
      )}
    </ValidatedForm>
  );
}
