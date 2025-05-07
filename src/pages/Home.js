import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
} from "react-bootstrap";

const Home = () => {
  return (
    <>
      {/* Hero Section - Full width, no container constraints */}
      <div
        className="hero-container position-relative"
        style={{
          background: "linear-gradient(120deg, #2c5282 60%, #4299e1 100%)",
          minHeight: "75vh",
          overflow: "hidden",
        }}
      >
        <Container className="hero-content py-5">
          <h1 className="hero-title display-3 fw-bold mb-3 animate__animated animate__fadeInDown">
            Welcome to <span style={{ color: "#f6ad55" }}>Touristaan</span>
          </h1>
          <p className="hero-subtitle lead mb-4 animate__animated animate__fadeInUp">
            Your gateway to unforgettable travel experiences. Explore, plan, and
            book the best tours worldwide.
          </p>
          <div className="d-flex justify-content-center gap-3 mb-4 animate__animated animate__fadeInUp animate__delay-1s">
            <Button variant="primary" size="lg" href="/packages">
              Explore Tours
            </Button>
            <Button variant="outline-light" size="lg" href="/contact">
              Contact Us
            </Button>
          </div>
          <div className="search-container animate__animated animate__fadeInUp animate__delay-2s">
            <InputGroup
              className="mb-3 rounded bg-white p-2"
              style={{ maxWidth: 600, margin: "0 auto" }}
            >
              <Form.Control
                placeholder="Search for tours, cities or places..."
                aria-label="Search"
              />
              <Button variant="primary" id="button-search">
                <i className="fas fa-search"></i>
              </Button>
            </InputGroup>
          </div>
        </Container>
        <img
          src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
          alt="Travel"
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "30%",
            opacity: 0.25,
          }}
        />
      </div>

      {/* Why Choose Us Section - Full width with proper container-fluid */}
      <section className="py-5 bg-light">
        <div className="container-fluid px-4 px-md-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Why Choose Touristaan?</h2>
            <p className="lead">We make your travel experience unforgettable</p>
          </div>
          <Row className="align-items-center justify-content-center">
            <Col lg={5} className="mb-4 mb-lg-0">
              <img
                src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Why Choose Us"
                className="img-fluid rounded"
                style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
              />
            </Col>
            <Col lg={5} className="ps-lg-5">
              <div className="feature-item d-flex align-items-start mb-4">
                <div className="feature-icon me-3">
                  <span
                    className="bg-primary text-white d-inline-flex align-items-center justify-content-center rounded-circle"
                    style={{ width: "50px", height: "50px" }}
                  >
                    <i className="fas fa-check-circle fa-lg"></i>
                  </span>
                </div>
                <div>
                  <h4 className="mb-2">Curated Tour Packages</h4>
                  <p className="text-muted">
                    Handpicked destinations and carefully planned itineraries
                    for the best experience.
                  </p>
                </div>
              </div>
              <div className="feature-item d-flex align-items-start mb-4">
                <div className="feature-icon me-3">
                  <span
                    className="bg-primary text-white d-inline-flex align-items-center justify-content-center rounded-circle"
                    style={{ width: "50px", height: "50px" }}
                  >
                    <i className="fas fa-headset fa-lg"></i>
                  </span>
                </div>
                <div>
                  <h4 className="mb-2">24/7 Support</h4>
                  <p className="text-muted">
                    Real-time assistance and support throughout your journey for
                    a worry-free experience.
                  </p>
                </div>
              </div>
              <div className="feature-item d-flex align-items-start mb-4">
                <div className="feature-icon me-3">
                  <span
                    className="bg-primary text-white d-inline-flex align-items-center justify-content-center rounded-circle"
                    style={{ width: "50px", height: "50px" }}
                  >
                    <i className="fas fa-wallet fa-lg"></i>
                  </span>
                </div>
                <div>
                  <h4 className="mb-2">Easy Booking & Payment</h4>
                  <p className="text-muted">
                    Simple online booking process with secure payment options
                    for your convenience.
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Featured Destinations - Full width with container-fluid */}
      <section
        className="py-5"
        style={{ background: "linear-gradient(180deg, #fff 0%, #f8f9fa 100%)" }}
      >
        <div className="container-fluid px-4 px-md-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Featured Destinations</h2>
            <p className="lead">Explore our most popular tour destinations</p>
          </div>
          <Row className="g-4">
            <Col md={4} className="d-flex">
              <Card
                className="w-100 border-0 destination-card overflow-hidden"
                style={{ borderRadius: "15px", transition: "all 0.3s ease" }}
              >
                <div
                  style={{
                    height: "280px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <Card.Img
                    variant="top"
                    src="https://images.unsplash.com/photo-1589553416260-f586c8f1514f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
                    alt="Swat Valley"
                    style={{
                      objectFit: "cover",
                      height: "100%",
                      width: "100%",
                      transition: "transform 0.5s ease",
                    }}
                  />
                  <div
                    className="position-absolute bottom-0 start-0 w-100 p-3"
                    style={{
                      background:
                        "linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
                    }}
                  >
                    <h3 className="text-white mb-0">Swat Valley</h3>
                    <p className="text-white-50 mb-0">
                      <i className="fas fa-map-marker-alt me-2"></i>Northern
                      Pakistan
                    </p>
                  </div>
                </div>
                <Card.Body>
                  <Card.Text>
                    Known as the 'Switzerland of Pakistan', Swat Valley offers
                    breathtaking landscapes, lush green meadows, and
                    crystal-clear rivers.
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-primary fw-bold">
                      Starting from 45,000 PKR
                    </span>
                    <Button variant="outline-primary" href="/packages">
                      Explore
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="d-flex">
              <Card
                className="w-100 border-0 destination-card overflow-hidden"
                style={{ borderRadius: "15px", transition: "all 0.3s ease" }}
              >
                <div
                  style={{
                    height: "280px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <Card.Img
                    variant="top"
                    src="https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
                    alt="Hunza Valley"
                    style={{
                      objectFit: "cover",
                      height: "100%",
                      width: "100%",
                      transition: "transform 0.5s ease",
                    }}
                  />
                  <div
                    className="position-absolute bottom-0 start-0 w-100 p-3"
                    style={{
                      background:
                        "linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
                    }}
                  >
                    <h3 className="text-white mb-0">Hunza Valley</h3>
                    <p className="text-white-50 mb-0">
                      <i className="fas fa-map-marker-alt me-2"></i>
                      Gilgit-Baltistan
                    </p>
                  </div>
                </div>
                <Card.Body>
                  <Card.Text>
                    Home to ancient forts, stunning mountain peaks, and the
                    famous Attabad Lake with its turquoise waters.
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-primary fw-bold">
                      Starting from 55,000 PKR
                    </span>
                    <Button variant="outline-primary" href="/packages">
                      Explore
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="d-flex">
              <Card
                className="w-100 border-0 destination-card overflow-hidden"
                style={{ borderRadius: "15px", transition: "all 0.3s ease" }}
              >
                <div
                  style={{
                    height: "280px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <Card.Img
                    variant="top"
                    src="https://images.unsplash.com/photo-1589553416260-f586c8f1514f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
                    alt="Neelum Valley"
                    style={{
                      objectFit: "cover",
                      height: "100%",
                      width: "100%",
                      transition: "transform 0.5s ease",
                    }}
                  />
                  <div
                    className="position-absolute bottom-0 start-0 w-100 p-3"
                    style={{
                      background:
                        "linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
                    }}
                  >
                    <h3 className="text-white mb-0">Neelum Valley</h3>
                    <p className="text-white-50 mb-0">
                      <i className="fas fa-map-marker-alt me-2"></i>Azad Kashmir
                    </p>
                  </div>
                </div>
                <Card.Body>
                  <Card.Text>
                    A paradise for nature lovers with dense forests, flowing
                    rivers, and stunning mountain views in Kashmir.
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-primary fw-bold">
                      Starting from 50,000 PKR
                    </span>
                    <Button variant="outline-primary" href="/packages">
                      Explore
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* Services Section with unique design */}
      <section className="py-5" style={{ background: "#fff" }}>
        <div className="container-fluid px-4 px-md-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Our Services</h2>
            <p className="lead">
              We offer the best travel services for your journey
            </p>
          </div>
          <Row className="g-4 justify-content-center">
            <Col md={4} className="d-flex">
              <Card
                className="service-card w-100 border-0 p-4 h-100"
                style={{ borderRadius: "15px", transition: "all 0.3s ease" }}
              >
                <div className="text-center mb-4">
                  <div
                    className="service-icon-wrapper d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 mb-3"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <i className="fas fa-map-marked-alt fa-2x text-primary"></i>
                  </div>
                  <h3 className="fw-bold">Explore Tours</h3>
                </div>
                <Card.Body className="d-flex flex-column p-0">
                  <Card.Text className="flex-grow-1 text-center">
                    Discover amazing tours and destinations worldwide. Find the
                    perfect adventure for your next trip.
                  </Card.Text>
                  <div className="mt-auto pt-3 text-center">
                    <Button variant="outline-primary" href="/packages">
                      View Tours
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="d-flex">
              <Card
                className="service-card w-100 border-0 p-4 h-100"
                style={{ borderRadius: "15px", transition: "all 0.3s ease" }}
              >
                <div className="text-center mb-4">
                  <div
                    className="service-icon-wrapper d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 mb-3"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <i className="fas fa-route fa-2x text-primary"></i>
                  </div>
                  <h3 className="fw-bold">Plan Itinerary</h3>
                </div>
                <Card.Body className="d-flex flex-column p-0">
                  <Card.Text className="flex-grow-1 text-center">
                    Create a custom travel plan with our interactive tools and
                    recommendations from experienced travelers.
                  </Card.Text>
                  <div className="mt-auto pt-3 text-center">
                    <Button variant="outline-primary">Plan Now</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="d-flex">
              <Card
                className="service-card w-100 border-0 p-4 h-100"
                style={{ borderRadius: "15px", transition: "all 0.3s ease" }}
              >
                <div className="text-center mb-4">
                  <div
                    className="service-icon-wrapper d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 mb-3"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <i className="fas fa-star fa-2x text-primary"></i>
                  </div>
                  <h3 className="fw-bold">24/7 Assistance</h3>
                </div>
                <Card.Body className="d-flex flex-column p-0">
                  <Card.Text className="flex-grow-1 text-center">
                    Never get lost with our real-time navigation and emergency
                    assistance available 24/7 during your trip.
                  </Card.Text>
                  <div className="mt-auto pt-3 text-center">
                    <Button variant="outline-primary">Learn More</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* Testimonials Section with unique design */}
      <section
        className="py-5"
        style={{
          background: "linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)",
        }}
      >
        <div className="container-fluid px-4 px-md-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold">What Our Travelers Say</h2>
            <p className="lead">
              Read testimonials from our satisfied customers
            </p>
          </div>
          <Row className="justify-content-center">
            <Col lg={10}>
              <Row className="g-4">
                <Col md={6} className="d-flex">
                  <Card
                    className="w-100 border-0 p-4 testimonial-card"
                    style={{
                      borderRadius: "15px",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Card.Body className="d-flex flex-column">
                      <div className="mb-3 text-warning">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                      </div>
                      <blockquote className="blockquote mb-3">
                        <p className="fs-5 fst-italic">
                          "Touristaan made my trip to Swat Valley unforgettable!
                          Everything was perfectly organized, from
                          transportation to accommodations. The guides were
                          knowledgeable and friendly."
                        </p>
                      </blockquote>
                      <div className="d-flex align-items-center mt-auto">
                        <div
                          className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-3"
                          style={{
                            width: "50px",
                            height: "50px",
                            color: "white",
                          }}
                        >
                          <span className="fw-bold">AR</span>
                        </div>
                        <div>
                          <h5 className="mb-0">Ali Raza</h5>
                          <p className="text-muted mb-0">
                            Swat Valley Tour, 2025
                          </p>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6} className="d-flex">
                  <Card
                    className="w-100 border-0 p-4 testimonial-card"
                    style={{
                      borderRadius: "15px",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Card.Body className="d-flex flex-column">
                      <div className="mb-3 text-warning">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                      </div>
                      <blockquote className="blockquote mb-3">
                        <p className="fs-5 fst-italic">
                          "Excellent service and support throughout our Kashmir
                          tour. The team was responsive to all our needs and the
                          itinerary was perfect. Highly recommended for family
                          trips!"
                        </p>
                      </blockquote>
                      <div className="d-flex align-items-center mt-auto">
                        <div
                          className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-3"
                          style={{
                            width: "50px",
                            height: "50px",
                            color: "white",
                          }}
                        >
                          <span className="fw-bold">SK</span>
                        </div>
                        <div>
                          <h5 className="mb-0">Sara Khan</h5>
                          <p className="text-muted mb-0">Kashmir Tour, 2025</p>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </section>

      {/* Call to Action - Full width with unique design */}
      <section
        className="py-5"
        style={{
          background: "linear-gradient(120deg, #2c5282 0%, #4299e1 100%)",
          color: "white",
        }}
      >
        <div className="container-fluid px-4 px-md-5">
          <Row className="align-items-center justify-content-center py-4">
            <Col lg={6} className="text-center text-lg-start mb-4 mb-lg-0">
              <h2 className="fw-bold mb-3">Ready to Start Your Adventure?</h2>
              <p className="lead mb-0">
                Book your dream tour today and create memories that last a
                lifetime
              </p>
            </Col>
            <Col lg={4} className="text-center text-lg-end">
              <Button
                variant="light"
                size="lg"
                className="px-4 py-3"
                href="/packages"
              >
                <i className="fas fa-compass me-2"></i> Explore Tours Now
              </Button>
            </Col>
          </Row>
        </div>
      </section>
    </>
  );
};

export default Home;
