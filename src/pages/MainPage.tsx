import { Container, Tabs } from "@mantine/core";
import { icons } from "../assets";
import { CompaniesSection } from "../components/Companies";
import { Company } from "../models/company";
import { Guid } from "../models/types";
import { DepartmentsSection } from "../components/Departments";
import { Department } from "../models/department";
import { useTranslation } from "react-i18next";
import { ParametersSection } from "../components/Parameters";
import { ItemsSection } from "../components/Items";

export type MainPageProps = {
  activeCompany: Company | null;
  activeDepartment: Department | null;
  onActivateCompany: (companyId: Guid) => Promise<void>;
  onActivateDepartment: (departmentId: Guid) => Promise<void>;
};

export function MainPage({
  activeCompany,
  activeDepartment,
  onActivateCompany,
  onActivateDepartment,
}: MainPageProps) {
  const { t } = useTranslation();
  return (
    <Container size="xl" py="lg">
      <Tabs defaultValue="companies" variant="outline">
        <Tabs.List>
          <Tabs.Tab value="companies" leftSection={<icons.Company />}>
            {t("tabs.companies")}
          </Tabs.Tab>
          <Tabs.Tab
            value="departments"
            leftSection={<icons.Department />}
            disabled={activeCompany === null}
          >
            {t("tabs.departments")}
          </Tabs.Tab>
          <Tabs.Tab value="items" leftSection={<icons.Item />}>
            {t("tabs.items")}
          </Tabs.Tab>
          <Tabs.Tab
            value="inventory"
            leftSection={<icons.Inventory />}
            disabled={activeCompany === null || activeDepartment === null}
          >
            {t("tabs.inventory")}
          </Tabs.Tab>
          <Tabs.Tab value="parameters" leftSection={<icons.Config />}>
            {t("tabs.config")}
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="companies" py="lg" px="sm">
          <CompaniesSection
            activeCompany={activeCompany}
            onActivateCompany={onActivateCompany}
          />
        </Tabs.Panel>

        <Tabs.Panel value="departments" py="lg" px="sm">
          {activeCompany !== null ? (
            <DepartmentsSection
              activeCompany={activeCompany}
              activeDepartment={activeDepartment}
              onActivateDepartment={onActivateDepartment}
            />
          ) : (
            <></>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="items" py="lg" px="sm">
          <ItemsSection />
        </Tabs.Panel>

        <Tabs.Panel value="inventory" py="lg" px="sm">
          Inventory tab content
        </Tabs.Panel>

        <Tabs.Panel value="parameters" py="lg" px="sm">
          <ParametersSection />
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}
