import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import {
  requestLogger,
  responseLogger,
  errorLogger,
  setGlobalConfig,
} from "axios-logger";
import {
  FeedbackFilter,
  ItemNeighborsOptions,
  PopularOptions,
  RecommendOptions,
  UserNeighborsOptions,
} from ".";
import {
  ClientOptions,
  CursorOptions,
  Feedback,
  Item,
  User,
} from "./interfaces";
import {
  deleteFeedback,
  getFeedback,
  getFeedbacks,
  getFeedbacksByType,
  insertFeedbacks,
  upsertFeedbacks,
} from "./model/feedback";
import {
  deleteItem,
  deleteItemCategory,
  getItem,
  upsertItem,
  insertItemCategory,
  upsertItems,
  updateItem,
  getItems,
  getItemNeighbors,
} from "./model/item";
import {
  deleteUser,
  getUser,
  getUserNeighbors,
  getUsers,
  insertUser,
  insertUsers,
  updateUser,
} from "./model/user";
import { getLatest, getPopular, getRecommend } from "./model/recommend";

export { Item, User, Feedback } from "./interfaces";

class Gorse<T extends string> {
  protected axiosClient: AxiosInstance;

  constructor(
    {
      endpoint = `${process.env["GORSE_ENDPOINT"]}`,
      secret = `${process.env["GORSE_SECRET"]}`,
      debug,
    }: ClientOptions,
    axiosOptons?: AxiosRequestConfig
  ) {
    this.axiosClient = axios.create({
      baseURL: `${endpoint}/api`,
      headers: secret && secret.length > 0 ? { "X-API-Key": secret } : {},
      ...axiosOptons,
    });

    if (debug) {
      setGlobalConfig({
        prefixText: "Gorse",
        status: true,
        headers: true,
      });

      this.axiosClient.interceptors.request.use(requestLogger, errorLogger);
      this.axiosClient.interceptors.response.use(responseLogger, errorLogger);
    }
  }

  // Core functions

  getPopular(options: PopularOptions) {
    return getPopular(this.axiosClient, options);
  }

  getLatest(options: PopularOptions) {
    return getLatest(this.axiosClient, options);
  }

  getRecommend(options: RecommendOptions) {
    return getRecommend(this.axiosClient, options);
  }

  // Feedback

  getFeedback(filter: FeedbackFilter<T>, options?: CursorOptions) {
    return getFeedback(this.axiosClient, { ...filter, cursorOptions: options });
  }

  deleteFeedback(filter: FeedbackFilter<T>) {
    return deleteFeedback<T>(this.axiosClient, filter);
  }

  getFeedbacks(type?: T, options?: CursorOptions) {
    if (type) {
      return getFeedbacksByType<T>(this.axiosClient, {
        type,
        cursorOptions: options,
      });
    } else {
      return getFeedbacks<T>(this.axiosClient, options);
    }
  }

  insertFeedbacks(feedbacksList: Feedback<T>[]) {
    return insertFeedbacks<T>(this.axiosClient, feedbacksList);
  }

  upsertFeedbacks(feedbacksList: Feedback<T>[]) {
    return upsertFeedbacks<T>(this.axiosClient, feedbacksList);
  }

  // Item
  upsertItem(data: Item) {
    return upsertItem(this.axiosClient, data);
  }

  getItem(id: string) {
    return getItem(this.axiosClient, id);
  }

  deleteItem(id: string) {
    return deleteItem(this.axiosClient, id);
  }

  updateItem(id: string, data: Item) {
    return updateItem(this.axiosClient, id, data);
  }

  insertItemCategory(id: string, category: string) {
    return insertItemCategory(this.axiosClient, id, category);
  }

  deleteItemCategory(id: string, category: string) {
    return deleteItemCategory(this.axiosClient, id, category);
  }

  getItems(options?: CursorOptions) {
    return getItems(this.axiosClient, options);
  }

  upsertItems(users: Item[]) {
    return upsertItems(this.axiosClient, users);
  }

  getItemNeighbors(options: ItemNeighborsOptions) {
    return getItemNeighbors(this.axiosClient, options);
  }

  // User

  insertUser(userData: User) {
    return insertUser(this.axiosClient, userData);
  }

  getUser(userId: string) {
    return getUser(this.axiosClient, userId);
  }

  deleteUser(userId: string) {
    return deleteUser(this.axiosClient, userId);
  }

  updateUser(userId: string, userData: User) {
    return updateUser(this.axiosClient, userId, userData);
  }

  getUsers(options?: CursorOptions) {
    return getUsers(this.axiosClient, options);
  }

  insertUsers(users: User[]) {
    return insertUsers(this.axiosClient, users);
  }

  getUserNeighbors(options: UserNeighborsOptions) {
    return getUserNeighbors(this.axiosClient, options);
  }
}

export { Gorse };
