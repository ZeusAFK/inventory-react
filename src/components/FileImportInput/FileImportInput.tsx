import { useCallback, useMemo } from "react";
import { FileInput } from "@mantine/core";
import { icons } from "../../assets";

export type FileImportInputProps = {
  onValidFileSelection: (payload: File) => void;
  allowedTypes?: string[];
  maxFileSize?: number;
};

export function FileImportInput({
  onValidFileSelection,
  allowedTypes = ["*"],
  maxFileSize = 2048 * 1024,
}: FileImportInputProps) {
  const allowedTypesString = useMemo(
    () => allowedTypes.join(","),
    [allowedTypes]
  );

  const onFileChosen = useCallback(
    (file: File | null) => {
      if (!file) return;

      const fileExtension = file.name
        .slice(file.name.lastIndexOf("."))
        .toLowerCase();
      const isValidType = allowedTypes.some(
        (type) => type.toLowerCase() === fileExtension || type === "*"
      );

      if (!isValidType || file.size > maxFileSize) {
        return;
      }

      onValidFileSelection(file);
    },
    [allowedTypes, maxFileSize, onValidFileSelection]
  );

  return (
    <FileInput
      placeholder="Selecciona un archivo"
      label="Archivo"
      rightSection={<icons.File />}
      accept={allowedTypesString}
      onChange={onFileChosen}
    />
  );
}
