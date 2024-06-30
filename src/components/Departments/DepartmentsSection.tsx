import { Alert, Group, LoadingOverlay, Stack, Title } from "@mantine/core";
import { Company } from "../../models/company";
import { icons } from "../../assets";
import { AddDepartment } from "./AddDepartment";
import { useCallback } from "react";
import { useCompanyDepartments } from "../../hooks/useCompanyDepartments";
import { DepartmentsList } from "./DepartmentsList";
import { Department } from "../../models/department";
import { Guid } from "../../models/types";
import { useActiveDepartment } from "../../hooks/useActiveDepartment";
import { useTranslation } from "react-i18next";

export type DepartmentsSectionProps = {
  activeCompany: Company;
  activeDepartment: Department | null;
  onActivateDepartment: (departmentId: Guid) => Promise<void>;
};

export function DepartmentsSection({
  activeCompany,
  activeDepartment,
  onActivateDepartment,
}: DepartmentsSectionProps) {
  const { t } = useTranslation();
  const departments = useCompanyDepartments(activeCompany.id);
  const activeDepartmentHook = useActiveDepartment();

  const fetchDepartments = useCallback(async () => {
    if (!departments.isLoading && !departments.error) {
      await departments.reload();
    }
  }, [departments]);

  const onDepartmentUpdated = useCallback(
    async (departmentId: Guid) => {
      if (activeDepartment !== null && activeDepartment.id === departmentId) {
        if (!activeDepartmentHook.isLoading && !activeDepartmentHook.error) {
          activeDepartmentHook.reload();
        }
      }

      await fetchDepartments();
    },
    [activeDepartment, activeDepartmentHook, fetchDepartments]
  );

  if (departments.isLoading) {
    return <LoadingOverlay />;
  }

  if (departments.error) {
    return (
      <Alert variant="light" color="red" title="Error" icon={<icons.Warning />}>
        {departments.error.message}
      </Alert>
    );
  }

  return (
    <Stack>
      <Group justify="space-between">
        <Group>
          <icons.Department size={20} />
          <Title order={3}>
            {t("sections.departments.title", { company: activeCompany.name })}
          </Title>
        </Group>
        <AddDepartment
          activeCompany={activeCompany}
          onDepartmentAdded={fetchDepartments}
        />
      </Group>
      <DepartmentsList
        activeDepartment={activeDepartment}
        departments={departments.departments}
        onDepartmentDeleted={fetchDepartments}
        onDepartmentUpdated={onDepartmentUpdated}
        onActivateDepartment={onActivateDepartment}
      />
    </Stack>
  );
}
