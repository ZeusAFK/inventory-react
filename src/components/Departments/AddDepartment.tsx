import { Group, TextInput } from "@mantine/core";
import {
  CreateDepartmentRequest,
  CreateDepartmentSchema,
} from "../../models/department";
import { ValidatedForm } from "../ValidatedForm";
import { zodResolver } from "@mantine/form";
import { useCallback, useState } from "react";
import { CreateDepartment } from "../../services/DepartmentsService";
import { icons } from "../../assets";
import { Company } from "../../models/company";
import { useTranslation } from "react-i18next";

export type AddDepartmentProps = {
  activeCompany: Company;
  onDepartmentAdded: () => Promise<void>;
};

export function AddDepartment({
  activeCompany,
  onDepartmentAdded,
}: AddDepartmentProps) {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  const initialValues: CreateDepartmentRequest = {
    companyId: activeCompany.id,
    name: "",
  };

  const handleSubmit = useCallback(
    async (request: CreateDepartmentRequest) => {
      setError(null);
      try {
        await CreateDepartment(request);
        await onDepartmentAdded();
      } catch (err) {
        setError(t((err as Error).message || "Failed to create department"));
      }
    },
    [onDepartmentAdded, t]
  );

  return (
    <ValidatedForm<CreateDepartmentRequest>
      name="create-department-form"
      validate={zodResolver(CreateDepartmentSchema)}
      initialValues={initialValues}
      onValidSubmit={handleSubmit}
    >
      {({ form, renderSubmitButton }) => (
        <Group align="flex-start">
          <TextInput
            placeholder={t("sections.departments.placeholders.departmentName")}
            {...form.getInputProps("name")}
            error={error}
          />
          {renderSubmitButton({
            text: t("sections.departments.buttons.createDepartment"),
            disableIfInvalid: true,
            rightSection: <icons.Add />,
            color: "green",
          })}
        </Group>
      )}
    </ValidatedForm>
  );
}
