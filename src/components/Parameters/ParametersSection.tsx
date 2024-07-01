import { Alert, Group, LoadingOverlay, Stack, Title } from "@mantine/core";
import { useUnits } from "../../hooks/useUnits";
import { icons } from "../../assets";
import { UnitsList } from "./UnitsList";
import { useTranslation } from "react-i18next";
import { AddUnit } from "./AddUnit";
import { useCallback } from "react";

export function ParametersSection() {
  const { t } = useTranslation();
  const units = useUnits();

  const fetchUnits = useCallback(async () => {
    if (!units.isLoading && !units.error) {
      await units.reload();
    }
  }, [units]);

  if (units.isLoading) {
    return <LoadingOverlay />;
  }

  if (units.error) {
    return (
      <Alert variant="light" color="red" title="Error" icon={<icons.Warning />}>
        {units.error.message}
      </Alert>
    );
  }

  return (
    <Stack>
      <Group>
        <Stack>
          <Title order={4}>{t("sections.parameters.units.title")}</Title>
          <AddUnit onUnitAdded={fetchUnits} />
          <UnitsList
            units={units.units}
            onUnitUpdated={fetchUnits}
            onUnitDeleted={fetchUnits}
          />
        </Stack>
      </Group>
    </Stack>
  );
}
