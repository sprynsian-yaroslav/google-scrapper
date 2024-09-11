import React from 'react';
import { Container } from 'reactstrap';
import { Route, Routes } from 'react-router-dom';

import { KEYWORDS_GROUP_ROUTES } from './config';

import KeywordsList from "./List";
import KeywordDetails from "./KeywordDetails";

export default function Keywords() {
    return (
        <Container fluid className="content">
            <Routes>
                <Route
                    path={KEYWORDS_GROUP_ROUTES.LIST}
                    element={<KeywordsList/>}
                />
            </Routes>
            <Routes>
                <Route
                    path={KEYWORDS_GROUP_ROUTES.DETAILS}
                    element={<KeywordDetails/>}
                />
            </Routes>
        </Container>
    );
}