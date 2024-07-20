import React, { useEffect, useState } from 'react';
import {  Nav, NavItem, NavLink } from "reactstrap";
import classNames from "classnames";
import { PROGRAM_LIST_TABS, USER_SEGMENTS_LIST_TABS } from "./constants";
import ProgramsList from "./UserSegments";
import BaseLayoutWithCard from "../../../../base/components/BaseLayoutWithCard";
import PredefinedList from "./Attribute";
import { useNavigate } from "react-router-dom";
import UserSegmentsList from "./UserSegments";
import AttributesList from "./Attribute";


const breadcrumbs = {
    title: "User segments", breadcrumbItems: []
};

export default function List() {

    const [activeTab, updateActiveTab] = useState(USER_SEGMENTS_LIST_TABS.USER_SEGMENT);

    const tabComponents = {
        [USER_SEGMENTS_LIST_TABS.USER_SEGMENT]: <UserSegmentsList />,
        [USER_SEGMENTS_LIST_TABS.ATTRIBUTES]: <AttributesList />
    }

    let navigate = useNavigate();

    const clearQueryParams = () => {
        navigate(window.location.pathname, { replace: true });
    };

    useEffect(() => {
        clearQueryParams()
    }, [activeTab]);

    return (
            <BaseLayoutWithCard breadcrumbs={breadcrumbs} >
                            <Nav tabs className="nav-tabs-custom mt-1">
                                {Object.values(USER_SEGMENTS_LIST_TABS).map((label, index) => (
                                    <NavItem key={`navItem${index}`}>
                                        <NavLink
                                            className={classNames(
                                                {
                                                    active: activeTab === label
                                                },
                                                "cursor-pointer py-1 mx-1"
                                            )}
                                            onClick={() => updateActiveTab(label)}
                                        >
                                            <span>{label}</span>
                                        </NavLink>
                                    </NavItem>
                                ))}
                            </Nav>

                            {tabComponents[activeTab]}
            </BaseLayoutWithCard>
    );
}
