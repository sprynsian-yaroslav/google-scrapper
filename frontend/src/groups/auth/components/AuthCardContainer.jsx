import React from 'react'
import PageMeta from '../../../base/components/MetaTags';
import { Row, Col, Container } from 'reactstrap';
import PropTypes from 'prop-types'

export default function AuthCardContainer({
    children,
    metaText,
}) {
    return (
        <div className="account-pages">
            <Container>
                {/*<PageMeta title={metaText} />*/}
                <Row className="justify-content-center">
                    <Col md={8} lg={6} xl={5}>
                        {children}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

AuthCardContainer.propTypes = {
    children: PropTypes.any,
    metaText: PropTypes.string,
};
