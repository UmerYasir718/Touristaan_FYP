import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const Unauthorized = ({ auth: { user } }) => {
  return (
    <div className="py-5">
      <Container className="text-center">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <div className="mb-4">
              <i className="fas fa-exclamation-triangle text-warning display-1"></i>
            </div>
            <h1 className="display-4 mb-4">Access Denied</h1>
            <p className="lead mb-4">
              Sorry, you don't have permission to access this page.
            </p>
            <p className="mb-5">
              {user ? (
                `Your current role (${user.role}) doesn't have the necessary permissions to view this content.`
              ) : (
                'Please log in to access this content.'
              )}
            </p>
            <div className="d-grid gap-3 d-md-flex justify-content-md-center">
              <Button as={Link} to="/" variant="primary" size="lg">
                Go to Home
              </Button>
              {!user && (
                <Button as={Link} to="/login" variant="outline-primary" size="lg">
                  Log In
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Unauthorized);
