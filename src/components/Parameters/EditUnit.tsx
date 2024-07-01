import { useCallback, useState } from "react";
import { Unit, UpdateUnitRequest, UpdateUnitSchema } from "../../models/units";
import { Guid } from "../../models/types";
import { UpdateUnit } from "../../services/UnitsService";
import { modals } from "@mantine/modals";
import { ValidatedForm } from "../ValidatedForm";
import { zodResolver } from "@mantine/form";
import { Stack, TextInput } from "@mantine/core";
import { useTranslation } from "react-i18next";

export type EditUnitProps = {
  unit: Unit;
  onUnitUpdated: (unitId: Guid) => Promise<void>;
};

export function EditUnit({ unit, onUnitUpdated }: EditUnitProps) {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  const initialValues = {
    id: unit.id,
    name: unit.name,
  } satisfies UpdateUnitRequest;

  const handleSubmit = useCallback(
    async (request: UpdateUnitRequest) => {
      setError(null);
      try {
        await UpdateUnit(request);
        await onUnitUpdated(request.id);
        modals.closeAll();
      } catch (err: unknown) {
        setError((err as Error).message || "Failed to update unit");
      }
    },
    [onUnitUpdated]
  );

  return (
    <ValidatedForm<UpdateUnitRequest>
      name="update-unit-form"
      validate={zodResolver(UpdateUnitSchema)}
      initialValues={initialValues}
      onValidSubmit={handleSubmit}
    >
      {({ form, renderSubmitButton }) => {
        return (
          <Stack>
            <TextInput
              label={t("sections.parameters.units.edit.labels.name")}
              {...form.getInputProps("name")}
              error={error}
            />
            {renderSubmitButton({
              text: t("buttons.save"),
              disableIfInvalid: true,
            })}
          </Stack>
        );
      }}
    </ValidatedForm>
  );
}
