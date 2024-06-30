import { Alert, Group, LoadingOverlay, Stack, Title } from "@mantine/core";
import { AddCompany } from "./AddCompany";
import { CompaniesList } from "./CompaniesList";
import { icons } from "../../assets";
import { useCallback } from "react";
import { useCompanies } from "../../hooks/useCompanies";
import { Company } from "../../models/company";
import { Guid } from "../../models/types";
import { useActiveCompany } from "../../hooks/useActiveCompany";
import { useTranslation } from "react-i18next";

export type CompaniesSectionProps = {
  activeCompany: Company | null;
  onActivateCompany: (companyId: Guid) => Promise<void>;
};

export function CompaniesSection({
  activeCompany,
  onActivateCompany,
}: CompaniesSectionProps) {
  const { t } = useTranslation();
  const companies = useCompanies();
  const activeCompanyHook = useActiveCompany();

  const fetchCompanies = useCallback(async () => {
    if (!companies.isLoading && !companies.error) {
      await companies.reload();
    }
  }, [companies]);

  const onCompanyUpdated = useCallback(
    async (companyId: Guid) => {
      if (activeCompany !== null && activeCompany.id === companyId) {
        if (!activeCompanyHook.isLoading && !activeCompanyHook.error) {
          activeCompanyHook.reload();
        }
      }

      await fetchCompanies();
    },
    [activeCompany, activeCompanyHook, fetchCompanies]
  );

  if (companies.isLoading) {
    return <LoadingOverlay />;
  }

  if (companies.error) {
    return (
      <Alert variant="light" color="red" title="Error" icon={<icons.Warning />}>
        {companies.error.message}
      </Alert>
    );
  }

  return (
    <Stack>
      <Group justify="space-between">
        <Group>
          <icons.Company size={20} />
          <Title order={3}>{t("sections.company.title")}</Title>
        </Group>
        <AddCompany onCompanyAdded={fetchCompanies} />
      </Group>
      <CompaniesList
        activeCompany={activeCompany}
        companies={companies.companies}
        onCompanyDeleted={fetchCompanies}
        onCompanyUpdated={onCompanyUpdated}
        onActivateCompany={onActivateCompany}
      />
    </Stack>
  );
}
