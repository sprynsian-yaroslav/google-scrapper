import React from 'react';
import Breadcrumb from "./Common/Breadcrumb2";
import { Card, CardBody, Col, Row } from "reactstrap";
import PageSpinner from "./PageSpinner";

export default function BaseLayoutWithCard({
  breadcrumbs,
  loading,
  cardClassName,
  children,
  linkBack
}) {
  return (
    <>
      <Breadcrumb {...breadcrumbs} linkBack={linkBack} />
      <Row>
        <Col lg="12">
          <Card>
            <CardBody className={cardClassName}>
              {loading ? <PageSpinner /> : children}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}