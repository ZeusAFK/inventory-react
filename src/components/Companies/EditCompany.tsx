import { Stack, TextInput } from "@mantine/core";
import {
  Company,
  UpdateCompanyRequest,
  UpdateCompanySchema,
} from "../../models/company";
import { ValidatedForm } from "../ValidatedForm";
import { zodResolver } from "@mantine/form";
import { useCallback, useState } from "react";
import { UpdateCompany } from "../../services/CompaniesService";
import { modals } from "@mantine/modals";
import { Guid } from "../../models/types";

export type EditCompanyProps = {
  company: Company;
  onCompanyUpdated: (companyId: Guid) => Promise<void>;
};

export function EditCompany({ company, onCompanyUpdated }: EditCompanyProps) {
  const [error, setError] = useState<string | null>(null);

  const initialValues = {
    id: company.id,
    name: company.name,
  } satisfies UpdateCompanyRequest;

  const handleSubmit = useCallback(
    async (request: UpdateCompanyRequest) => {
      setError(null);
      try {
        await UpdateCompany(request);
        await onCompanyUpdated(request.id);
        modals.closeAll();
      } catch (err: unknown) {
        setError((err as Error).message || "Failed to update company");
      }
    },
    [onCompanyUpdated]
  );

  return (
    <ValidatedForm<UpdateCompanyRequest>
      name="update-company-form"
      validate={zodResolver(UpdateCompanySchema)}
      initialValues={initialValues}
      onValidSubmit={handleSubmit}
    >
      {({ form, renderSubmitButton }) => {
        return (
          <Stack>
            <TextInput
              label="Nombre"
              {...form.getInputProps("name")}
              error={error}
            />
            {renderSubmitButton({
              text: "Guardar",
              disableIfInvalid: true,
            })}
          </Stack>
        );
      }}
    </ValidatedForm>
  );
}
