import { useState } from "react";
import { Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import type { UseFormInput, UseFormReturnType } from "@mantine/form";
import type { ReactElement } from "react";

import { FormErrors } from "../../models/validation";
import { UnknownObject } from "../../models/global";
import { useTranslation } from "react-i18next";
import { FormError } from "./FormError";
import { SubmitButton, SubmitButtonProps } from "./SubmitButton";

export type ValidatedFormProps<T extends UnknownObject> = UseFormInput<T> & {
  /** A unique name for the form */
  name: string;
  onValidSubmit: (data: T) => Promise<void>;
  fallbackErrorMessage?: string;
  children: (props: {
    isSubmitting: boolean;
    form: UseFormReturnType<T>;
    formErrors: FormErrors | undefined;
    renderFormErrors: () => ReactElement;
    renderSubmitButton: (
      props: Omit<SubmitButtonProps, "isSubmitting" | "form">
    ) => ReactElement<SubmitButtonProps>;
  }) => JSX.Element;
};

export function ValidatedForm<T extends UnknownObject>({
  name,
  initialValues,
  onValidSubmit,
  fallbackErrorMessage,
  validate,
  children,
  ...useFormProps
}: ValidatedFormProps<T>) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>();

  const form = useForm<T>({
    validateInputOnChange: true,
    validateInputOnBlur: true,

    ...useFormProps,
    name,
    initialValues,
    validate,
  });

  async function handleSubmit(data: T) {
    setIsSubmitting(true);

    try {
      const validateResult = form.validate();
      if (validateResult.hasErrors) {
        return;
      }

      await onValidSubmit(data);
      setFormErrors(undefined);
    } catch (error) {
      setFormErrors([fallbackErrorMessage ?? t("error.generic")]);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box>
      <form onSubmit={form.onSubmit((x) => void handleSubmit(x))}>
        {children({
          isSubmitting,
          form,
          formErrors,
          renderFormErrors: () => (
            <FormError errors={formErrors ?? form.errors} />
          ),
          renderSubmitButton: (props) => (
            <SubmitButton
              {...props}
              form={form as UseFormReturnType<unknown>}
              isSubmitting={isSubmitting}
            />
          ),
        })}
      </form>
    </Box>
  );
}
