import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const services = [
  {icon: 'fa-map-marked-alt', title: 'Browse Tours', desc: 'Discover amazing tours and destinations worldwide.'},
  {icon: 'fa-route', title: 'Plan Itinerary', desc: 'Create a custom travel plan with our interactive tools.'},
  {icon: 'fa-star', title: 'Book Navigation', desc: 'Real-time navigation and emergency assistance during your trip.'},
  {icon: 'fa-headset', title: 'Live Support', desc: 'Get real-time support and assistance from our team.'},
  {icon: 'fa-landmark', title: 'Landmarks', desc: 'Visit famous landmarks with detailed info and reviews.'}
];

const Services = () => (
  <Container className="py-5">
    <h2 className="text-center fw-bold mb-4">Our Services</h2>
    <Row className="justify-content-center">
      {services.map((s, idx) => (
        <Col md={4} className="mb-4 d-flex" key={idx}>
          <Card className="h-100 border-0 shadow-lg flex-fill text-center p-4">
            <div className="service-icon mb-3"><i className={`fas ${s.icon} fa-2x text-primary`}></i></div>
            <Card.Title>{s.title}</Card.Title>
            <Card.Text>{s.desc}</Card.Text>
          </Card>
        </Col>
      ))}
    </Row>
  </Container>
);

export default Services;
