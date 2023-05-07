import { AxiosInstance, AxiosResponse } from "axios";
import {
  CursorOptions,
  Feedback,
  FeedbackCursor,
  FeedbackFilter,
  FeedbackOptions,
  FeedbackTypeFilter,
  Success,
} from "../interfaces";

export function getFeedback<T extends string>(
  axios: AxiosInstance,
  { type, userId, itemId, cursorOptions }: FeedbackOptions<T>
) {
  return axios
    .get<Feedback<T>, AxiosResponse<Feedback<T>>>(
      `/feedback/${type}/${userId}/${itemId}`,
      {
        params: cursorOptions,
      }
    )
    .then(({ data }) => {
      return data;
    });
}

export function deleteFeedback<T extends string>(
  axios: AxiosInstance,
  { type, userId, itemId }: FeedbackFilter<T>
) {
  return axios
    .delete<Feedback<T>, AxiosResponse<Feedback<T>>>(
      `/feedback/${type}/${userId}/${itemId}`
    )
    .then(({ data }) => {
      return data;
    });
}

export function getFeedbacksByType<T extends string>(
  axios: AxiosInstance,
  { type, cursorOptions }: FeedbackTypeFilter<T>
) {
  return axios
    .get<FeedbackCursor<T>, AxiosResponse<FeedbackCursor<T>>>(
      `/feedback/${type}`,
      {
        params: cursorOptions,
      }
    )
    .then(({ data }) => {
      return data;
    });
}

export function getFeedbacks<T extends string>(
  axios: AxiosInstance,
  options?: CursorOptions
) {
  return axios
    .get<FeedbackCursor<T>, AxiosResponse<FeedbackCursor<T>>>(`/feedback`, {
      params: options,
    })
    .then(({ data }) => {
      return data;
    });
}

export function insertFeedbacks<T extends string>(
  axios: AxiosInstance,
  feedbacksList: Feedback<T>[]
) {
  return axios
    .post<Success, AxiosResponse<Success>>(`/feedback`, feedbacksList)
    .then(({ data }) => {
      return data.RowAffected;
    });
}

export function upsertFeedbacks<T extends string>(
  axios: AxiosInstance,
  feedbacksList: Feedback<T>[]
) {
  return axios
    .put<Success, AxiosResponse<Success>>(`/feedback`, feedbacksList)
    .then(({ data }) => {
      return data.RowAffected;
    });
}

// TODO - Item Feedbacks

// TODO - User Feedbacks
