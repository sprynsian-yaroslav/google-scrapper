import React from 'react'
import { Row, Col } from 'reactstrap';
import PropTypes from 'prop-types'
import joinClassNames from "../../../base/helpers/joinClassNames";

export default function AuthHeader({
    headerText,
    description,
    icon,
    className = "",
    columnWidth = 7
}) {
    return (
        <div className={joinClassNames("bg-primary bg-soft", className)}>
            <Row>
                <Col xs={columnWidth}>
                    <div className="text-primary p-4">
                        <h5 className="text-primary">{headerText}</h5>
                        <p>{description}</p>
                    </div>
                </Col>
                <Col className="col-5 align-self-end">
                    <img src={icon} alt="" className="img-fluid" />
                </Col>
            </Row>
        </div>
    );
}

AuthHeader.propTypes = {
    headerText: PropTypes.string,
    description: PropTypes.string,
    icon: PropTypes.any,
}