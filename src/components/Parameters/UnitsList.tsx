import { DataTable, DataTableColumn } from "mantine-datatable";
import { Unit } from "../../models/units";
import { useTranslation } from "react-i18next";
import { ActionIcon, Group, Text } from "@mantine/core";
import { icons } from "../../assets";
import { useCallback, useState } from "react";
import { Guid } from "../../models/types";
import { modals } from "@mantine/modals";
import { DeleteUnit } from "../../services/UnitsService";
import { notifications } from "@mantine/notifications";
import { EditUnit } from "./EditUnit";

export type UnitsListProps = {
  units: Unit[];
  onUnitUpdated: () => Promise<void>;
  onUnitDeleted: () => Promise<void>;
};

export function UnitsList({
  units,
  onUnitUpdated,
  onUnitDeleted,
}: UnitsListProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleUnitUpdate = useCallback(
    (unit: Unit) => {
      modals.open({
        title: t("sections.parameters.units.edit.title", { unit: unit.name }),
        children: <EditUnit unit={unit} onUnitUpdated={onUnitUpdated} />,
        size: "md",
        closeOnClickOutside: false,
      });
    },
    [onUnitUpdated, t]
  );

  const handleUnitDelete = useCallback(
    (companyId: Guid) => {
      modals.openConfirmModal({
        title: t("sections.parameters.units.delete.title"),
        children: (
          <Text size="sm">{t("sections.parameters.units.delete.warning")}</Text>
        ),
        labels: {
          confirm: t("sections.parameters.units.buttons.deleteUnit"),
          cancel: t("buttons.cancel"),
        },
        confirmProps: { color: "red" },
        closeOnClickOutside: false,
        onConfirm: () => {
          setLoading(true);
          DeleteUnit(companyId)
            .then(async () => await onUnitDeleted())
            .catch((err) => {
              notifications.show({
                color: "red",
                message: err.message || "Failed to delete unit",
                icon: <icons.Error />,
              });
            })
            .finally(() => {
              setLoading(false);
            });
        },
      });
    },
    [onUnitDeleted, t]
  );

  const columns = [
    {
      accessor: "name",
      title: t("sections.parameters.units.headers.name"),
    },
    {
      accessor: "actions",
      title: t("sections.parameters.units.headers.actions"),
      textAlign: "center",
      width: 100,
      render: (unit) => (
        <Group gap={5} justify="space-evenly" wrap="nowrap">
          <ActionIcon
            size="sm"
            variant="subtle"
            color="blue"
            disabled={loading}
            onClick={() => handleUnitUpdate(unit)}
          >
            <icons.Edit />
          </ActionIcon>
          <ActionIcon
            size="sm"
            variant="subtle"
            color="red"
            disabled={loading}
            onClick={() => handleUnitDelete(unit.id)}
          >
            <icons.Delete />
          </ActionIcon>
        </Group>
      ),
    },
  ] satisfies DataTableColumn<Unit>[];

  return (
    <DataTable<Unit>
      idAccessor="id"
      columns={columns}
      records={units}
      withTableBorder
      withColumnBorders
      striped
      highlightOnHover
    />
  );
}
