import { Button, Group } from "@mantine/core";
import { icons } from "../../assets";
import {
  LocalStorageService,
  StorageKey,
} from "../../services/LocalStorageService";
import { modals } from "@mantine/modals";
import { ImportFileSelectionDialog } from "./ImportFileSelectionDialog";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export function ExportImportSection() {
  const { t } = useTranslation();
  const handleExport = useCallback(async () => {
    const exportKeys: StorageKey[] = [
      "companies",
      "departments",
      "inventory",
      "items",
      "activeCompany",
      "activeDepartment",
      "language",
    ];
    const file = await LocalStorageService.exportStorage(exportKeys);

    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const handleImport = useCallback(() => {
    modals.open({
      title: "Importar datos",
      children: <ImportFileSelectionDialog />,
      closeOnClickOutside: false,
    });
  }, []);

  return (
    <Group>
      <Button
        size="xs"
        color="green"
        leftSection={<icons.Export />}
        onClick={handleExport}
      >
        {t("buttons.import")}
      </Button>
      <Button
        size="xs"
        color="blue"
        leftSection={<icons.Import />}
        onClick={handleImport}
      >
        {t("buttons.export")}
      </Button>
    </Group>
  );
}
