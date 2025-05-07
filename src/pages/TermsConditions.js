import React from 'react';
import { Container, Accordion, Row, Col, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const TermsConditions = () => {
  return (
    <Container fluid className="p-0">
      {/* Header Banner */}
      <div className="bg-primary text-white py-5 mb-5">
        <Container>
          <Row className="align-items-center">
            <Col md={4} className="text-center text-md-start">
              <Image 
                src="https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" 
                alt="Touristaan Logo" 
                width="150" 
                height="150" 
                roundedCircle 
                className="bg-white p-2 mb-3 mb-md-0"
              />
            </Col>
            <Col md={8} className="text-center text-md-start">
              <h1 className="display-3 fw-bold">Touristaan</h1>
              <h2 className="fs-2 fw-light">Terms & Conditions</h2>
              <p className="lead mb-0">Please read these terms carefully before using our services.</p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-4">
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="border-0 mb-5">
              <div className="p-4">
                <p className="lead mb-5 text-center">
                  Welcome to Touristaan. These Terms and Conditions govern your use of our website and services. 
                  By accessing or using our services, you agree to be bound by these terms. Please read them carefully.
                </p>
                
                <Accordion defaultActiveKey={['0', '1', '2', '3', '4', '5', '6']} alwaysOpen>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>1. Acceptance of Terms</Accordion.Header>
                    <Accordion.Body>
                      <p>By accessing and using the services provided by Touristaan, you agree to be bound by these Terms and Conditions, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
                      <p>If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.</p>
                    </Accordion.Body>
                  </Accordion.Item>
                  
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>2. Booking and Payments</Accordion.Header>
                    <Accordion.Body>
                      <h5>2.1 Booking Process</h5>
                      <p>All bookings are subject to availability and confirmation. A booking is confirmed once full payment has been received and a confirmation email has been sent to the customer.</p>
                      
                      <h5>2.2 Payment Terms</h5>
                      <p>Full payment is required at the time of booking. We accept payments via credit/debit cards and other payment methods as specified on our website.</p>
                      
                      <h5>2.3 Prices</h5>
                      <p>All prices are quoted in Pakistani Rupees (PKR) and are per person unless otherwise stated. Prices are subject to change without notice until a booking is confirmed.</p>
                      
                      <h5>2.4 Taxes and Fees</h5>
                      <p>All applicable taxes and fees are included in the quoted price unless otherwise stated.</p>
                    </Accordion.Body>
                  </Accordion.Item>
                  
                  <Accordion.Item eventKey="2">
                    <Accordion.Header>3. Cancellation and Refund Policy</Accordion.Header>
                    <Accordion.Body>
                      <h5>3.1 Cancellation by Customer</h5>
                      <p>Cancellations must be made in writing (email is acceptable). The following cancellation charges apply:</p>
                      <ul>
                        <li>More than 30 days before departure: 10% of total tour cost</li>
                        <li>15-30 days before departure: 25% of total tour cost</li>
                        <li>7-14 days before departure: 50% of total tour cost</li>
                        <li>Less than 7 days before departure: 100% of total tour cost</li>
                      </ul>
                      
                      <h5>3.2 Cancellation by Touristaan</h5>
                      <p>We reserve the right to cancel any tour due to unforeseen circumstances, such as natural disasters, political instability, or insufficient participants. In such cases, a full refund will be provided, or an alternative tour will be offered.</p>
                      
                      <h5>3.3 Refund Process</h5>
                      <p>Refunds will be processed within 14 business days of the cancellation being confirmed. Refunds will be made to the original payment method used for the booking.</p>
                    </Accordion.Body>
                  </Accordion.Item>
                  
                  <Accordion.Item eventKey="3">
                    <Accordion.Header>4. Travel Insurance</Accordion.Header>
                    <Accordion.Body>
                      <p>We strongly recommend that all customers purchase comprehensive travel insurance to cover unforeseen circumstances such as trip cancellation, medical emergencies, personal accidents, loss of baggage, and other travel-related risks.</p>
                      <p>Touristaan is not responsible for any losses, damages, or additional expenses incurred by the customer due to the absence of adequate travel insurance.</p>
                    </Accordion.Body>
                  </Accordion.Item>
                  
                  <Accordion.Item eventKey="4">
                    <Accordion.Header>5. Liability and Responsibility</Accordion.Header>
                    <Accordion.Body>
                      <h5>5.1 Limitation of Liability</h5>
                      <p>Touristaan acts as an agent for transportation companies, hotels, and other service providers and is not liable for any injury, damage, loss, accident, delay, or irregularity that may be caused by defect or default of any company or person engaged in providing these services.</p>
                      
                      <h5>5.2 Force Majeure</h5>
                      <p>Touristaan is not liable for any delay, change in schedule, or loss caused by weather conditions, civil disturbances, acts of God, or any other factors beyond our control.</p>
                      
                      <h5>5.3 Customer Responsibility</h5>
                      <p>Customers are responsible for ensuring they have valid travel documents, including passports, visas, and health certificates, as required for their tour. Customers are also responsible for their personal behavior and must comply with local laws and regulations.</p>
                    </Accordion.Body>
                  </Accordion.Item>
                  
                  <Accordion.Item eventKey="5">
                    <Accordion.Header>6. Intellectual Property</Accordion.Header>
                    <Accordion.Body>
                      <h5>6.1 Copyright</h5>
                      <p>All content on this website, including text, graphics, logos, images, audio clips, and software, is the property of Touristaan or its content suppliers and is protected by international copyright laws.</p>
                      
                      <h5>6.2 Trademarks</h5>
                      <p>The Touristaan name and logo are trademarks of Touristaan. Other trademarks, service marks, graphics, and logos used in connection with our website may be the trademarks of other third parties. Your use of our website grants you no right or license to reproduce or otherwise use any Touristaan or third-party trademarks.</p>
                      
                      <h5>6.3 Use of Content</h5>
                      <p>You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our website without our prior written consent.</p>
                    </Accordion.Body>
                  </Accordion.Item>
                  
                  <Accordion.Item eventKey="6">
                    <Accordion.Header>7. Modifications to Terms and Conditions</Accordion.Header>
                    <Accordion.Body>
                      <p>Touristaan reserves the right to modify these Terms and Conditions at any time without prior notice. The current version will be posted on our website, and the revised terms will apply to all bookings made after the posting date.</p>
                      <p>It is your responsibility to check these Terms and Conditions periodically for changes. Your continued use of our services following the posting of changes constitutes your acceptance of such changes.</p>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
                
                <div className="mt-5 pt-4 border-top">
                  <h4>Contact Us</h4>
                  <p>If you have any questions about these Terms and Conditions, please contact us at:</p>
                  <address>
                    <strong>Touristaan</strong><br />
                    Email: <a href="mailto:info@touristaan.com">info@touristaan.com</a><br />
                    Phone: +92 300 1234567<br />
                    Address: 123 Tourism Street, Islamabad, Pakistan
                  </address>
                </div>
                
                <div className="d-flex justify-content-between mt-5 pt-4 border-top">
                  <Link to="/privacy-policy" className="btn btn-outline-primary">Privacy Policy</Link>
                  <Link to="/" className="btn btn-primary">Back to Home</Link>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default TermsConditions;
