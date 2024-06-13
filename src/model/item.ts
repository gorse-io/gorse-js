import { AxiosInstance, AxiosResponse } from "axios";
import {
  CursorOptions,
  Success,
  Item,
  ItemCursor,
  ItemNeighborsOptions,
  SimilarOutput,
} from "../interfaces";

export function upsertItem(axios: AxiosInstance, itemData: Item) {
  return axios
    .post<Success, AxiosResponse<Success>>(`/item`, itemData)
    .then(({ data }) => {
      return data.RowAffected;
    });
}

export function getItem(axios: AxiosInstance, itemId: string) {
  return axios
    .get<Item, AxiosResponse<Item>>(`/item/${itemId}`)
    .then(({ data }) => {
      return data;
    });
}

export function deleteItem(axios: AxiosInstance, itemId: string) {
  return axios
    .delete<Success, AxiosResponse<Success>>(`/item/${itemId}`)
    .then(({ data }) => {
      return data.RowAffected;
    });
}

export function updateItem(
  axios: AxiosInstance,
  itemId: string,
  itemData: Item
) {
  return axios
    .patch<Success, AxiosResponse<Success>>(`/item/${itemId}`, itemData)
    .then(({ data }) => {
      return data.RowAffected;
    });
}

export function insertItemCategory(
  axios: AxiosInstance,
  itemId: string,
  category: string
) {
  return axios
    .put<Success, AxiosResponse<Success>>(
      `/item/${itemId}/category/${category}`
    )
    .then(({ data }) => {
      return data.RowAffected;
    });
}

export function deleteItemCategory(
  axios: AxiosInstance,
  itemId: string,
  category: string
) {
  return axios
    .delete<Success, AxiosResponse<Success>>(
      `/item/${itemId}/category/${category}`
    )
    .then(({ data }) => {
      return data.RowAffected;
    });
}

export function getItems(axios: AxiosInstance, options?: CursorOptions) {
  return axios
    .get<ItemCursor, AxiosResponse<ItemCursor>>(`/items`, {
      params: options,
    })
    .then(({ data }) => {
      return data;
    });
}

export function upsertItems(axios: AxiosInstance, items: Item[]) {
  return axios
    .post<Success, AxiosResponse<Success>>(`/items`, items)
    .then(({ data }) => {
      return data.RowAffected;
    });
}

export function getItemNeighbors(
  axios: AxiosInstance,
  { itemId, category = "", cursorOptions }: ItemNeighborsOptions
) {
  return axios
    .get<SimilarOutput[], AxiosResponse<SimilarOutput[]>>(
      `/item/${itemId}/neighbors/${category}`,
      {
        params: cursorOptions,
      }
    )
    .then(({ data }) => {
      return data;
    });
}
