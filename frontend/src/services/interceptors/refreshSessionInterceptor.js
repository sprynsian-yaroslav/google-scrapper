import STATUS_CODE from "../../base/constants/statusCodes";
import { initService, useService } from "../../base/hooks/useService";
import { AUTH, UNAUTORIZED_STRING } from "../../base/constants/headers";
import { sendRefreshToken } from "../refreshSession";
import axios from "axios";
import { LINK_TO_LOGOUT } from "../../base/links";
import { mapResponse } from "./mapResponse";
import SessionStorage from "../SessionStorage";
import ToasterService from "../ToastService";

function redirectToLogout() {
  let location = window.location;
  location.href = location.origin + LINK_TO_LOGOUT;
}

const ERRORS_WITH_DEFAULT_MESSAGE = [500, 501, 502, 504];

export const refreshSessionInterceptor = (error) => {
  let dataObject = {},
    statusCode;
  const { response } = error;
  const { UNAUTHORIZED, FORBIDDEN } = STATUS_CODE;
  /**
   * @type {SessionStorage}
   */
  const storage = initService(SessionStorage);
  const { refreshToken } = storage.getSession();
  /**
   * @type {ToasterService}
   */
  const toastr = useService(ToasterService);

  if (response) {
    dataObject = response.data;
  }

  statusCode =
    dataObject.code || dataObject.statusCode || (response && response.status);
  const isUnauth =
    statusCode === UNAUTHORIZED || statusCode === UNAUTORIZED_STRING;

  if (isUnauth && refreshToken) {
    let isRefreshed = false;
    return sendRefreshToken({ refreshToken })
      .then(({ data }) => {
        error.config.headers[AUTH] = `Bearer ${data?.session?.accessToken}`;
        isRefreshed = true;
        // retry request
        return axios.request(error.config).then(mapResponse);
      })
      .catch((err) => {
        if (!isRefreshed) {
          redirectToLogout();
        }
        toastr.error(err.message);
      });
  }

  if ((isUnauth && !refreshToken) || statusCode === FORBIDDEN) {
    redirectToLogout();
  }

  if (ERRORS_WITH_DEFAULT_MESSAGE.includes(statusCode) && !response?.config?.customToast && !response.data.message) {
    toastr.error("Something went wrong");
  }

  if (!response?.config?.customToast && response.data.message) {
    toastr.error(typeof response.data.message === "string" ? response.data.message : response.data.message[0]);
  }

  return Promise.reject(dataObject);
};

export const abortControllerInterceptor = (error) => {
  if(error.code === "ERR_CANCELED") {
    return Promise.reject({
      response: {
        data: {
          "message": "Upload was cancelled"
        }
      }
    })
  }
  return Promise.reject(error);
};
