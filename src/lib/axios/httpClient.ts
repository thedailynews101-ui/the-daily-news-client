import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    /**
     * Opt out of the silent-refresh-and-retry behavior for a 401 response to
     * this request. Set by the auth endpoints themselves (login, signup,
     * refresh-token, forgot/reset-password, verify-email) so a wrong
     * password or an expired reset link never triggers a refresh attempt.
     */
    skipAuthRefresh?: boolean;
  }
}

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

type AuthFailureListener = () => void;

let authFailureListener: AuthFailureListener | null = null;

/**
 * Registered by AuthProvider so the interceptor can clear cached auth state
 * on a definitive (post-refresh-attempt) 401, without this module importing
 * React or owning navigation.
 */
export const setOnAuthFailure = (listener: AuthFailureListener | null) => {
  authFailureListener = listener;
};

export interface ApiRequestOptions {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  skipAuthRefresh?: boolean;
}

let instance: AxiosInstance | null = null;
let refreshPromise: Promise<void> | null = null;

const refreshAccessToken = (client: AxiosInstance): Promise<void> => {
  if (!refreshPromise) {
    refreshPromise = client
      .post("/api/auth/refresh-token", undefined, { skipAuthRefresh: true })
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

const getInstance = (): AxiosInstance => {
  if (instance) {
    return instance;
  }

  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseURL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
  }

  const client = axios.create({
    // In the browser, call our own origin; next.config rewrites proxy /api/* to the API.
    baseURL: typeof window === "undefined" ? baseURL : "",
    // Cookies (accessToken/refreshToken) are HTTP-only and set by the API
    // origin - this is what makes the browser send them on every request.
    withCredentials: true,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  client.interceptors.response.use(
    (response) => {
      // #region agent log
      const url = String(response.config.url ?? "");
      if (url.includes("/auth/login") || url.includes("/auth/me") || url.includes("/auth/refresh-token")) {
        fetch("http://127.0.0.1:7750/ingest/cf35cf32-3598-447a-8d7f-fee6f91430b3", {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "b31edf" },
          body: JSON.stringify({
            sessionId: "b31edf",
            runId: "pre-fix",
            hypothesisId: url.includes("login") ? "A" : url.includes("refresh") ? "B" : "E",
            location: "httpClient.ts:responseSuccess",
            message: "auth response ok",
            data: {
              url,
              status: response.status,
              baseURL: response.config.baseURL,
              withCredentials: response.config.withCredentials === true,
              visibleCookieCount: typeof document !== "undefined" ? document.cookie.split(";").filter(Boolean).length : -1,
            },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
      }
      // #endregion
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryableRequestConfig | undefined;
      const isUnauthorized = error.response?.status === 401;
      // #region agent log
      fetch("http://127.0.0.1:7750/ingest/cf35cf32-3598-447a-8d7f-fee6f91430b3", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "b31edf" },
        body: JSON.stringify({
          sessionId: "b31edf",
          runId: "pre-fix",
          hypothesisId: "E",
          location: "httpClient.ts:responseError",
          message: "auth request failed",
          data: {
            url: String(originalRequest?.url ?? ""),
            status: error.response?.status ?? null,
            method: String(originalRequest?.method ?? ""),
            skipAuthRefresh: Boolean(originalRequest?.skipAuthRefresh),
            alreadyRetried: Boolean(originalRequest?._retry),
            willAttemptRefresh:
              isUnauthorized &&
              !!originalRequest &&
              !originalRequest.skipAuthRefresh &&
              !originalRequest._retry,
            apiMessage: (error.response?.data as { message?: string } | undefined)?.message ?? null,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion

      const shouldAttemptRefresh =
        isUnauthorized &&
        !!originalRequest &&
        !originalRequest.skipAuthRefresh &&
        !originalRequest._retry;

      if (!shouldAttemptRefresh) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        await refreshAccessToken(client);
        return client(originalRequest);
      } catch (refreshError) {
        // #region agent log
        fetch("http://127.0.0.1:7750/ingest/cf35cf32-3598-447a-8d7f-fee6f91430b3", {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "b31edf" },
          body: JSON.stringify({
            sessionId: "b31edf",
            runId: "pre-fix",
            hypothesisId: "A",
            location: "httpClient.ts:refreshFailed",
            message: "refresh failed clearing auth",
            data: {
              refreshStatus: (refreshError as AxiosError)?.response?.status ?? null,
              refreshMessage:
                ((refreshError as AxiosError)?.response?.data as { message?: string } | undefined)
                  ?.message ?? null,
            },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
        // Refresh itself failed (401) - the session is definitively gone.
        authFailureListener?.();
        return Promise.reject(refreshError);
      }
    }
  );

  instance = client;
  return client;
};

const httpGet = async (endpoint: string, options?: ApiRequestOptions) => {
  const response = await getInstance().get(endpoint, {
    params: options?.params,
    headers: options?.headers,
    skipAuthRefresh: options?.skipAuthRefresh,
  });
  return response.data;
};

const httpPost = async (endpoint: string, data: unknown, options?: ApiRequestOptions) => {
  const response = await getInstance().post(endpoint, data, {
    headers: options?.headers,
    skipAuthRefresh: options?.skipAuthRefresh,
  });
  return response.data;
};

const httpPut = async (endpoint: string, data: unknown, options?: ApiRequestOptions) => {
  const response = await getInstance().put(endpoint, data, {
    headers: options?.headers,
    skipAuthRefresh: options?.skipAuthRefresh,
  });
  return response.data;
};

const httpDelete = async (endpoint: string, options?: ApiRequestOptions) => {
  const response = await getInstance().delete(endpoint, {
    headers: options?.headers,
    skipAuthRefresh: options?.skipAuthRefresh,
  });
  return response.data;
};

const httpPatch = async (endpoint: string, data: unknown, options?: ApiRequestOptions) => {
  const response = await getInstance().patch(endpoint, data, {
    headers: options?.headers,
    skipAuthRefresh: options?.skipAuthRefresh,
  });
  return response.data;
};

export const httpClient = {
  get: httpGet,
  post: httpPost,
  put: httpPut,
  delete: httpDelete,
  patch: httpPatch,
};
