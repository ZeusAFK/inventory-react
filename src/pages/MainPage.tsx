import { Container, Tabs } from "@mantine/core";
import { icons } from "../assets";
import { CompaniesSection } from "../components/Companies";
import { Company } from "../models/company";
import { Guid } from "../models/types";
import { DepartmentsSection } from "../components/Departments";

export type MainPageProps = {
  activeCompany: Company | null;
  onActivateCompany: (companyId: Guid) => Promise<void>;
};

export function MainPage({ activeCompany, onActivateCompany }: MainPageProps) {
  return (
    <Container size="xl" py="lg">
      <Tabs defaultValue="companies" variant="outline">
        <Tabs.List>
          <Tabs.Tab value="companies" leftSection={<icons.Company />}>
            Empresas
          </Tabs.Tab>
          <Tabs.Tab
            value="departments"
            leftSection={<icons.Department />}
            disabled={activeCompany === null}
          >
            Areas
          </Tabs.Tab>
          <Tabs.Tab value="items" leftSection={<icons.Item />}>
            Artículos
          </Tabs.Tab>
          <Tabs.Tab
            value="inventory"
            leftSection={<icons.Inventory />}
            disabled={activeCompany === null}
          >
            Inventario
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="companies" py="lg" px="sm">
          <CompaniesSection
            activeCompany={activeCompany}
            onActivateCompany={onActivateCompany}
          />
        </Tabs.Panel>

        <Tabs.Panel value="departments" py="md">
          <DepartmentsSection activeCompany={activeCompany!} />
        </Tabs.Panel>

        <Tabs.Panel value="items" py="md">
          Items tab content
        </Tabs.Panel>

        <Tabs.Panel value="inventory" py="md">
          Inventory tab content
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}
