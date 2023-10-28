import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import api from "api/$api";
import axiosClient from "@aspida/axios";

export const apiClient = async (token?: string) => {
  const config: AxiosRequestConfig<any> = token
    ? {
        baseURL: process.env.REMIX_PUBLIC_API_URL,
        headers: { Authorization: `bearer: ${token}` },
      }
    : {
        baseURL: process.env.REMIX_PUBLIC_API_URL,
      };

  return api(axiosClient(axios, config));
};
