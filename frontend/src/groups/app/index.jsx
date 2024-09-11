import VerticalLayout from "../../base/components/VerticalLayout";
import { Route, Routes, Navigate } from "react-router-dom";
import React from "react";
import ErrorBoundary from "../../base/components/ErrorBoundary";
import { APP_GROUP_LINKS, APP_GROUP_ROUTES } from "./config";
import Keywords from "./Keywords";


const AppRoutes = () => {

    console.log("dwadawdw")

  return (
    <VerticalLayout>
      <ErrorBoundary>
        <Routes>
          <Route path={APP_GROUP_ROUTES.KEYWORDS} element={<Keywords />}/>

          <Route path="/" element={<Navigate to={APP_GROUP_LINKS.KEYWORDS}/>}/>
        </Routes>
      </ErrorBoundary>
    </VerticalLayout>
  );
};

export default AppRoutes;
