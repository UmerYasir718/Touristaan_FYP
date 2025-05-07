import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Alert, Tabs, Tab, Spinner, InputGroup } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { 
  getSiteSettings, 
  updateSiteSettings, 
  updateSiteLogo, 
  updateSiteFavicon, 
  updateBusinessHours, 
  updateLocation 
} from '../../utils/api';

// Fix for default marker icon issue in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Interactive marker component that updates coordinates on drag
const DraggableMarker = ({ position, onPositionChange }) => {
  useMapEvents({
    click(e) {
      onPositionChange([e.latlng.lat, e.latlng.lng]);
    },
  });

  return (
    <Marker 
      position={position} 
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const position = marker.getLatLng();
          onPositionChange([position.lat, position.lng]);
        },
      }}
    />
  );
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Site settings state
  const [settings, setSettings] = useState({
    businessName: '',
    address: '',
    phone: '',
    email: '',
    logo: '',
    favicon: '',
    businessHours: [
      { day: 'Monday', open: '09:00', close: '17:00', isClosed: false },
      { day: 'Tuesday', open: '09:00', close: '17:00', isClosed: false },
      { day: 'Wednesday', open: '09:00', close: '17:00', isClosed: false },
      { day: 'Thursday', open: '09:00', close: '17:00', isClosed: false },
      { day: 'Friday', open: '09:00', close: '17:00', isClosed: false },
      { day: 'Saturday', open: '10:00', close: '15:00', isClosed: false },
      { day: 'Sunday', open: '00:00', close: '00:00', isClosed: true }
    ],
    location: {
      coordinates: [73.0479, 33.6844], // Default to Islamabad [longitude, latitude]
      address: 'Islamabad, Pakistan'
    },
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      youtube: ''
    }
  });

  // Fetch settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await getSiteSettings();
        
        if (response?.data) {
          // Ensure businessHours has all days of the week
          const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
          const existingDays = response.data.businessHours?.map(h => h.day) || [];
          
          let businessHours = [...(response.data.businessHours || [])];
          
          // Add any missing days with default values
          days.forEach(day => {
            if (!existingDays.includes(day)) {
              businessHours.push({
                day,
                open: '09:00',
                close: '17:00',
                isClosed: day === 'Sunday' // Default Sunday to closed
              });
            }
          });
          
          // Sort days in correct order
          businessHours = businessHours.sort((a, b) => {
            return days.indexOf(a.day) - days.indexOf(b.day);
          });
          
          setSettings(prevSettings => ({
            ...prevSettings,
            ...response.data,
            businessHours
          }));
        }
      } catch (err) {
        // console.error('Error fetching settings:', err);
        setError('Failed to load settings. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []); // Empty dependency array since we're using functional updates

  // Handle general settings form submission
  const handleGeneralSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      
      const generalData = {
        businessName: settings.businessName,
        address: settings.address,
        phone: settings.phone,
        email: settings.email,
        socialMedia: settings.socialMedia
      };
      
      const response = await updateSiteSettings(generalData);
      
      if (response?.success) {
        setSuccessMessage('General settings updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      // console.error('Error updating general settings:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  // Handle logo update
  const handleLogoUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      
      const response = await updateSiteLogo(settings.logo);
      
      if (response?.success) {
        setSuccessMessage('Logo updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      // console.error('Error updating logo:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update logo');
    } finally {
      setSaving(false);
    }
  };

  // Handle favicon update
  const handleFaviconUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      
      const response = await updateSiteFavicon(settings.favicon);
      
      if (response?.success) {
        setSuccessMessage('Favicon updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      // console.error('Error updating favicon:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update favicon');
    } finally {
      setSaving(false);
    }
  };

  // Handle business hours update
  const handleBusinessHoursSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      
      const response = await updateBusinessHours(settings.businessHours);
      
      if (response?.success) {
        setSuccessMessage('Business hours updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      // console.error('Error updating business hours:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update business hours');
    } finally {
      setSaving(false);
    }
  };

  // Handle location update
  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      
      const response = await updateLocation(settings.location);
      
      if (response?.success) {
        setSuccessMessage('Location updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      // console.error('Error updating location:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update location');
    } finally {
      setSaving(false);
    }
  };

  // Update business hours
  const updateHours = (index, field, value) => {
    const updatedHours = [...settings.businessHours];
    updatedHours[index] = {
      ...updatedHours[index],
      [field]: value
    };
    
    // If marking as closed, set default hours
    if (field === 'isClosed' && value === true) {
      updatedHours[index].open = '00:00';
      updatedHours[index].close = '00:00';
    }
    
    setSettings({
      ...settings,
      businessHours: updatedHours
    });
  };

  // Update social media links
  const updateSocialMedia = (platform, value) => {
    setSettings({
      ...settings,
      socialMedia: {
        ...settings.socialMedia,
        [platform]: value
      }
    });
  };

  // Update location coordinates
  const updateCoordinates = (index, value) => {
    const newCoordinates = [...settings.location.coordinates];
    newCoordinates[index] = parseFloat(value);
    
    setSettings({
      ...settings,
      location: {
        ...settings.location,
        coordinates: newCoordinates
      }
    });
  };

  // Update marker position from map
  const handleMarkerPositionChange = (position) => {
    // Convert from Leaflet format [lat, lng] to our API format [lng, lat]
    setSettings({
      ...settings,
      location: {
        ...settings.location,
        coordinates: [position[1], position[0]]
      }
    });
  };

  // Get map position from coordinates (convert from [lng, lat] to [lat, lng] for Leaflet)
  const getMapPosition = () => {
    if (settings.location && settings.location.coordinates && settings.location.coordinates.length === 2) {
      return [settings.location.coordinates[1], settings.location.coordinates[0]];
    }
    return [33.6844, 73.0479]; // Default to Islamabad
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="settings-admin">
      <h2 className="mb-4">Site Settings</h2>
      
      {successMessage && (
        <Alert variant="success" className="mb-4">
          {successMessage}
        </Alert>
      )}
      
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}
      
      <Tabs
        activeKey={activeTab}
        onSelect={k => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="general" title="General">
          <Row>
            <Col lg={8}>
              <Card className="border-0 shadow-lg mb-4">
                <Card.Header className="bg-white">
                  <h5 className="mb-0">Business Information</h5>
                </Card.Header>
                <Card.Body>
                  <Form onSubmit={handleGeneralSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Business Name</Form.Label>
                      <Form.Control 
                        type="text" 
                        value={settings.businessName}
                        onChange={(e) => setSettings({...settings, businessName: e.target.value})}
                        required
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Address</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={2}
                        value={settings.address}
                        onChange={(e) => setSettings({...settings, address: e.target.value})}
                        required
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control 
                        type="text" 
                        value={settings.phone}
                        onChange={(e) => setSettings({...settings, phone: e.target.value})}
                        required
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control 
                        type="email" 
                        value={settings.email}
                        onChange={(e) => setSettings({...settings, email: e.target.value})}
                        required
                      />
                    </Form.Group>
                    
                    <Button 
                      type="submit" 
                      variant="primary"
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Business Information'}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={4}>
              <Card className="border-0 shadow-lg mb-4">
                <Card.Header className="bg-white">
                  <h5 className="mb-0">Logo & Favicon</h5>
                </Card.Header>
                <Card.Body>
                  <Form onSubmit={handleLogoUpdate} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Logo URL</Form.Label>
                      <Form.Control 
                        type="text" 
                        value={settings.logo}
                        onChange={(e) => setSettings({...settings, logo: e.target.value})}
                        placeholder="https://example.com/logo.png"
                      />
                      {settings.logo && (
                        <div className="mt-2 text-center">
                          <img 
                            src={settings.logo} 
                            alt="Logo Preview" 
                            style={{ maxHeight: '100px', maxWidth: '100%' }} 
                            className="border p-2"
                          />
                        </div>
                      )}
                    </Form.Group>
                    
                    <Button 
                      type="submit" 
                      variant="outline-primary"
                      disabled={saving || !settings.logo}
                      className="w-100"
                    >
                      {saving ? 'Updating Logo...' : 'Update Logo'}
                    </Button>
                  </Form>
                  
                  <Form onSubmit={handleFaviconUpdate}>
                    <Form.Group className="mb-3">
                      <Form.Label>Favicon URL</Form.Label>
                      <Form.Control 
                        type="text" 
                        value={settings.favicon}
                        onChange={(e) => setSettings({...settings, favicon: e.target.value})}
                        placeholder="https://example.com/favicon.ico"
                      />
                      {settings.favicon && (
                        <div className="mt-2 text-center">
                          <img 
                            src={settings.favicon} 
                            alt="Favicon Preview" 
                            style={{ height: '32px', width: '32px' }} 
                            className="border p-1"
                          />
                        </div>
                      )}
                    </Form.Group>
                    
                    <Button 
                      type="submit" 
                      variant="outline-primary"
                      disabled={saving || !settings.favicon}
                      className="w-100"
                    >
                      {saving ? 'Updating Favicon...' : 'Update Favicon'}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
        
        <Tab eventKey="hours" title="Business Hours">
          <Card className="border-0 shadow-lg mb-4">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Business Hours</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleBusinessHoursSubmit}>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Opening Time</th>
                        <th>Closing Time</th>
                        <th>Closed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {settings.businessHours.map((hour, index) => (
                        <tr key={hour.day}>
                          <td>{hour.day}</td>
                          <td>
                            <Form.Control 
                              type="time" 
                              value={hour.open}
                              onChange={(e) => updateHours(index, 'open', e.target.value)}
                              disabled={hour.isClosed}
                            />
                          </td>
                          <td>
                            <Form.Control 
                              type="time" 
                              value={hour.close}
                              onChange={(e) => updateHours(index, 'close', e.target.value)}
                              disabled={hour.isClosed}
                            />
                          </td>
                          <td>
                            <Form.Check 
                              type="switch"
                              id={`closed-${hour.day}`}
                              checked={hour.isClosed}
                              onChange={(e) => updateHours(index, 'isClosed', e.target.checked)}
                              label="Closed"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={saving}
                  className="mt-3"
                >
                  {saving ? 'Saving...' : 'Save Business Hours'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="location" title="Location">
          <Card className="border-0 shadow-lg mb-4">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Business Location</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleLocationSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Address</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={2}
                        value={settings.location.address}
                        onChange={(e) => setSettings({
                          ...settings, 
                          location: {
                            ...settings.location,
                            address: e.target.value
                          }
                        })}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Coordinates [Longitude, Latitude]</Form.Label>
                      <InputGroup>
                        <Form.Control 
                          type="number" 
                          step="0.0001"
                          value={settings.location.coordinates[0]}
                          onChange={(e) => updateCoordinates(0, e.target.value)}
                          placeholder="Longitude"
                        />
                        <Form.Control 
                          type="number" 
                          step="0.0001"
                          value={settings.location.coordinates[1]}
                          onChange={(e) => updateCoordinates(1, e.target.value)}
                          placeholder="Latitude"
                        />
                      </InputGroup>
                      <Form.Text className="text-muted">
                        Example: [73.0479, 33.6844] for Islamabad
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
                
                <div className="mt-3 mb-4">
                  <p className="mb-2">Map Preview (Click or drag marker to update location):</p>
                  <div style={{ height: '400px', width: '100%', overflow: 'hidden' }}>
                    <MapContainer 
                      center={getMapPosition()} 
                      zoom={14} 
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <DraggableMarker 
                        position={getMapPosition()} 
                        onPositionChange={handleMarkerPositionChange} 
                      />
                    </MapContainer>
                  </div>
                  <Form.Text className="text-muted mt-2">
                    Tip: Click anywhere on the map or drag the marker to set your business location
                  </Form.Text>
                </div>
                
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Location'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="social" title="Social Media">
          <Card className="border-0 shadow-lg mb-4">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Social Media Links</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleGeneralSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <i className="fab fa-facebook text-primary me-2"></i>
                        Facebook
                      </Form.Label>
                      <Form.Control 
                        type="url" 
                        value={settings.socialMedia.facebook}
                        onChange={(e) => updateSocialMedia('facebook', e.target.value)}
                        placeholder="https://facebook.com/yourbusiness"
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <i className="fab fa-twitter text-info me-2"></i>
                        Twitter
                      </Form.Label>
                      <Form.Control 
                        type="url" 
                        value={settings.socialMedia.twitter}
                        onChange={(e) => updateSocialMedia('twitter', e.target.value)}
                        placeholder="https://twitter.com/yourbusiness"
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <i className="fab fa-instagram text-danger me-2"></i>
                        Instagram
                      </Form.Label>
                      <Form.Control 
                        type="url" 
                        value={settings.socialMedia.instagram}
                        onChange={(e) => updateSocialMedia('instagram', e.target.value)}
                        placeholder="https://instagram.com/yourbusiness"
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <i className="fab fa-linkedin text-primary me-2"></i>
                        LinkedIn
                      </Form.Label>
                      <Form.Control 
                        type="url" 
                        value={settings.socialMedia.linkedin}
                        onChange={(e) => updateSocialMedia('linkedin', e.target.value)}
                        placeholder="https://linkedin.com/company/yourbusiness"
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <i className="fab fa-youtube text-danger me-2"></i>
                        YouTube
                      </Form.Label>
                      <Form.Control 
                        type="url" 
                        value={settings.socialMedia.youtube}
                        onChange={(e) => updateSocialMedia('youtube', e.target.value)}
                        placeholder="https://youtube.com/c/yourbusiness"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={saving}
                  className="mt-3"
                >
                  {saving ? 'Saving...' : 'Save Social Media Links'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Settings;
