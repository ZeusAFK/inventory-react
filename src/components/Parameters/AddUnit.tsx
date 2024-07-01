import { Group, TextInput } from "@mantine/core";
import { CreateUnitRequest, CreateUnitSchema } from "../../models/units";
import { ValidatedForm } from "../ValidatedForm";
import { zodResolver } from "@mantine/form";
import { useCallback, useState } from "react";
import { CreateUnit } from "../../services/UnitsService";
import { icons } from "../../assets";
import { useTranslation } from "react-i18next";

export type AddUnitProps = {
  onUnitAdded: () => Promise<void>;
};

export function AddUnit({ onUnitAdded }: AddUnitProps) {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  const initialValues: CreateUnitRequest = {
    name: "",
  };

  const handleSubmit = useCallback(
    async (request: CreateUnitRequest) => {
      setError(null);
      try {
        await CreateUnit(request);
        await onUnitAdded();
      } catch (err) {
        setError(t((err as Error).message || "Failed to create unit"));
      }
    },
    [onUnitAdded, t]
  );

  return (
    <ValidatedForm<CreateUnitRequest>
      name="create-unit-form"
      validate={zodResolver(CreateUnitSchema)}
      initialValues={initialValues}
      onValidSubmit={handleSubmit}
    >
      {({ form, renderSubmitButton }) => (
        <Group align="flex-start">
          <TextInput
            placeholder={t("sections.parameters.units.placeholders.name")}
            {...form.getInputProps("name")}
            error={error}
          />
          {renderSubmitButton({
            text: t("sections.parameters.units.buttons.createUnit"),
            disableIfInvalid: true,
            rightSection: <icons.Add />,
            color: "green",
          })}
        </Group>
      )}
    </ValidatedForm>
  );
}
