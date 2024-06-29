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
  const [loading, setLoading] = useState(false);

  const handleDepartmentUpdate = useCallback(
    (department: Department) => {
      modals.open({
        title: `Editar ${department.name}`,
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
    [onDepartmentUpdated]
  );

  const handleDepartmentDelete = useCallback(
    (departmentId: Guid) => {
      modals.openConfirmModal({
        title: "Eliminar area",
        children: (
          <Text size="sm">
            Estas seguro que deseas eliminar esta area? Esto también eliminara
            todos los datos asociados a la misma.
          </Text>
        ),
        labels: { confirm: "Eliminar area", cancel: "Cancelar" },
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
    [onDepartmentDeleted]
  );

  const columns = [
    { accessor: "name", title: "Nombre" },
    {
      accessor: "activeDepartment",
      title: "Empresa activa",
      textAlign: "center",
      width: 150,
      render: (department) => {
        if (
          activeDepartment !== null &&
          activeDepartment.id === department.id
        ) {
          return (
            <Chip checked={true} color="green" variant="outline">
              Activa
            </Chip>
          );
        }

        return (
          <Chip
            checked={false}
            color="blue"
            onClick={() => onActivateDepartment(department.id)}
          >
            Activar
          </Chip>
        );
      },
    },
    {
      accessor: "actions",
      title: "Acciones",
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
