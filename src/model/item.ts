import { AxiosInstance } from "axios";
import { GorseException } from "../error";
import { CursorOptions, Success, Item, ItemCursor } from "../interfaces";

export function insertItem(itemData: Item, axios: AxiosInstance) {
  return axios
    .post<Success>(`/item`, itemData)
    .then(({ data }) => {
      return data.RowAffected;
    })
    .catch((exception) => {
      const { response } = exception;
      throw new GorseException(response.status, response.data);
    });
}

export function getItem(itemId: string, axios: AxiosInstance) {
  return axios
    .get<Item>(`/item/${itemId}`)
    .then(({ data }) => {
      return data;
    })
    .catch((exception) => {
      const { response } = exception;
      throw new GorseException(response.status, response.data);
    });
}

export function deleteItem(itemId: string, axios: AxiosInstance) {
  return axios
    .delete<Success>(`/item/${itemId}`)
    .then(({ data }) => {
      return data.RowAffected;
    })
    .catch((exception) => {
      const { response } = exception;
      throw new GorseException(response.status, response.data);
    });
}

export function updateItem(
  itemId: string,
  itemData: Item,
  axios: AxiosInstance
) {
  return axios
    .patch<Success>(`/item/${itemId}`, itemData)
    .then(({ data }) => {
      return data.RowAffected;
    })
    .catch((exception) => {
      const { response } = exception;
      throw new GorseException(response.status, response.data);
    });
}

export function insertItemCategory(
  itemId: string,
  category: String,
  axios: AxiosInstance
) {
  return axios
    .put<Success>(`/item/${itemId}/category/${category}`)
    .then(({ data }) => {
      return data.RowAffected;
    })
    .catch((exception) => {
      const { response } = exception;
      throw new GorseException(response.status, response.data);
    });
}

export function deleteItemCategory(
  itemId: string,
  category: String,
  axios: AxiosInstance
) {
  return axios
    .delete<Success>(`/item/${itemId}/category/${category}`)
    .then(({ data }) => {
      return data.RowAffected;
    })
    .catch((exception) => {
      const { response } = exception;
      throw new GorseException(response.status, response.data);
    });
}

export function getItems(options: CursorOptions, axios: AxiosInstance) {
  return axios
    .get<ItemCursor>(`/items`, {
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

export function insertItems(items: Item[], axios: AxiosInstance) {
  return axios
    .post<Success>(`/items`, items)
    .then(({ data }) => {
      return data.RowAffected;
    })
    .catch((exception) => {
      const { response } = exception;
      throw new GorseException(response.status, response.data);
    });
}
