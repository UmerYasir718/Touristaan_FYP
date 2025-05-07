import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const PaymentCancel = () => {
  const navigate = useNavigate();
  
  const handleTryAgain = () => {
    // Go back to the previous page (checkout page)
    navigate(-1);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg border-0 text-center">
            <Card.Body className="p-5">
              <div className="mb-4 text-danger">
                <i className="fas fa-times-circle fa-5x"></i>
              </div>
              <h2 className="fw-bold text-danger mb-3">Payment Cancelled</h2>
              <p className="fs-5 mb-4">
                Your payment process was cancelled or could not be completed.
                No charges have been made to your account.
              </p>
              <div className="d-grid gap-3">
                <Button variant="primary" size="lg" onClick={handleTryAgain}>
                  Try Again
                </Button>
                <Button as={Link} to="/packages" variant="outline-primary">
                  Browse Other Tours
                </Button>
                <Button as={Link} to="/" variant="outline-secondary">
                  Return to Home
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentCancel;
