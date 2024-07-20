import React, { useCallback } from 'react';
import { Container, Row, Col } from "reactstrap";

import error from '../../../../assets/images/error-img.png'

const Fallback = () => {
  const handleReload = useCallback(() => {
    window?.location.reload();
  }, []);

  return (
    <div className="account-pages">
      <Container>
        <Row>
          <Col lg="12">
            <div className="text-center mb-5">
              <h4 className="text-uppercase">Something went wrong</h4>
              <div className="mt-5 text-center">
                <button 
                  onClick={handleReload} 
                  className="btn btn-primary waves-effect waves-light"
                >
                  Reload application
                </button>
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
  )
};

export default Fallback;