import { z } from "zod";

export type ErrorMessage = z.infer<typeof errorMessageSchema>;

export type ErrorMessages = z.infer<typeof errorMessagesSchema>;

export type FormErrors = ErrorMessages;

export const errorMessageSchema = z.string();
export const errorMessagesSchema = z.array(errorMessageSchema);
export const formErrorsSchema = errorMessagesSchema;
