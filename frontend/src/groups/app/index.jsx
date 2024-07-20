import VerticalLayout from "../../base/components/VerticalLayout";
import { Route, Routes, Navigate } from "react-router-dom";
import React from "react";
import ErrorBoundary from "../../base/components/ErrorBoundary";
import { APP_GROUP_LINKS, APP_GROUP_ROUTES } from "./config";
import UserSegments from "./UserSegments";


const AppRoutes = () => {

  return (
    <VerticalLayout>
      <ErrorBoundary>
        <Routes>
          <Route path={APP_GROUP_ROUTES.USER_SEGMENTS} element={<UserSegments />}/>

          <Route path="/" element={<Navigate to={APP_GROUP_LINKS.USER_SEGMENTS}/>}/>
        </Routes>
      </ErrorBoundary>
    </VerticalLayout>
  );
};

export default AppRoutes;
