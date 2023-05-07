import { AxiosInstance, AxiosResponse } from "axios";
import {
  Feedback,
  LatestOutput,
  PopularOptions,
  PopularOutput,
  RecommendOptions,
  SessionRecommendOptions,
} from "../interfaces";

export function getPopular(
  axios: AxiosInstance,
  { category = "", cursorOptions }: PopularOptions
) {
  return axios
    .get<PopularOutput[], AxiosResponse<PopularOutput[]>>(
      `/popular/${category}`,
      {
        params: cursorOptions,
      }
    )
    .then(({ data }) => {
      return data;
    });
}

export function getLatest(
  axios: AxiosInstance,
  { category = "", cursorOptions }: PopularOptions
) {
  return axios
    .get<LatestOutput[], AxiosResponse<LatestOutput[]>>(`/latest/${category}`, {
      params: cursorOptions,
    })
    .then(({ data }) => {
      return data;
    });
}

export function getRecommend(
  axios: AxiosInstance,
  {
    userId,
    category = "",
    cursorOptions,
    writeBackType,
    writeBackDelay,
  }: RecommendOptions
) {
  return axios
    .get<string[], AxiosResponse<string[]>>(
      `/recommend/${userId}/${category}`,
      {
        params: {
          ...(writeBackType ? { "write-back-type": writeBackType } : {}),
          ...(writeBackDelay ? { "write-back-delay": writeBackDelay } : {}),
          ...cursorOptions,
        },
      }
    )
    .then(({ data }) => {
      return data;
    });
}

export function getSessionRecommend<T extends string>(
  axios: AxiosInstance,
  feedbackList: Feedback<T>[] = [],
  { category = "", cursorOptions }: SessionRecommendOptions
) {
  return axios
    .post(`/session/recommend/${category}`, feedbackList, {
      params: {
        ...cursorOptions,
      },
    })
    .then(({ data }) => {
      return data;
    });
}
