import axios, { AxiosRequestConfig } from "axios";

import {
  DIGITALOCEAN_API_ENDPOINT,
  DIGITALOCEAN_PAT_ADMIN_TOKEN,
} from "@/config";

// ----------------------------------------------------------------------
const axiosInstance = axios.create({
  baseURL: `${DIGITALOCEAN_API_ENDPOINT}`,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = DIGITALOCEAN_PAT_ADMIN_TOKEN;
    config.headers.Authorization = `Bearer ${accessToken}`;
    config.headers["Access-Control-Allow-Origin"] = "*";
    return config;
  },
  (err) => {
    throw new Error(err);
  }
);

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    )
);

export default axiosInstance;

// ----------------------------------------------------------------------
export const axiosGet = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

export const axiosPost = async (
  args: string | [string, AxiosRequestConfig]
) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.post(url, config?.data, config);

  return res.data;
};

export const axiosPut = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.put(url, config?.data, config);

  return res.data;
};

export const axiosDelete = async (
  args: string | [string, AxiosRequestConfig]
) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.delete(url, { ...config });

  return res.data;
};
