import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Logout from "./pages/Logout";

import { AUTH_GROUP_LINKS, AUTH_GROUP_ROUTES } from "./config";

export default function AuthRoutes() {
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
