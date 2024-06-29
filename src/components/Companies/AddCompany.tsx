import { Group, TextInput } from "@mantine/core";
import {
  CreateCompanyRequest,
  CreateCompanySchema,
} from "../../models/company";
import { ValidatedForm } from "../ValidatedForm";
import { zodResolver } from "@mantine/form";
import { useCallback, useState } from "react";
import { CreateCompany } from "../../services/CompaniesService";
import { icons } from "../../assets";

export type AddCompanyProps = {
  onCompanyAdded: () => Promise<void>;
};

export function AddCompany({ onCompanyAdded }: AddCompanyProps) {
  const [error, setError] = useState<string | null>(null);

  const initialValues: CreateCompanyRequest = {
    name: "",
  };

  const handleSubmit = useCallback(
    async (request: CreateCompanyRequest) => {
      setError(null);
      try {
        await CreateCompany(request);
        await onCompanyAdded();
      } catch (err) {
        setError((err as Error).message || "Failed to create company");
      }
    },
    [onCompanyAdded]
  );

  return (
    <ValidatedForm<CreateCompanyRequest>
      name="create-company-form"
      validate={zodResolver(CreateCompanySchema)}
      initialValues={initialValues}
      onValidSubmit={handleSubmit}
    >
      {({ form, renderSubmitButton }) => (
        <Group align="flex-start">
          <TextInput
            placeholder="Nombre de la empresa"
            {...form.getInputProps("name")}
            error={error}
          />
          {renderSubmitButton({
            text: "Crear empresa",
            disableIfInvalid: true,
            rightSection: <icons.Add />,
            color: "green",
          })}
        </Group>
      )}
    </ValidatedForm>
  );
}
