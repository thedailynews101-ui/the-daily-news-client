import axios from "axios";

/** Shape of the JSON body sent by the server's globalErrorHandler. */
export type ApiErrorPayload = {
  success: false;
  message: string;
  errorCode?: string;
  errorDetails?: Record<string, string[] | undefined>;
};

const DEFAULT_MESSAGE = "Something went wrong. Please try again.";

/** Extracts the server's human-readable message from a failed request. */
export function getApiErrorMessage(error: unknown, fallback: string = DEFAULT_MESSAGE): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as Partial<ApiErrorPayload> | undefined;
    if (data?.message) {
      return data.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

/** Extracts the server's machine-readable error code, if any (e.g. "EMAIL_NOT_VERIFIED"). */
export function getApiErrorCode(error: unknown): string | undefined {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as Partial<ApiErrorPayload> | undefined;
    return data?.errorCode;
  }

  return undefined;
}

/** Extracts per-field validation errors from a Zod-validation 400 response. */
export function getApiFieldErrors(error: unknown): Record<string, string[] | undefined> | undefined {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as Partial<ApiErrorPayload> | undefined;
    return data?.errorDetails;
  }

  return undefined;
}
