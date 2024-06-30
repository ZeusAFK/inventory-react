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
import { useTranslation } from "react-i18next";

export type AddCompanyProps = {
  onCompanyAdded: () => Promise<void>;
};

export function AddCompany({ onCompanyAdded }: AddCompanyProps) {
  const { t } = useTranslation();
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
        setError(t((err as Error).message || "Failed to create company"));
      }
    },
    [onCompanyAdded, t]
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
            placeholder={t("sections.company.placeholders.companyName")}
            {...form.getInputProps("name")}
            error={error}
          />
          {renderSubmitButton({
            text: t("sections.company.buttons.createCompany"),
            disableIfInvalid: true,
            rightSection: <icons.Add />,
            color: "green",
          })}
        </Group>
      )}
    </ValidatedForm>
  );
}
