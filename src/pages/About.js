import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';

const About = () => {
  const [counters, setCounters] = useState({
    travelers: 0,
    packages: 0,
    destinations: 0,
    support: 0
  });

  const targetCounters = {
    travelers: 5000,
    packages: 200,
    destinations: 50,
    support: 24
  };

  useEffect(() => {
    const duration = 2000; // 2 seconds for animation
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;
    
    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      
      setCounters({
        travelers: Math.floor(progress * targetCounters.travelers),
        packages: Math.floor(progress * targetCounters.packages),
        destinations: Math.floor(progress * targetCounters.destinations),
        support: Math.floor(progress * targetCounters.support)
      });
      
      if (frame === totalFrames) {
        clearInterval(timer);
      }
    }, frameDuration);
    
    return () => clearInterval(timer);
  }, [targetCounters.travelers, targetCounters.packages, targetCounters.destinations, targetCounters.support]);

  return (
    <div className="py-5">
      {/* Hero Section */}
      <div className="bg-primary text-white py-5 mb-5">
        <Container>
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h1 className="display-4 fw-bold mb-3">About Touristaan</h1>
              <p className="lead">Discover our story, mission, and the team behind Pakistan's premier travel platform.</p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Main Content */}
      <Container>
        <Row className="align-items-center mb-5">
          <Col lg={6} className="mb-4 mb-lg-0">
            <h2 className="fw-bold mb-4">Our Story</h2>
            <p className="fs-5">Touristaan was founded in 2023 with a simple mission: to make the beauty of Pakistan accessible to travelers worldwide. What began as a small startup has grown into the country's leading travel platform.</p>
            <p className="fs-5">We believe that travel should be more than just visiting places—it should be about creating meaningful connections, understanding different cultures, and making unforgettable memories.</p>
          </Col>
          <Col lg={6}>
            <Card className="border-0 shadow-enhanced overflow-hidden">
              <Card.Img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" alt="Our Story" style={{height: '350px', objectFit: 'cover'}} />
            </Card>
          </Col>
        </Row>

        {/* Mission & Values */}
        <Row className="mb-5">
          <Col lg={12} className="text-center mb-4">
            <h2 className="fw-bold">Our Mission & Values</h2>
            <p className="lead">Guided by our commitment to excellence and authentic experiences</p>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-lg">
              <Card.Body className="text-center p-4">
                <div className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                  <i className="fas fa-mountain fa-2x"></i>
                </div>
                <Card.Title className="fw-bold">Authentic Experiences</Card.Title>
                <Card.Text>We curate authentic travel experiences that showcase the true beauty and culture of each destination.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-lg">
              <Card.Body className="text-center p-4">
                <div className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                  <i className="fas fa-users fa-2x"></i>
                </div>
                <Card.Title className="fw-bold">Community Support</Card.Title>
                <Card.Text>We work with local communities to ensure tourism benefits the people who call our destinations home.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-lg">
              <Card.Body className="text-center p-4">
                <div className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                  <i className="fas fa-leaf fa-2x"></i>
                </div>
                <Card.Title className="fw-bold">Sustainable Tourism</Card.Title>
                <Card.Text>We're committed to promoting sustainable tourism practices that preserve Pakistan's natural beauty.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Team Section */}
        <Row className="mb-5 card-group-equal">
          <Col lg={12} className="text-center mb-4">
            <h2 className="fw-bold">Meet Our Team</h2>
            <p className="lead">The passionate individuals behind Touristaan</p>
          </Col>
          <Col md={4} className="mb-4 d-flex">
            <Card className="border-0 shadow-lg text-center w-100">
              <Card.Body className="p-4 d-flex flex-column">
                <div className="mb-3">
                  <Image src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&h=120&q=80" roundedCircle width={120} height={120} className="object-fit-cover border border-3 border-primary p-1" />
                </div>
                <Card.Title className="fw-bold">Ahmed Khan</Card.Title>
                <p className="text-muted">Founder & CEO</p>
                <p className="flex-grow-1">A travel enthusiast with over 15 years of experience exploring Pakistan's hidden gems.</p>
                <div className="mt-3">
                  <a href="https://www.linkedin.com/in/ahmedkhan" className="text-primary me-2"><i className="fab fa-linkedin fa-lg"></i></a>
                  <a href="https://twitter.com/ahmedkhan" className="text-primary me-2"><i className="fab fa-twitter fa-lg"></i></a>
                  <a href="mailto:ahmed@touristaan.com" className="text-primary"><i className="fas fa-envelope fa-lg"></i></a>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4 d-flex">
            <Card className="border-0 shadow-lg text-center w-100">
              <Card.Body className="p-4 d-flex flex-column">
                <div className="mb-3">
                  <Image src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&h=120&q=80" roundedCircle width={120} height={120} className="object-fit-cover border border-3 border-primary p-1" />
                </div>
                <Card.Title className="fw-bold">Sara Malik</Card.Title>
                <p className="text-muted">Head of Operations</p>
                <p className="flex-grow-1">Ensures every tour runs smoothly with her exceptional organizational skills and attention to detail.</p>
                <div className="mt-3">
                  <a href="https://www.linkedin.com/in/saramalik" className="text-primary me-2"><i className="fab fa-linkedin fa-lg"></i></a>
                  <a href="https://twitter.com/saramalik" className="text-primary me-2"><i className="fab fa-twitter fa-lg"></i></a>
                  <a href="mailto:sara@touristaan.com" className="text-primary"><i className="fas fa-envelope fa-lg"></i></a>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4 d-flex">
            <Card className="border-0 shadow-lg text-center w-100">
              <Card.Body className="p-4 d-flex flex-column">
                <div className="mb-3">
                  <Image src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&h=120&q=80" roundedCircle width={120} height={120} className="object-fit-cover border border-3 border-primary p-1" />
                </div>
                <Card.Title className="fw-bold">Imran Ali</Card.Title>
                <p className="text-muted">Lead Tour Guide</p>
                <p className="flex-grow-1">With deep knowledge of Pakistan's history and culture, Imran makes every tour educational and exciting.</p>
                <div className="mt-3">
                  <a href="https://www.linkedin.com/in/imranali" className="text-primary me-2"><i className="fab fa-linkedin fa-lg"></i></a>
                  <a href="https://twitter.com/imranali" className="text-primary me-2"><i className="fab fa-twitter fa-lg"></i></a>
                  <a href="mailto:imran@touristaan.com" className="text-primary"><i className="fas fa-envelope fa-lg"></i></a>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Stats Section */}
        <Row className="bg-light rounded-3 p-5 mb-5 text-center">
          <Col md={3} className="mb-3 mb-md-0">
            <h2 className="fw-bold text-primary counter-number">{counters.travelers}+</h2>
            <p className="text-muted">Happy Travelers</p>
          </Col>
          <Col md={3} className="mb-3 mb-md-0">
            <h2 className="fw-bold text-primary counter-number">{counters.packages}+</h2>
            <p className="text-muted">Tour Packages</p>
          </Col>
          <Col md={3} className="mb-3 mb-md-0">
            <h2 className="fw-bold text-primary counter-number">{counters.destinations}+</h2>
            <p className="text-muted">Destinations</p>
          </Col>
          <Col md={3}>
            <h2 className="fw-bold text-primary counter-number">{counters.support}+</h2>
            <p className="text-muted">Customer Support</p>
          </Col>
        </Row>

        {/* Call to Action */}
        <Row className="justify-content-center text-center">
          <Col md={8}>
            <h2 className="fw-bold mb-3">Ready to Explore Pakistan?</h2>
            <p className="lead mb-4">Join thousands of travelers who have discovered the beauty of Pakistan with Touristaan.</p>
            <a href="/packages" className="btn btn-primary btn-lg px-5">Browse Tour Packages</a>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default About;
