import { AxiosInstance, AxiosResponse } from "axios";
import {
  CursorOptions,
  Success,
  User,
  UserCursor,
  UserNeighborsOptions,
} from "../interfaces";

// FIXME: is this an upsert endpoint?
export function insertUser(axios: AxiosInstance, userData: User) {
  return axios
    .post<Success, AxiosResponse<Success>>(`/user`, userData)
    .then(({ data }) => {
      return data.RowAffected;
    });
}

export function getUser(axios: AxiosInstance, userId: string) {
  return axios
    .get<User, AxiosResponse<User>>(`/user/${userId}`)
    .then(({ data }) => {
      return data;
    });
}

export function deleteUser(axios: AxiosInstance, userId: string) {
  return axios
    .delete<Success, AxiosResponse<Success>>(`/user/${userId}`)
    .then(({ data }) => {
      return data.RowAffected;
    });
}

export function updateUser(
  axios: AxiosInstance,
  userId: string,
  userData: User
) {
  return axios
    .patch<Success, AxiosResponse<Success>>(`/user/${userId}`, userData)
    .then(({ data }) => {
      return data.RowAffected;
    });
}

export function getUsers(axios: AxiosInstance, options?: CursorOptions) {
  return axios
    .get<UserCursor, AxiosResponse<UserCursor>>(`/users`, {
      params: options,
    })
    .then(({ data }) => {
      return data;
    });
}

// FIXME: is this an endpoint?
export function insertUsers(axios: AxiosInstance, users: User[]) {
  return axios
    .post<Success, AxiosResponse<Success>>(`/users`, users)
    .then(({ data }) => {
      return data.RowAffected;
    });
}

export function getUserNeighbors(
  axios: AxiosInstance,
  { userId, cursorOptions }: UserNeighborsOptions
) {
  return axios
    .get<string[], AxiosResponse<string[]>>(`/user/${userId}/neighbors`, {
      params: cursorOptions,
    })
    .then(({ data }) => {
      return data;
    });
}
