import { AxiosInstance, AxiosResponse } from "axios";
import {
  Feedback,
  Score,
  LatestOptions,
  RecommendOptions,
  SessionRecommendOptions,
} from "../interfaces";

export function getLatest(
  axios: AxiosInstance,
  { category = "", cursorOptions }: LatestOptions,
) {
  return axios
    .get<Score[], AxiosResponse<Score[]>>(`/latest/${category}`, {
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
    category,
    cursorOptions,
    writeBackType,
    writeBackDelay,
  }: RecommendOptions,
) {
  const params = new URLSearchParams();
  const categories = Array.isArray(category)
    ? category
    : category
      ? [category]
      : [];
  for (const value of categories) {
    params.append("category", value);
  }
  if (writeBackType) {
    params.append("write-back-type", writeBackType);
  }
  if (writeBackDelay) {
    params.append("write-back-delay", writeBackDelay);
  }
  if (cursorOptions?.n !== undefined) {
    params.append("n", cursorOptions.n.toString());
  }
  if (cursorOptions?.offset !== undefined) {
    params.append("offset", cursorOptions.offset.toString());
  }

  return axios
    .get<Score[], AxiosResponse<Score[]>>(
      `/recommend/${encodeURIComponent(userId)}`,
      {
        params,
        headers: {
          "X-API-Version": "2",
        },
      },
    )
    .then(({ data }) => {
      return data;
    });
}

export function getSessionRecommend<T extends string>(
  axios: AxiosInstance,
  feedbackList: Feedback<T>[] = [],
  { category = "", cursorOptions }: SessionRecommendOptions,
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
