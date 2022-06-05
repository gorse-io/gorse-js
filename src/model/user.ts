import { AxiosInstance } from "axios";
import { GorseException } from "../error";
import { CursorOptions, Success, User, UserCursor } from "../interfaces";

export function insertUser(userData: User, axios: AxiosInstance) {
  return axios
    .post<Success>(`/user`, userData)
    .then(({ data }) => {
      return data.RowAffected;
    })
    .catch((exception) => {
      const { response } = exception;
      throw new GorseException(response.status, response.data);
    });
}

export function getUser(userId: string, axios: AxiosInstance) {
  return axios
    .get<User>(`/user/${userId}`)
    .then(({ data }) => {
      return data;
    })
    .catch((exception) => {
      const { response } = exception;
      throw new GorseException(response.status, response.data);
    });
}

export function deleteUser(userId: string, axios: AxiosInstance) {
  return axios
    .delete<Success>(`/user/${userId}`)
    .then(({ data }) => {
      return data.RowAffected;
    })
    .catch((exception) => {
      const { response } = exception;
      throw new GorseException(response.status, response.data);
    });
}

export function updateUser(
  userId: string,
  userData: User,
  axios: AxiosInstance
) {
  return axios
    .patch<Success>(`/user/${userId}`, userData)
    .then(({ data }) => {
      return data.RowAffected;
    })
    .catch((exception) => {
      const { response } = exception;
      throw new GorseException(response.status, response.data);
    });
}

export function getUsers(options: CursorOptions, axios: AxiosInstance) {
  return axios
    .get<UserCursor>(`/users`, {
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

export function insertUsers(users: User[], axios: AxiosInstance) {
  return axios
    .post<Success>(`/users`, users)
    .then(({ data }) => {
      return data.RowAffected;
    })
    .catch((exception) => {
      const { response } = exception;
      throw new GorseException(response.status, response.data);
    });
}
