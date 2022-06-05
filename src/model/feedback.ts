import { AxiosInstance } from "axios";
import { GorseException } from "../error";
import {
  CursorOptions,
  Feedback,
  FeedbackCursor,
  Success,
} from "../interfaces";

export function getFeedback<T extends string>(
  type: T,
  UserId: string,
  ItemId: string,
  options: CursorOptions,
  axios: AxiosInstance
) {
  return axios
    .get<Feedback<T>>(`/feedback/${type}/${UserId}/${ItemId}`, {
      params: options,
    })
    .then(({ data }) => {
      return data;
    })
    .catch((exception) => {
      const { response } = exception;
      throw new GorseException(response.status, response.data);
    });
}

export function deleteFeedback<T extends string>(
  type: T,
  UserId: string,
  ItemId: string,
  axios: AxiosInstance
) {
  return axios
    .delete<Feedback<T>>(`/feedback/${type}/${UserId}/${ItemId}`)
    .then(({ data }) => {
      return data;
    })
    .catch((exception) => {
      const { response } = exception;
      throw new GorseException(response.status, response.data);
    });
}

export function getFeedbacksByType<T extends string>(
  type: T,
  options: CursorOptions,
  axios: AxiosInstance
) {
  return axios
    .get<FeedbackCursor<T>>(`/feedback/${type}`, {
      params: options,
    })
    .then(({ data }) => {
      return data;
    })
    .catch((exception) => {
      const { response } = exception;
      throw new GorseException(response.status, response.data);
    });
}

export function getFeedbacks<T extends string>(
  options: CursorOptions,
  axios: AxiosInstance
) {
  return axios
    .get<FeedbackCursor<T>>(`/feedback`, {
      params: options,
    })
    .then(({ data }) => {
      return data;
    })
    .catch((exception) => {
      const { response } = exception;
      throw new GorseException(response.status, response.data);
    });
}

export function insertFeedbacks<T extends string>(
  feedbacksData: Feedback<T>[],
  axios: AxiosInstance
) {
  return axios
    .post<Success>(`/feedback`, feedbacksData)
    .then(({ data }) => {
      return data.RowAffected;
    })
    .catch((exception) => {
      const { response } = exception;
      throw new GorseException(response.status, response.data);
    });
}

export function upsertFeedbacks<T extends string>(
  feedbacksData: Feedback<T>[],
  axios: AxiosInstance
) {
  return axios
    .put<Success>(`/feedback`, feedbacksData)
    .then(({ data }) => {
      return data.RowAffected;
    })
    .catch((exception) => {
      const { response } = exception;
      throw new GorseException(response.status, response.data);
    });
}

// TODO - Item Feedbacks

// TODO - User Feedbacks
