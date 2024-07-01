import { Select, TextInput, Stack, Space, Group } from "@mantine/core";
import {
  CreateItemRequest,
  CreateItemSchema,
  itemCategories,
} from "../../models/item";
import { icons } from "../../assets";
import { ValidatedForm } from "../ValidatedForm";
import { zodResolver } from "@mantine/form";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { CreateItem } from "../../services/ItemsService";
import { modals } from "@mantine/modals";
import { Unit } from "../../models/units";

export type AddItemProps = {
  units: Unit[];
  onItemAdded: () => Promise<void>;
};

export function AddItem({ units, onItemAdded }: AddItemProps) {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (request: CreateItemRequest) => {
      setError(null);
      try {
        await CreateItem(request);
        await onItemAdded();
        modals.closeAll();
      } catch (err) {
        setError(t((err as Error).message || "Failed to create item"));
      }
    },
    [onItemAdded, t]
  );

  const initialValues = {
    category: itemCategories[0],
    description: "",
    unit: units[0].id,
  } satisfies CreateItemRequest;

  return (
    <ValidatedForm<CreateItemRequest>
      name="create-item-form"
      validate={zodResolver(CreateItemSchema)}
      initialValues={initialValues}
      onValidSubmit={handleSubmit}
    >
      {({ form, renderSubmitButton }) => (
        <Stack>
          <Group grow>
            <Select
              label={t("sections.items.create.labels.category")}
              data={itemCategories.map((category) => ({
                value: category,
                label: t(`sections.items.categories.${category}`),
              }))}
              placeholder={t("sections.items.placeholders.category")}
              {...form.getInputProps("category")}
              error={error}
            />
            <Select
              label={t("sections.items.create.labels.unit")}
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
            label={t("sections.items.create.labels.description")}
            placeholder={t("sections.items.placeholders.description")}
            {...form.getInputProps("description")}
            error={error}
          />
          <Space />
          {renderSubmitButton({
            text: t("sections.items.buttons.createItem"),
            disableIfInvalid: true,
            rightSection: <icons.Add />,
            color: "green",
          })}
        </Stack>
      )}
    </ValidatedForm>
  );
}
