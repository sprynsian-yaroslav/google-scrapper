import React, { useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";

import Login from "./pages/Login";
import Logout from "./pages/Logout";

import { AUTH_GROUP_LINKS, AUTH_GROUP_ROUTES } from "./config";
import { APP_GROUP_LINKS } from "../app/config";
import SessionStorage from "../../services/SessionStorage";
import { useService } from "../../base/hooks/useService";

export default function AuthRoutes() {
    /**
     * @type {SessionStorage}
     */
    const storage = useService(SessionStorage);
    const navigate = useNavigate()

    const { accessToken } = storage.getSession();

    useEffect(() => {
        if (accessToken) {
            navigate(APP_GROUP_LINKS.BASE)
        }
    }, [accessToken]);

    return (
        <Routes>
            <Route
                path={AUTH_GROUP_ROUTES.LINK_LOGIN}
                element={<Login/>}
            />

            <Route
                path={AUTH_GROUP_ROUTES.LINK_LOG_OUT}
                element={<Logout/>}
            />

            <Route
                element={<Navigate to={AUTH_GROUP_LINKS.LINK_LOGIN} replace/>}
            />
        </Routes>
    );
}
