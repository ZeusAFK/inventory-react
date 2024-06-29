import { Button, Group } from "@mantine/core";
import { icons } from "../../assets";
import {
  LocalStorageService,
  StorageKey,
} from "../../services/LocalStorageService";
import { modals } from "@mantine/modals";
import { ImportFileSelectionDialog } from "./ImportFileSelectionDialog";

export function ExportImportSection() {
  const handleExport = () => {
    const exportKeys: StorageKey[] = [
      "companies",
      "departments",
      "inventory",
      "items",
      "activeCompany",
      "activeDepartment",
    ];
    const file = LocalStorageService.exportStorage(exportKeys);

    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = () => {
    modals.open({
      title: "Importar datos",
      children: <ImportFileSelectionDialog />,
      closeOnClickOutside: false,
    });
  };

  return (
    <Group>
      <Button
        size="xs"
        color="green"
        leftSection={<icons.Export />}
        onClick={handleExport}
      >
        Exportar
      </Button>
      <Button
        size="xs"
        color="blue"
        leftSection={<icons.Import />}
        onClick={handleImport}
      >
        Importar
      </Button>
    </Group>
  );
}
