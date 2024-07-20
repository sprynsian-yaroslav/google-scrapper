import React from 'react';
import { Container } from 'reactstrap';
import { Route, Routes } from 'react-router-dom';

import { USER_SEGMENTS_GROUP_ROUTES } from './config';

import List from './List';
import { CreateEditUserSegment } from "./CreateEditUserSegment";

export default function UserSegments() {
    return (
        <Container fluid className="content">
            <Routes>
                <Route
                    path={USER_SEGMENTS_GROUP_ROUTES.LIST}
                    element={<List/>}
                />
                <Route
                    path={USER_SEGMENTS_GROUP_ROUTES.CREATE_EDIT_SEGMENTS}
                    element={<CreateEditUserSegment/>}
                />
            </Routes>
        </Container>
    );
}