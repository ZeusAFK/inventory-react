import { DataTable, DataTableColumn } from "mantine-datatable";
import { ActionIcon, Chip, Group, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { icons } from "../../assets";
import { useCallback, useState } from "react";
import { Guid } from "../../models/types";
import { Department } from "../../models/department";
import { DeleteDepartment } from "../../services/DepartmentsService";
import { EditDepartment } from "./EditDepartment";
import { useTranslation } from "react-i18next";

export type DepartmentsListProps = {
  activeDepartment: Department | null;
  departments: Department[];
  onDepartmentDeleted: () => Promise<void>;
  onDepartmentUpdated: (departmentId: Guid) => Promise<void>;
  onActivateDepartment: (departmentId: Guid) => Promise<void>;
};

export function DepartmentsList({
  activeDepartment,
  departments,
  onActivateDepartment,
  onDepartmentDeleted,
  onDepartmentUpdated,
}: DepartmentsListProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleDepartmentUpdate = useCallback(
    (department: Department) => {
      modals.open({
        title: t("sections.departments.edit.title", {
          department: department.name,
        }),
        children: (
          <EditDepartment
            department={department}
            onDepartmentUpdated={onDepartmentUpdated}
          />
        ),
        size: "md",
        closeOnClickOutside: false,
      });
    },
    [onDepartmentUpdated, t]
  );

  const handleDepartmentDelete = useCallback(
    (departmentId: Guid) => {
      modals.openConfirmModal({
        title: t("sections.departments.delete.title"),
        children: (
          <Text size="sm">{t("sections.departments.delete.warning")}</Text>
        ),
        labels: {
          confirm: t("sections.departments.buttons.deleteDepartment"),
          cancel: t("buttons.cancel"),
        },
        confirmProps: { color: "red" },
        onConfirm: () => {
          setLoading(true);
          DeleteDepartment(departmentId)
            .then(async () => await onDepartmentDeleted())
            .catch((err) => {
              notifications.show({
                color: "red",
                message: err.message || "Failed to create department",
                icon: <icons.Error />,
              });
            })
            .finally(() => {
              setLoading(false);
            });
        },
      });
    },
    [onDepartmentDeleted, t]
  );

  const columns = [
    { accessor: "name", title: t("sections.departments.headers.name") },
    {
      accessor: "activeDepartment",
      title: t("sections.departments.headers.active"),
      textAlign: "center",
      width: 150,
      render: (department) => {
        if (
          activeDepartment !== null &&
          activeDepartment.id === department.id
        ) {
          return (
            <Chip checked={true} color="green" variant="outline">
              {t("sections.departments.actions.active")}
            </Chip>
          );
        }

        return (
          <Chip
            checked={false}
            color="blue"
            onClick={() => onActivateDepartment(department.id)}
          >
            {t("sections.departments.actions.activate")}
          </Chip>
        );
      },
    },
    {
      accessor: "actions",
      title: t("sections.departments.headers.actions"),
      textAlign: "center",
      width: 100,
      render: (department) => (
        <Group gap={5} justify="space-evenly" wrap="nowrap">
          <ActionIcon
            size="sm"
            variant="subtle"
            color="blue"
            disabled={loading}
            onClick={() => handleDepartmentUpdate(department)}
          >
            <icons.Edit />
          </ActionIcon>
          <ActionIcon
            size="sm"
            variant="subtle"
            color="red"
            disabled={loading}
            onClick={() => handleDepartmentDelete(department.id)}
          >
            <icons.Delete />
          </ActionIcon>
        </Group>
      ),
    },
  ] satisfies DataTableColumn<Department>[];

  return (
    <DataTable<Department>
      idAccessor="id"
      columns={columns}
      records={departments}
      withTableBorder
      withColumnBorders
      striped
      highlightOnHover
    />
  );
}
