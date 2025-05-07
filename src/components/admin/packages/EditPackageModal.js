import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Spinner,
  Alert,
  Tab,
  Nav,
} from "react-bootstrap";
import { Formik, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  updatePackage,
  uploadPackageImage,
  uploadPackageImages,
} from "../../../utils/api";

const EditPackageModal = ({ show, onHide, packageData }) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Set initial values from packageData
  const initialValues = {
    title: packageData?.title || "",
    desc: packageData?.desc || "",
    img: packageData?.img || "",
    startPoint: packageData?.startPoint || "",
    destinations: packageData?.destinations || [""],
    duration: packageData?.duration || "",
    price: packageData?.price || "",
    rating: packageData?.rating || 4.5,
    coordinates: packageData?.coordinates || [{ place: "", lat: "", lng: "" }],
    images: packageData?.images || [],
    itinerary: packageData?.itinerary || [
      { day: 1, title: "", description: "" },
    ],
    featured: packageData?.featured || false,
  };

  // Set main image preview if exists
  useEffect(() => {
    if (packageData?.img) {
      setMainImagePreview(packageData.img);
    }
  }, [packageData]);

  // Validation schema
  const packageSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    desc: Yup.string().required("Description is required"),
    startPoint: Yup.string().required("Starting point is required"),
    duration: Yup.string().required("Duration is required"),
    price: Yup.number()
      .required("Price is required")
      .positive("Price must be positive"),
    img: Yup.string().required("Main image is required"),
    destinations: Yup.array()
      .min(1, "At least one destination is required")
      .required("Destinations are required"),
    coordinates: Yup.array()
      .of(
        Yup.object().shape({
          place: Yup.string().required("Place name is required"),
          lat: Yup.number().required("Latitude is required"),
          lng: Yup.number().required("Longitude is required"),
        })
      )
      .min(1, "At least one coordinate is required"),
    images: Yup.array()
      .of(Yup.string().required("Image URL is required"))
      .min(1, "At least one gallery image is required"),
    itinerary: Yup.array()
      .of(
        Yup.object().shape({
          day: Yup.number()
            .required("Day is required")
            .positive("Day must be positive"),
          title: Yup.string().required("Title is required"),
          description: Yup.string().required("Description is required"),
        })
      )
      .min(1, "At least one itinerary item is required"),
  });

  const handleMainImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMainImageFile(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryImagesChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setGalleryFiles((prevFiles) => [...prevFiles, ...files]);

      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setGalleryPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    }
  };

  const removeGalleryImage = (index) => {
    setGalleryFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setGalleryPreviews((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    );
  };

  const uploadMainImage = async (setFieldValue) => {
    if (!mainImageFile) return null;

    setUploadingMain(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", mainImageFile);

      // Use the uploadPackageImage API function with the package ID
      const response = await uploadPackageImage(packageData._id, formData);

      setUploadingMain(false);
      console.log(response.data);
      // Update the form field with the new image URL
      if (response.data && response.data.img) {
        console.log(response.data.img);
        setFieldValue("img", response.data.img);
        setMainImageFile(null); // Reset the file input after successful upload
      }

      return response.data.url;
    } catch (err) {
      setError(
        "Failed to upload main image: " +
          (err.response?.data?.message || err.message)
      );
      setUploadingMain(false);
      return null;
    }
  };

  const uploadGalleryImages = async (setFieldValue, values) => {
    if (galleryFiles.length === 0) return [];

    setUploadingGallery(true);
    setError("");

    try {
      const formData = new FormData();
      galleryFiles.forEach((file) => {
        formData.append("images", file);
      });

      // Use the uploadPackageImages API function with the package ID
      const response = await uploadPackageImages(packageData._id, formData);

      setUploadingGallery(false);

      // Update the form field with the new image URLs
      if (
        response.data &&
        response.data.images &&
        response.data.images.length > 0
      ) {
        const currentImages = values.images || [];
        setFieldValue("images", [...currentImages, ...response.data.images]);
        setGalleryFiles([]); // Reset the files after successful upload
        setGalleryPreviews([]); // Clear previews
      }

      return response.data.urls;
    } catch (err) {
      setError(
        "Failed to upload gallery images: " +
          (err.response?.data?.message || err.message)
      );
      setUploadingGallery(false);
      return [];
    }
  };

  const handleSubmit = async (
    values,
    { setSubmitting, setFieldValue, validateForm }
  ) => {
    setError("");
    setSuccess("");

    // Validate all fields first
    const errors = await validateForm(values);
    if (Object.keys(errors).length > 0) {
      // Show validation errors
      setError("Please fill in all required fields before submitting");
      setSubmitting(false);
      return;
    }

    try {
      // For main image, just use the current value in the form
      // This way, it doesn't matter if it came from an upload or direct URL entry
      const mainImageUrl = values.img;

      // Update package with current form values
      const updatedPackageData = {
        ...values,
        img: mainImageUrl,
        // Use the current form values which include any newly uploaded images
        images: values.images || [],
      };

      // Use the updatePackage API function with the package ID
      await updatePackage(packageData._id, updatedPackageData);

      setSuccess("Package updated successfully!");

      // Reset file states after successful update
      setMainImageFile(null);
      setGalleryFiles([]);
      setGalleryPreviews([]);

      // Close modal after a short delay
      setTimeout(() => {
        onHide();
      }, 1500);
    } catch (err) {
      setError(
        "Failed to update package: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Edit Package: {packageData?.title}</Modal.Title>
      </Modal.Header>

      <Formik
        initialValues={initialValues}
        validationSchema={packageSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          isSubmitting,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Modal.Body className="p-4">
              {error && (
                <Alert variant="danger">
                  <Alert.Heading>Error</Alert.Heading>
                  <p>{error}</p>
                  {Object.keys(errors).length > 0 && (
                    <div>
                      <strong>Missing required fields:</strong>
                      <ul className="mb-0">
                        {Object.keys(errors).map((field) => (
                          <li key={field}>
                            {field.charAt(0).toUpperCase() + field.slice(1)}:{" "}
                            {errors[field]}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Alert>
              )}
              {success && <Alert variant="success">{success}</Alert>}

              <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
                <Nav variant="tabs" className="mb-3">
                  <Nav.Item>
                    <Nav.Link eventKey="basic">
                      <i className="bi bi-info-circle me-2"></i>Basic Info
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="images">
                      <i className="bi bi-images me-2"></i>Images
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="locations">
                      <i className="bi bi-geo-alt me-2"></i>Locations
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="itinerary">
                      <i className="bi bi-calendar-week me-2"></i>Itinerary
                    </Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content>
                  {/* Basic Info Tab */}
                  <Tab.Pane eventKey="basic">
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Title</Form.Label>
                          <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                              <i className="bi bi-heading"></i>
                            </span>
                            <Form.Control
                              type="text"
                              name="title"
                              className="border-start-0"
                              value={values.title}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.title && !!errors.title}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.title}
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Duration</Form.Label>
                          <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                              <i className="bi bi-clock"></i>
                            </span>
                            <Form.Control
                              type="text"
                              name="duration"
                              className="border-start-0"
                              value={values.duration}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.duration && !!errors.duration}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.duration}
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Price (PKR)</Form.Label>
                          <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                              <i className="bi bi-tag"></i>
                            </span>
                            <Form.Control
                              type="number"
                              name="price"
                              className="border-start-0"
                              value={values.price}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.price && !!errors.price}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.price}
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Starting Point</Form.Label>
                          <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                              <i className="bi bi-map-pin"></i>
                            </span>
                            <Form.Control
                              type="text"
                              name="startPoint"
                              className="border-start-0"
                              value={values.startPoint}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={
                                touched.startPoint && !!errors.startPoint
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.startPoint}
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="desc"
                        value={values.desc}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.desc && !!errors.desc}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.desc}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        label="Featured Package"
                        name="featured"
                        checked={values.featured}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Tab.Pane>

                  {/* Images Tab */}
                  <Tab.Pane eventKey="images">
                    <Row className="mb-4">
                      <Col>
                        <h5>Main Image</h5>
                        <div className="d-flex align-items-center mb-3">
                          <div
                            className="border rounded p-2 me-3 d-flex justify-content-center align-items-center"
                            style={{
                              width: "200px",
                              height: "125px",
                              background: "#f8f9fa",
                            }}
                          >
                            {mainImagePreview ? (
                              <img
                                src={mainImagePreview}
                                alt="Main preview"
                                style={{
                                  width: "175px",
                                  height: "100px",
                                  objectFit: "cover",
                                  borderRadius: "4px",
                                }}
                              />
                            ) : values.img ? (
                              <img
                                src={values.img}
                                alt="Current main"
                                style={{
                                  width: "175px",
                                  height: "100px",
                                  objectFit: "cover",
                                  borderRadius: "4px",
                                }}
                              />
                            ) : (
                              <div className="text-center text-muted">
                                No image selected
                              </div>
                            )}
                          </div>

                          <div>
                            <Form.Group controlId="mainImageUpload">
                              <Form.Label className="btn btn-outline-primary mb-2">
                                {uploadingMain
                                  ? "Uploading..."
                                  : "Select Image"}
                                <Form.Control
                                  type="file"
                                  accept="image/*"
                                  onChange={handleMainImageChange}
                                  style={{ display: "none" }}
                                  disabled={uploadingMain}
                                />
                              </Form.Label>
                              {mainImageFile && (
                                <Button
                                  variant="success"
                                  size="sm"
                                  className="d-block"
                                  onClick={() => uploadMainImage(setFieldValue)}
                                  disabled={uploadingMain}
                                >
                                  <i className="bi bi-cloud-upload me-1"></i>
                                  {uploadingMain
                                    ? "Uploading..."
                                    : "Upload Now"}
                                </Button>
                              )}
                            </Form.Group>
                          </div>
                        </div>

                        <Form.Group className="mb-3">
                          <Form.Label>Main Image URL</Form.Label>
                          <Form.Control
                            type="text"
                            name="img"
                            value={values.img}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.img && !!errors.img}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.img}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <h5>Gallery Images</h5>
                        <div className="mb-3">
                          <Form.Group controlId="galleryImagesUpload">
                            <Form.Label className="btn btn-outline-primary mb-2">
                              <i className="bi bi-images me-1"></i>
                              {uploadingGallery
                                ? "Uploading..."
                                : "Select Gallery Images"}
                              <Form.Control
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleGalleryImagesChange}
                                style={{ display: "none" }}
                                disabled={uploadingGallery}
                              />
                            </Form.Label>
                            {galleryFiles.length > 0 && (
                              <Button
                                variant="success"
                                size="sm"
                                className="ms-2"
                                onClick={() =>
                                  uploadGalleryImages(setFieldValue, values)
                                }
                                disabled={uploadingGallery}
                              >
                                <i className="bi bi-cloud-upload me-1"></i>
                                {uploadingGallery
                                  ? "Uploading..."
                                  : "Upload Selected Images"}
                              </Button>
                            )}
                          </Form.Group>
                        </div>

                        {/* New images to upload */}
                        {galleryPreviews.length > 0 && (
                          <>
                            <h6 className="mb-2">New Images to Upload:</h6>
                            <div className="d-flex flex-wrap mb-3">
                              {galleryPreviews.map((preview, index) => (
                                <div
                                  key={index}
                                  className="position-relative me-3 mb-3"
                                >
                                  <img
                                    src={preview}
                                    alt={`Gallery ${index}`}
                                    style={{
                                      width: "150px",
                                      height: "100px",
                                      objectFit: "cover",
                                      borderRadius: "4px",
                                    }}
                                  />
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    className="position-absolute top-0 end-0"
                                    onClick={() => removeGalleryImage(index)}
                                  >
                                    <i className="bi bi-x-circle"></i>
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {/* Existing gallery images */}
                        {values.images.length > 0 && (
                          <>
                            <h6>Current Gallery Images:</h6>
                            <FieldArray name="images">
                              {({ remove }) => (
                                <div className="d-flex flex-wrap mb-3">
                                  {values.images.map((image, index) => (
                                    <div
                                      key={index}
                                      className="position-relative me-3 mb-3"
                                    >
                                      <img
                                        src={image}
                                        alt={`Gallery ${index}`}
                                        style={{
                                          width: "150px",
                                          height: "100px",
                                          objectFit: "cover",
                                          borderRadius: "4px",
                                        }}
                                      />
                                      <Button
                                        variant="danger"
                                        size="sm"
                                        className="position-absolute top-0 end-0"
                                        onClick={() => remove(index)}
                                      >
                                        <i className="bi bi-x-circle"></i>
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </FieldArray>
                          </>
                        )}

                        <FieldArray name="images">
                          {({ push }) => (
                            <Button
                              variant="outline-secondary"
                              onClick={() => push("")}
                              className="mt-2"
                            >
                              Add Image URL
                            </Button>
                          )}
                        </FieldArray>
                      </Col>
                    </Row>
                  </Tab.Pane>

                  {/* Locations Tab */}
                  <Tab.Pane eventKey="locations">
                    <h5 className="mb-3">Destinations</h5>
                    <FieldArray name="destinations">
                      {({ push, remove }) => (
                        <>
                          {values.destinations.map((destination, index) => (
                            <div key={index} className="d-flex mb-2">
                              <Form.Control
                                type="text"
                                name={`destinations.${index}`}
                                value={destination}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={
                                  touched.destinations &&
                                  errors.destinations &&
                                  errors.destinations[index]
                                }
                                placeholder="Destination name"
                                className="me-2"
                              />
                              {values.destinations.length > 1 && (
                                <Button
                                  variant="outline-danger"
                                  onClick={() => remove(index)}
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                          ))}

                          <Button
                            variant="outline-secondary"
                            onClick={() => push("")}
                            className="mt-2"
                          >
                            Add Destination
                          </Button>
                        </>
                      )}
                    </FieldArray>

                    <h5 className="mt-4 mb-3">Map Coordinates</h5>
                    <FieldArray name="coordinates">
                      {({ push, remove }) => (
                        <>
                          {values.coordinates.map((coordinate, index) => (
                            <div
                              key={index}
                              className="border rounded p-3 mb-3"
                            >
                              <div className="d-flex justify-content-between mb-2">
                                <h6>Location {index + 1}</h6>
                                {values.coordinates.length > 1 && (
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => remove(index)}
                                  >
                                    Remove
                                  </Button>
                                )}
                              </div>

                              <Row>
                                <Col md={12} className="mb-2">
                                  <Form.Control
                                    type="text"
                                    name={`coordinates.${index}.place`}
                                    value={coordinate.place}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={
                                      touched.coordinates &&
                                      errors.coordinates &&
                                      errors.coordinates[index] &&
                                      errors.coordinates[index].place
                                    }
                                    placeholder="Place name"
                                  />
                                  <ErrorMessage
                                    name={`coordinates.${index}.place`}
                                    component="div"
                                    className="text-danger"
                                  />
                                </Col>

                                <Col md={6}>
                                  <Form.Control
                                    type="number"
                                    name={`coordinates.${index}.lat`}
                                    value={coordinate.lat}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={
                                      touched.coordinates &&
                                      errors.coordinates &&
                                      errors.coordinates[index] &&
                                      errors.coordinates[index].lat
                                    }
                                    placeholder="Latitude"
                                    step="any"
                                  />
                                  <ErrorMessage
                                    name={`coordinates.${index}.lat`}
                                    component="div"
                                    className="text-danger"
                                  />
                                </Col>

                                <Col md={6}>
                                  <Form.Control
                                    type="number"
                                    name={`coordinates.${index}.lng`}
                                    value={coordinate.lng}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={
                                      touched.coordinates &&
                                      errors.coordinates &&
                                      errors.coordinates[index] &&
                                      errors.coordinates[index].lng
                                    }
                                    placeholder="Longitude"
                                    step="any"
                                  />
                                  <ErrorMessage
                                    name={`coordinates.${index}.lng`}
                                    component="div"
                                    className="text-danger"
                                  />
                                </Col>
                              </Row>
                            </div>
                          ))}

                          <Button
                            variant="outline-secondary"
                            onClick={() =>
                              push({ place: "", lat: "", lng: "" })
                            }
                          >
                            Add Location
                          </Button>
                        </>
                      )}
                    </FieldArray>
                  </Tab.Pane>

                  {/* Itinerary Tab */}
                  <Tab.Pane eventKey="itinerary">
                    <h5 className="mb-3">Day-by-Day Itinerary</h5>
                    <FieldArray name="itinerary">
                      {({ push, remove }) => (
                        <>
                          {values.itinerary.map((day, index) => (
                            <div
                              key={index}
                              className="border rounded p-3 mb-3"
                            >
                              <div className="d-flex justify-content-between mb-2">
                                <h6>Day {day.day}</h6>
                                {values.itinerary.length > 1 && (
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => remove(index)}
                                  >
                                    Remove
                                  </Button>
                                )}
                              </div>

                              <Row className="mb-2">
                                <Col md={3}>
                                  <Form.Control
                                    type="number"
                                    name={`itinerary.${index}.day`}
                                    value={day.day}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={
                                      touched.itinerary &&
                                      errors.itinerary &&
                                      errors.itinerary[index] &&
                                      errors.itinerary[index].day
                                    }
                                    placeholder="Day #"
                                    min="1"
                                  />
                                  <ErrorMessage
                                    name={`itinerary.${index}.day`}
                                    component="div"
                                    className="text-danger"
                                  />
                                </Col>

                                <Col md={9}>
                                  <Form.Control
                                    type="text"
                                    name={`itinerary.${index}.title`}
                                    value={day.title}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={
                                      touched.itinerary &&
                                      errors.itinerary &&
                                      errors.itinerary[index] &&
                                      errors.itinerary[index].title
                                    }
                                    placeholder="Day title"
                                  />
                                  <ErrorMessage
                                    name={`itinerary.${index}.title`}
                                    component="div"
                                    className="text-danger"
                                  />
                                </Col>
                              </Row>

                              <Form.Control
                                as="textarea"
                                rows={3}
                                name={`itinerary.${index}.description`}
                                value={day.description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={
                                  touched.itinerary &&
                                  errors.itinerary &&
                                  errors.itinerary[index] &&
                                  errors.itinerary[index].description
                                }
                                placeholder="Day description"
                              />
                              <ErrorMessage
                                name={`itinerary.${index}.description`}
                                component="div"
                                className="text-danger"
                              />
                            </div>
                          ))}

                          <Button
                            variant="outline-secondary"
                            onClick={() => {
                              // Calculate next day number
                              const nextDay =
                                values.itinerary.length > 0
                                  ? Math.max(
                                      ...values.itinerary.map(
                                        (item) => item.day
                                      )
                                    ) + 1
                                  : 1;
                              push({
                                day: nextDay,
                                title: "",
                                description: "",
                              });
                            }}
                          >
                            Add Day
                          </Button>
                        </>
                      )}
                    </FieldArray>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={onHide}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting || uploadingMain || uploadingGallery}
              >
                {isSubmitting ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Saving...
                  </>
                ) : (
                  <>Update Package</>
                )}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default EditPackageModal;
