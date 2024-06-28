import { Button, Group, TextInput } from "@mantine/core";
import { icons } from "../../assets";
import { useCallback, useState } from "react";
import { CreateCompany } from "../../services/CompaniesService";

export type AddCompanyProps = {
  onCompanyAdded: () => void;
}

export function AddCompany({ onCompanyAdded }: AddCompanyProps) {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateCompany = useCallback(() => {
    setLoading(true);
    setError(null);
    CreateCompany({ name: value })
      .then(() => {
        setValue('');
        onCompanyAdded();
      })
      .catch((err) => {
        setError(err.message || 'Failed to create company');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [value, onCompanyAdded]);

  return (
    <Group align="flex-start">
      <TextInput
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
        placeholder="Nombre de la empresa"
        error={error}
      />
      <Button
        rightSection={<icons.Add />}
        onClick={handleCreateCompany}
        disabled={!value || loading}
      >
        {loading ? 'Creando...' : 'Crear empresa'}
      </Button>
    </Group>
  );
}
