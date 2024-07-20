import React from 'react';

import { CONDITION_RELATION_TYPES } from "../../../constants/conditions";
import classnames from "classnames";
import classes from "./LogicalRelationSelector.module.scss";

export const LogicalRelationSelector = ({ value, setValue }) => {
    return <div className={classes.LogicalRelationWrapper}>
        <div
            className={classnames(classes.Button, value === CONDITION_RELATION_TYPES.AND && classes.Active)}
            onClick={() => setValue(CONDITION_RELATION_TYPES.AND)}
        >
            AND
        </div>
        <div
            className={classnames(classes.Button, value === CONDITION_RELATION_TYPES.OR && classes.Active)}
            onClick={() => setValue(CONDITION_RELATION_TYPES.OR)}
        >
            OR
        </div>
    </div>;

};