import React from "react";
import {Navigate} from "react-router-dom";
import PropTypes from "prop-types";
import {useService} from "../hooks/useService";
import SessionStorage from "../../services/SessionStorage";

export default function PrivateRoute({component: Component, ...props}) {
  /**
   * @type {SessionStorage}
   */
  const storage = useService(SessionStorage);
  const {accessToken} = storage.getSession();
  return accessToken ?
    <Component {...props} />
    :
    <Navigate to="/auth/logout" replace/>
}

PrivateRoute.propTypes = {
  component: PropTypes.func,
};
