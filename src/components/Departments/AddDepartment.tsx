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

export type AddDepartmentProps = {
  activeCompany: Company;
  onDepartmentAdded: () => Promise<void>;
};

export function AddDepartment({
  activeCompany,
  onDepartmentAdded,
}: AddDepartmentProps) {
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
        setError((err as Error).message || "Failed to create department");
      }
    },
    [onDepartmentAdded]
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
            placeholder="Nombre del area"
            {...form.getInputProps("name")}
            error={error}
          />
          {renderSubmitButton({
            text: "Crear area",
            disableIfInvalid: true,
            rightSection: <icons.Add />,
            color: "green",
          })}
        </Group>
      )}
    </ValidatedForm>
  );
}
