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
    baseURL,
    // Cookies (accessToken/refreshToken) are HTTP-only and set by the API
    // origin - this is what makes the browser send them on every request.
    withCredentials: true,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryableRequestConfig | undefined;
      const isUnauthorized = error.response?.status === 401;

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
