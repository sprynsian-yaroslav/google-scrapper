import React from 'react';
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

//Import Images
import error from "../../../assets/images/error-img.png";

const Page404 = () => {
    return (
        <div className="account-pages">
            <Container>
                <Row>
                    <Col lg="12">
                        <div className="text-center mb-5">
                            <h1 className="display-2 font-weight-medium">4<i className="bx bx-buoy bx-spin text-primary display-3"/>4</h1>
                            <h4 className="text-uppercase">Sorry, page not found</h4>
                            <div className="mt-5 text-center">
                                <Link className="btn btn-primary waves-effect waves-light" to="/app">Back to App</Link>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col md="8" xl="6">
                        <div>
                            <img src={error} alt="" className="img-fluid" />
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Page404;
