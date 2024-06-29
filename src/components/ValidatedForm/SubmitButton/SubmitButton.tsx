import { Button } from "@mantine/core";
import type { ButtonProps } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";

export type SubmitButtonProps = Omit<
  ButtonProps,
  "type" | "loading" | "disabled"
> & {
  text: string;
  form: UseFormReturnType<unknown>;
  isSubmitting: boolean;
  disableIfInvalid?: boolean;
  forceDisabled?: boolean;
  disableIfNotDirty?: boolean;
  testId?: string;
};

export function SubmitButton({
  text,
  form,
  isSubmitting,
  disableIfInvalid,
  forceDisabled,
  testId,
  disableIfNotDirty = true,
  ...rest
}: SubmitButtonProps) {
  return (
    <Button
      {...rest}
      type="submit"
      loading={isSubmitting}
      data-testid={testId}
      disabled={
        forceDisabled ||
        isSubmitting ||
        (disableIfNotDirty && !form.isDirty()) ||
        (disableIfInvalid && !form.isValid())
      }
    >
      {text}
    </Button>
  );
}
