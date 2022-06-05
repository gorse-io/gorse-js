import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import {
  requestLogger,
  responseLogger,
  errorLogger,
  setGlobalConfig,
} from "axios-logger";
import {
  ClientOptions,
  Feedback,
  Item,
  User,
} from "./interfaces";

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
        // logger: someLogger.info.bind(this),
      });

      this.axiosClient.interceptors.request.use(requestLogger, errorLogger);
      this.axiosClient.interceptors.response.use(responseLogger, errorLogger);
    }
  }
}

export { Gorse };
