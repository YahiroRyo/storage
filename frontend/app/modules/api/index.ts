import axiosClient from "@aspida/axios";
import api from "api/$api";
import axios from "axios";
import type { AxiosRequestConfig } from "axios";

export const apiClient = (token?: string) => {
  if (process.env.NEXT_PUBLIC_MOCK === "active") {
    const axiosConfig: AxiosRequestConfig<any> = token
      ? {
          baseURL: process.env.NEXT_PUBLIC_MOCK_API_URL,
          headers: { Authorization: `bearer: ${token}` },
        }
      : {
          baseURL: process.env.NEXT_PUBLIC_MOCK_API_URL,
        };

    return api(axiosClient(axios, axiosConfig));
  }
  const axiosConfig: AxiosRequestConfig<any> = token
    ? {
        baseURL: process.env.NEXT_PUBLIC_MOCK_API_URL,
        headers: { Authorization: `bearer: ${token}` },
      }
    : {
        baseURL: process.env.NEXT_PUBLIC_MOCK_API_URL,
      };
  return api(axiosClient(axios, axiosConfig));
};
