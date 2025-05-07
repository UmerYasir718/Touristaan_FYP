import React from 'react';
import { Container, Accordion, Row, Col, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
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
              <h2 className="fs-2 fw-light">Privacy Policy</h2>
              <p className="lead mb-0">How we protect and manage your information</p>
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
                  At Touristaan, we value your privacy and are committed to protecting your personal information. 
                  This Privacy Policy explains how we collect, use, and safeguard your data when you use our website and services.
                </p>
                
                <Accordion defaultActiveKey={['0', '1', '2', '3', '4', '5']} alwaysOpen>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>1. Information We Collect</Accordion.Header>
                    <Accordion.Body>
                      <h5>1.1 Personal Information</h5>
                      <p>We may collect the following personal information when you use our services:</p>
                      <ul>
                        <li>Contact information (name, email address, phone number, mailing address)</li>
                        <li>Payment information (credit card details, billing address)</li>
                        <li>Identity information (passport details, national ID, date of birth)</li>
                        <li>Travel preferences and requirements</li>
                        <li>Feedback and survey responses</li>
                        <li>Communications with us</li>
                      </ul>
                      
                      <h5>1.2 Automatically Collected Information</h5>
                      <p>When you visit our website, we may automatically collect certain information, including:</p>
                      <ul>
                        <li>IP address and device information</li>
                        <li>Browser type and settings</li>
                        <li>Referring website</li>
                        <li>Pages viewed and actions taken on our website</li>
                        <li>Date and time of visits</li>
                        <li>Cookie data</li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                  
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>2. How We Use Your Information</Accordion.Header>
                    <Accordion.Body>
                      <p>We use your personal information for the following purposes:</p>
                      <ul>
                        <li>To process and manage your bookings</li>
                        <li>To communicate with you about your travel arrangements</li>
                        <li>To process payments</li>
                        <li>To provide customer support</li>
                        <li>To send you promotional offers and newsletters (if you have opted in)</li>
                        <li>To improve our website and services</li>
                        <li>To comply with legal obligations</li>
                        <li>To prevent fraud and ensure security</li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                  
                  <Accordion.Item eventKey="2">
                    <Accordion.Header>3. Information Sharing and Disclosure</Accordion.Header>
                    <Accordion.Body>
                      <h5>3.1 Service Providers</h5>
                      <p>We may share your information with third-party service providers who perform services on our behalf, such as:</p>
                      <ul>
                        <li>Hotels, airlines, and other travel service providers</li>
                        <li>Payment processors</li>
                        <li>Customer service providers</li>
                        <li>Marketing and analytics partners</li>
                        <li>IT and cloud service providers</li>
                      </ul>
                      <p>These service providers are only authorized to use your information as necessary to provide services to us and are required to maintain the confidentiality of your information.</p>
                      
                      <h5>3.2 Legal Requirements</h5>
                      <p>We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).</p>
                      
                      <h5>3.3 Business Transfers</h5>
                      <p>If Touristaan is involved in a merger, acquisition, or sale of all or a portion of its assets, your information may be transferred as part of that transaction. We will notify you via email and/or a prominent notice on our website of any change in ownership or uses of your personal information.</p>
                    </Accordion.Body>
                  </Accordion.Item>
                  
                  <Accordion.Item eventKey="3">
                    <Accordion.Header>4. Cookies and Tracking Technologies</Accordion.Header>
                    <Accordion.Body>
                      <h5>4.1 What Are Cookies</h5>
                      <p>Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.</p>
                      
                      <h5>4.2 How We Use Cookies</h5>
                      <p>We use cookies and similar tracking technologies for the following purposes:</p>
                      <ul>
                        <li>Essential cookies: These are necessary for the website to function properly</li>
                        <li>Analytical/performance cookies: These help us understand how visitors interact with our website</li>
                        <li>Functionality cookies: These remember your preferences and settings</li>
                        <li>Targeting/advertising cookies: These help us deliver relevant advertisements</li>
                      </ul>
                      
                      <h5>4.3 Managing Cookies</h5>
                      <p>You can control and manage cookies in various ways. Most web browsers allow you to manage your cookie preferences. You can:</p>
                      <ul>
                        <li>Delete cookies from your device</li>
                        <li>Block cookies by activating the setting on your browser that allows you to refuse all or some cookies</li>
                        <li>Set your browser to notify you when you receive a cookie</li>
                      </ul>
                      <p>Please note that if you choose to block or delete cookies, you may not be able to access certain areas or features of our website, and some services may not function properly.</p>
                    </Accordion.Body>
                  </Accordion.Item>
                  
                  <Accordion.Item eventKey="4">
                    <Accordion.Header>5. Data Security</Accordion.Header>
                    <Accordion.Body>
                      <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing, accidental loss, destruction, or damage. These measures include:</p>
                      <ul>
                        <li>Encryption of sensitive data</li>
                        <li>Secure Socket Layer (SSL) technology for payment transactions</li>
                        <li>Regular security assessments and updates</li>
                        <li>Access controls and authentication procedures</li>
                        <li>Staff training on data protection</li>
                      </ul>
                      <p>While we strive to protect your personal information, no method of transmission over the Internet or electronic storage is 100% secure. Therefore, we cannot guarantee absolute security.</p>
                    </Accordion.Body>
                  </Accordion.Item>
                  
                  <Accordion.Item eventKey="5">
                    <Accordion.Header>6. Your Rights and Choices</Accordion.Header>
                    <Accordion.Body>
                      <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
                      <ul>
                        <li>The right to access your personal information</li>
                        <li>The right to correct inaccurate or incomplete information</li>
                        <li>The right to request deletion of your personal information</li>
                        <li>The right to restrict or object to processing of your personal information</li>
                        <li>The right to data portability</li>
                        <li>The right to withdraw consent</li>
                      </ul>
                      <p>To exercise these rights, please contact us using the information provided in the "Contact Us" section below.</p>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
                
                <div className="mt-5 pt-4 border-top">
                  <h4>Contact Us</h4>
                  <p>If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:</p>
                  <address>
                    <strong>Touristaan</strong><br />
                    Email: <a href="mailto:privacy@touristaan.com">privacy@touristaan.com</a><br />
                    Phone: +92 300 1234567<br />
                    Address: 123 Tourism Street, Islamabad, Pakistan
                  </address>
                </div>
                
                <div className="d-flex justify-content-between mt-5 pt-4 border-top">
                  <Link to="/terms-conditions" className="btn btn-outline-primary">Terms & Conditions</Link>
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

export default PrivacyPolicy;
