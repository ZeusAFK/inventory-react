import { DataTable, DataTableColumn } from "mantine-datatable";
import { Company } from "../../models/company";
import { ActionIcon, Chip, Group, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { icons } from "../../assets";
import { useCallback, useState } from "react";
import { Guid } from "../../models/types";
import { DeleteCompany } from "../../services/CompaniesService";
import { EditCompany } from "./EditCompany";
import { useTranslation } from "react-i18next";

export type CompaniesListProps = {
  activeCompany: Company | null;
  companies: Company[];
  onCompanyDeleted: () => Promise<void>;
  onCompanyUpdated: (companyId: Guid) => Promise<void>;
  onActivateCompany: (companyId: Guid) => Promise<void>;
};

export function CompaniesList({
  activeCompany,
  companies,
  onCompanyDeleted,
  onCompanyUpdated,
  onActivateCompany,
}: CompaniesListProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleCompanyUpdate = useCallback(
    (company: Company) => {
      modals.open({
        title: t("sections.company.edit.title", { company: company.name }),
        children: (
          <EditCompany company={company} onCompanyUpdated={onCompanyUpdated} />
        ),
        size: "md",
        closeOnClickOutside: false,
      });
    },
    [onCompanyUpdated, t]
  );

  const handleCompanyDelete = useCallback(
    (companyId: Guid) => {
      modals.openConfirmModal({
        title: t("sections.company.delete.title"),
        children: <Text size="sm">{t("sections.company.delete.warning")}</Text>,
        labels: {
          confirm: t("sections.company.buttons.deleteCompany"),
          cancel: t("buttons.cancel"),
        },
        confirmProps: { color: "red" },
        closeOnClickOutside: false,
        onConfirm: () => {
          setLoading(true);
          DeleteCompany(companyId)
            .then(async () => await onCompanyDeleted())
            .catch((err) => {
              notifications.show({
                color: "red",
                message: err.message || "Failed to create company",
                icon: <icons.Error />,
              });
            })
            .finally(() => {
              setLoading(false);
            });
        },
      });
    },
    [onCompanyDeleted, t]
  );

  const columns = [
    { accessor: "name", title: t("sections.company.headers.name") },
    {
      accessor: "activeCompany",
      title: t("sections.company.headers.active"),
      textAlign: "center",
      width: 150,
      render: (company) => {
        if (activeCompany !== null && activeCompany.id === company.id) {
          return (
            <Chip checked={true} color="green" variant="outline">
              {t("sections.company.actions.active")}
            </Chip>
          );
        }

        return (
          <Chip
            checked={false}
            color="blue"
            onClick={() => onActivateCompany(company.id)}
          >
            {t("sections.company.actions.activate")}
          </Chip>
        );
      },
    },
    {
      accessor: "actions",
      title: t("sections.company.headers.actions"),
      textAlign: "center",
      width: 100,
      render: (company) => (
        <Group gap={5} justify="space-evenly" wrap="nowrap">
          <ActionIcon
            size="sm"
            variant="subtle"
            color="blue"
            disabled={loading}
            onClick={() => handleCompanyUpdate(company)}
          >
            <icons.Edit />
          </ActionIcon>
          <ActionIcon
            size="sm"
            variant="subtle"
            color="red"
            disabled={loading}
            onClick={() => handleCompanyDelete(company.id)}
          >
            <icons.Delete />
          </ActionIcon>
        </Group>
      ),
    },
  ] satisfies DataTableColumn<Company>[];

  return (
    <DataTable<Company>
      idAccessor="id"
      columns={columns}
      records={companies}
      withTableBorder
      withColumnBorders
      striped
      highlightOnHover
    />
  );
}
