import {AUTH} from "../../base/constants/headers";
import {initService} from "../../base/hooks/useService";
import SessionStorage from "../SessionStorage";

export const setAuthToken = request => {
    /**
     * @type SessionStorage
     */
    const storage = initService(SessionStorage);
    const {accessToken} = storage.getSession();

    request.headers = {
        ...request.headers,
        [AUTH]: accessToken ? `Bearer ${accessToken}` : "",
    };

    return request;
};
