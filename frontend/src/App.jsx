import PropTypes from "prop-types";
import React from "react";

import { Navigate, Route, Routes } from "react-router-dom";
import { connect } from "react-redux";

import AuthRoutes from "./groups/auth";

import PrivateRoute from "./base/components/PrivateRoute";

import "./assets/scss/theme.scss";

import AppRoutes from "./groups/app";
import ErrorBoundary from "./base/components/ErrorBoundary";
import { AUTH_GROUP_ROUTES } from "./groups/auth/config";
import { APP_GROUP_LINKS, APP_GROUP_ROUTES } from "./groups/app/config";
import { ToastElement } from "./services/ToastService";

const App = () => {
    return (
        <ErrorBoundary>
            <Routes>
                <Route path={AUTH_GROUP_ROUTES.BASE} element={<AuthRoutes/>}/>
                <Route path={APP_GROUP_ROUTES.BASE} element={<PrivateRoute component={AppRoutes}/>}/>
                <Route path="/" element={<Navigate to={APP_GROUP_LINKS.BASE}/>}/>
                <Route path="*" element={<Navigate to={APP_GROUP_LINKS.BASE}/>}/>
            </Routes>
            <ToastElement/>
        </ErrorBoundary>
    );
};

App.propTypes = {
    layout: PropTypes.any,
};

AppRoutes.propTypes = {
    match: PropTypes.object,
};

const mapStateToProps = (state) => {
    return {
        layout: state.Layout,
    };
};

export default connect(mapStateToProps)(App);
