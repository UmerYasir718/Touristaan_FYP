import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faEye, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import AddPackageModal from '../../components/admin/packages/AddPackageModal';
import EditPackageModal from '../../components/admin/packages/EditPackageModal';
import { getToken } from '../../utils/auth';

const PackageManagement = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [refreshData, setRefreshData] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const token = getToken();
        const response = await axios.get('/api/packages/admin/all', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPackages(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load packages. ' + (err.response?.data?.message || err.message));
        console.error('Error fetching packages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [refreshData]);

  const handleAddPackage = () => {
    setShowAddModal(true);
  };

  const handleEditPackage = (pkg) => {
    setSelectedPackage(pkg);
    setShowEditModal(true);
  };

  const handleViewPackage = (id) => {
    window.open(`/packages/${id}`, '_blank');
  };

  const handleTogglePackageStatus = async (id, currentStatus) => {
    try {
      const token = getToken();
      const endpoint = currentStatus 
        ? `/api/packages/${id}/disable` 
        : `/api/packages/${id}/enable`;
      
      await axios.put(endpoint, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Refresh the data
      setRefreshData(prev => !prev);
    } catch (err) {
      setError('Failed to update package status. ' + (err.response?.data?.message || err.message));
      console.error('Error updating package status:', err);
    }
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedPackage(null);
    // Refresh data when modal is closed to show new/updated packages
    setRefreshData(prev => !prev);
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="m-0">Package Management</h3>
                <Button 
                  variant="primary" 
                  onClick={handleAddPackage}
                  className="d-flex align-items-center"
                >
                  <FontAwesomeIcon icon={faPlus} className="me-2" />
                  Add New Package
                </Button>
              </div>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Destination</th>
                      <th>Price</th>
                      <th>Duration</th>
                      <th>Status</th>
                      <th>Featured</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packages.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center py-4">
                          No packages found. Add your first package!
                        </td>
                      </tr>
                    ) : (
                      packages.map((pkg) => (
                        <tr key={pkg._id}>
                          <td>
                            <img 
                              src={pkg.img} 
                              alt={pkg.title} 
                              style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} 
                            />
                          </td>
                          <td>{pkg.title}</td>
                          <td>{pkg.destinations.join(', ')}</td>
                          <td>${pkg.price}</td>
                          <td>{pkg.duration}</td>
                          <td>
                            <Badge bg={pkg.active ? 'success' : 'danger'}>
                              {pkg.active ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td>
                            <Badge bg={pkg.featured ? 'info' : 'secondary'}>
                              {pkg.featured ? 'Featured' : 'Regular'}
                            </Badge>
                          </td>
                          <td>
                            <Button 
                              variant="outline-primary" 
                              size="sm" 
                              className="me-2"
                              onClick={() => handleEditPackage(pkg)}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>
                            <Button 
                              variant="outline-info" 
                              size="sm" 
                              className="me-2"
                              onClick={() => handleViewPackage(pkg._id)}
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </Button>
                            <Button 
                              variant={pkg.active ? "outline-danger" : "outline-success"} 
                              size="sm"
                              onClick={() => handleTogglePackageStatus(pkg._id, pkg.active)}
                            >
                              <FontAwesomeIcon icon={pkg.active ? faToggleOff : faToggleOn} />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Package Modal */}
      <AddPackageModal 
        show={showAddModal} 
        onHide={handleModalClose} 
      />

      {/* Edit Package Modal */}
      {selectedPackage && (
        <EditPackageModal 
          show={showEditModal} 
          onHide={handleModalClose} 
          packageData={selectedPackage} 
        />
      )}
    </Container>
  );
};

export default PackageManagement;
