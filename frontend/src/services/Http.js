import axios from "axios";

import {
  abortControllerInterceptor,
  refreshSessionInterceptor,
  toastErrorInterceptor
} from "./interceptors/refreshSessionInterceptor";
import { mapResponse } from "./interceptors/mapResponse";
import { setAuthToken } from "./interceptors/setAuthToken";


const interceptorsResponse = [
  mapResponse,
  refreshSessionInterceptor,
];

const interceptorsRequest = [
  setAuthToken,
];

const headers = {
  "Access-Control-Allow-Origin": "*",
};

class Http {
  constructor() {
    this.instance = Http.createInstance({
      baseURL: `${Http.api.common}/${this.getURLScope()}`,
      headers
    });
    this.instance.interceptors.request.use(...interceptorsRequest);
    this.instance.interceptors.response.use((data) => data, abortControllerInterceptor);
    this.instance.interceptors.response.use(...interceptorsResponse);
  }

  static $displayName = "Http";

  static createInstance() {
    return axios.create.apply(axios, arguments);
  }

  getURLScope() {
    return ""
  }

  get() {
    return this.instance.get.apply(this.instance, arguments);
  }

  patch() {
    return this.instance.patch.apply(this.instance, arguments);
  }

  put() {
    return this.instance.put.apply(this.instance, arguments);
  }

  post() {
    return this.instance.post.apply(this.instance, arguments);
  }

  delete() {
    return this.instance.delete.apply(this.instance, arguments);
  }
}

Http.api = {
  common: process.env.REACT_APP_BASE_URL
};

Http.versions = {
  v1: process.env.REACT_APP_API_VERSION
};

export default Http;
