import { Alert, Group, LoadingOverlay, Stack, Title } from "@mantine/core"
import { AddCompany } from "./AddCompany"
import { CompaniesList } from "./CompaniesList"
import { icons } from "../../assets";
import { useCallback } from "react";
import { useCompanies } from "../../hooks/useCompanies";

export type CompaniesSectionProps = {}

export function CompaniesSection({ }: CompaniesSectionProps) {
  const companies = useCompanies();

  const onCompanyAdded = useCallback(() => {
    companies.refetch();
  }, []);

  const onCompanyDeleted = useCallback(() => {
    companies.refetch();
  }, []);

  if (companies.isLoading) {
    return <LoadingOverlay />
  }

  if (companies.error) {
    return <Alert variant='light' color='red' title='Error' icon={<icons.Warning />}>
      {companies.error.message}
    </Alert>
  }

  return <Stack>
    <Group justify="space-between">
      <Group>
        <icons.Company size={20} />
        <Title order={3}>Administrar empresas</Title>
      </Group>
      <AddCompany onCompanyAdded={onCompanyAdded} />
    </Group>
    <CompaniesList companies={companies.companies} onCompanyDeleted={onCompanyDeleted} />
  </Stack>
}