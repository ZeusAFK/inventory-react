import {
  ActionIcon,
  Alert,
  AppShell,
  Badge,
  Group,
  LoadingOverlay,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import "./App.css";
import { MainPage } from "./pages";
import "./i18n/config";
import { icons } from "./assets";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import { useActiveCompany } from "./hooks/useActiveCompany";
import { Guid } from "./models/types";
import { SetActiveCompany } from "./services/CompaniesService";
import { ExportImportSection } from "./components/ExportImport/ExportImportSection";
import { useActiveDepartment } from "./hooks/useActiveDepartment";
import { SetActiveDepartment } from "./services/DepartmentsService";
import { LanguageSwitcher } from "./components/LanguageSwitcher";

function App() {
  const activeCompany = useActiveCompany();
  const activeDepartment = useActiveDepartment();
  const { t } = useTranslation();
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  const switchColorScheme = useCallback(() => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  }, [colorScheme, setColorScheme]);

  const handleActivateDepartment = useCallback(
    async (departmentId: Guid) => {
      await SetActiveDepartment(departmentId);
      if (!activeDepartment.isLoading && !activeDepartment.error) {
        activeDepartment.reload();
      }
    },
    [activeDepartment]
  );

  const handleActivateCompany = useCallback(
    async (companyId: Guid) => {
      await SetActiveCompany(companyId);
      if (!activeCompany.isLoading && !activeCompany.error) {
        activeCompany.reload();
      }
      await handleActivateDepartment("");
    },
    [activeCompany, handleActivateDepartment]
  );

  if (activeCompany.isLoading || activeDepartment.isLoading) {
    return <LoadingOverlay />;
  }

  if (activeCompany.error || activeDepartment.error) {
    return (
      <Alert color="red">
        <Text>
          {activeCompany?.error?.message ?? activeDepartment?.error?.message}
        </Text>
      </Alert>
    );
  }

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Group m={15} justify="space-between">
          <Group>
            <icons.Logo size={30} />
            <Title order={3}>{t("title")}</Title>
            {activeCompany.company !== null && (
              <Badge variant="dot" color="green" size="xl">
                {activeCompany.company.name}
              </Badge>
            )}
            {activeDepartment.department !== null && (
              <Badge variant="dot" color="green" size="xl">
                {activeDepartment.department.name}
              </Badge>
            )}
          </Group>
          <Group>
            <ExportImportSection />
            <LanguageSwitcher />
            <ActionIcon
              onClick={switchColorScheme}
              variant="transparent"
              size="sm"
            >
              {colorScheme === "dark" ? (
                <icons.ThemeLight />
              ) : (
                <icons.ThemeDark />
              )}
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <MainPage
          activeCompany={activeCompany.company}
          activeDepartment={activeDepartment.department}
          onActivateCompany={handleActivateCompany}
          onActivateDepartment={handleActivateDepartment}
        />
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
