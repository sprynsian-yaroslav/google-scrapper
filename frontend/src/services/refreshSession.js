import Http from './Http';
import axios from 'axios';
import { LINK_TO_REFRESH_TOKEN_API } from '../base/links';
import {initService} from "../base/hooks/useService";
import SessionStorage from "./SessionStorage";

/**
 *
 * @param {{refreshToken: *}} refreshToken
 * @returns {Promise<AxiosResponse<T>>}
 */
export const sendRefreshToken = async (refreshToken) => {
    /**
     *
     * @type {SessionStorage}
     */
    const storage = initService(SessionStorage);
    const API = `${Http.api.common}${LINK_TO_REFRESH_TOKEN_API}`;
    const response = await axios.put(API, refreshToken);

    storage.setSession(response.data.session);

    return response;
};
