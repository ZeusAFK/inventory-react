import { Alert, Group, LoadingOverlay, Stack, Title } from "@mantine/core";
import { AddCompany } from "./AddCompany";
import { CompaniesList } from "./CompaniesList";
import { icons } from "../../assets";
import { useCallback } from "react";
import { useCompanies } from "../../hooks/useCompanies";

export function CompaniesSection() {
  const companies = useCompanies();

  const fetchCompanies = useCallback(async () => {
    if (!companies.isLoading && !companies.error) {
      await companies.reload();
    }
  }, [companies]);

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
          <Title order={3}>Administrar empresas</Title>
        </Group>
        <AddCompany onCompanyAdded={fetchCompanies} />
      </Group>
      <CompaniesList
        companies={companies.companies}
        onCompanyDeleted={fetchCompanies}
        onCompanyUpdated={fetchCompanies}
      />
    </Stack>
  );
}
