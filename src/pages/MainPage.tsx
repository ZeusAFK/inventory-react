import { Container, Tabs } from "@mantine/core";
import { icons } from "../assets";
import { CompaniesSection } from "../components/Companies";

export function MainPage() {
  return (
    <Container size="xl" py="lg">
      <Tabs defaultValue="companies" variant="outline">
        <Tabs.List>
          <Tabs.Tab value="companies" leftSection={<icons.Company />}>
            Empresas
          </Tabs.Tab>
          <Tabs.Tab value="departments" leftSection={<icons.Department />}>
            Areas
          </Tabs.Tab>
          <Tabs.Tab value="items" leftSection={<icons.Item />}>
            Articulos
          </Tabs.Tab>
          <Tabs.Tab value="inventory" leftSection={<icons.Inventory />}>
            Inventario
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="companies" py="lg" px="sm">
          <CompaniesSection />
        </Tabs.Panel>

        <Tabs.Panel value="departments" py="md">
          Departments tab content
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
