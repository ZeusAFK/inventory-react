import { useCallback, useState } from "react";
import {
  Department,
  UpdateDepartmentRequest,
  UpdateDepartmentSchema,
} from "../../models/department";
import { Guid } from "../../models/types";
import { UpdateDepartment } from "../../services/DepartmentsService";
import { modals } from "@mantine/modals";
import { ValidatedForm } from "../ValidatedForm";
import { zodResolver } from "@mantine/form";
import { Stack, TextInput } from "@mantine/core";
import { useTranslation } from "react-i18next";

export type EditDepartmentProps = {
  department: Department;
  onDepartmentUpdated: (departmentId: Guid) => Promise<void>;
};

export function EditDepartment({
  department,
  onDepartmentUpdated,
}: EditDepartmentProps) {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  const initialValues = {
    id: department.id,
    companyId: department.companyId,
    name: department.name,
  } satisfies UpdateDepartmentRequest;

  const handleSubmit = useCallback(
    async (request: UpdateDepartmentRequest) => {
      setError(null);
      try {
        await UpdateDepartment(request);
        await onDepartmentUpdated(request.id);
        modals.closeAll();
      } catch (err: unknown) {
        setError((err as Error).message || "Failed to update department");
      }
    },
    [onDepartmentUpdated]
  );

  return (
    <ValidatedForm<UpdateDepartmentRequest>
      name="update-department-form"
      validate={zodResolver(UpdateDepartmentSchema)}
      initialValues={initialValues}
      onValidSubmit={handleSubmit}
    >
      {({ form, renderSubmitButton }) => {
        return (
          <Stack>
            <TextInput
              label={t("sections.departments.edit.labels.name")}
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
