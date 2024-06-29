import { useCallback, useState } from "react";
import { Button, Group, LoadingOverlay, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { icons } from "../../assets";
import { LocalStorageService } from "../../services/LocalStorageService";
import { FileImportInput } from "../FileImportInput";
import { useQueryClient } from "@tanstack/react-query";
import { modals } from "@mantine/modals";

export function ImportFileSelectionDialog() {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const acceptedFileTypes = [".json"];
  const maxFileSize = 2048 * 1024;

  const onFileSelected = useCallback((file: File) => {
    setSelectedFile(file);
  }, []);

  const onUploadClick = useCallback(() => {
    if (selectedFile === null) return;

    setLoading(true);

    LocalStorageService.importStorage(selectedFile)
      .then(() => {
        notifications.show({
          message: "Datos importados correctamente",
          color: "green",
          icon: <icons.Success />,
        });
        queryClient.invalidateQueries();
      })
      .catch((error) => {
        notifications.show({
          message: `Error al importar los datos: ${error.message}`,
          color: "red",
          icon: <icons.Error />,
        });
      })
      .finally(() => {
        setLoading(false);
        modals.closeAll();
      });
  }, [queryClient, selectedFile]);

  return (
    <Stack>
      <LoadingOverlay visible={loading} zIndex={1000} />
      <Group justify="center">
        <Text>Selecciona un archivo para importar los datos al sistema</Text>
      </Group>
      <FileImportInput
        onValidFileSelection={onFileSelected}
        allowedTypes={acceptedFileTypes}
        maxFileSize={maxFileSize}
      />
      <Group justify="flex-end" mt="md">
        <Button disabled={selectedFile === null} onClick={onUploadClick}>
          Importar datos
        </Button>
      </Group>
    </Stack>
  );
}
