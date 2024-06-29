import { Text } from "@mantine/core";
import type { FormErrors } from "@mantine/form";
import { ErrorMessages } from "../../models/validation";

export interface FormErrorProps {
  errors?: FormErrors | ErrorMessages;
}

export function FormError({ errors }: FormErrorProps) {
  if (!errors) {
    return null;
  }

  if (Array.isArray(errors)) {
    return (
      <>
        {errors.map((error, index) => (
          <Text key={index} c="red" size="sm">
            {error}
          </Text>
        ))}
      </>
    );
  }

  if (typeof errors === "object") {
    return Object.entries(errors).map(([key, error], index) => (
      <Text key={index} c="red" size="sm">
        {key}: {error}
      </Text>
    ));
  }

  return (
    <Text c="red" size="sm">
      {errors}
    </Text>
  );
}
