import {
  ActionIcon,
  AppShell,
  Group,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import "./App.css";
import { MainPage } from "./pages";
import "./i18n/config";
import { icons } from "./assets";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";

function App() {
  const { t } = useTranslation();
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  const switchColorScheme = useCallback(() => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  }, [colorScheme, setColorScheme]);

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Group m={15} justify="space-between">
          <Group>
            <icons.Logo size={30} />
            <Title order={3}>{t("title")}</Title>
          </Group>
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
      </AppShell.Header>

      <AppShell.Main>
        <MainPage />
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
