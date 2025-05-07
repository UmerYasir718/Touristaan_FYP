import React, { useState } from "react";
import { Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import { submitReview } from "../../utils/api";
import StarRating from "../common/StarRating";

const ReviewForm = ({ packageId, onReviewSubmitted }) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  // Validation schema
  const reviewSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    text: Yup.string()
      .required("Review text is required")
      .min(10, "Review must be at least 10 characters"),
    rating: Yup.number()
      .required("Rating is required")
      .min(1, "Please select a rating")
      .max(5, "Maximum rating is 5"),
  });

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);

    // Create preview URLs
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  // Handle form submission
  const handleSubmit = async (values, { resetForm }) => {
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("text", values.text);
      formData.append("rating", values.rating);
      formData.append("packageId", packageId);

      // Append images if any
      selectedImages.forEach((image) => {
        formData.append("images", image);
      });

      // Submit review
      await submitReview(formData);

      // Reset form and state
      resetForm();
      setSelectedImages([]);
      setPreviewImages([]);
      setSuccess(true);

      // Notify parent component
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to submit review. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="border-0 shadow-sm mb-4">
      <Card.Body>
        <h4 className="mb-3">Write a Review</h4>
        
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert variant="success" dismissible onClose={() => setSuccess(false)}>
            Thank you for your review! It has been submitted for approval.
          </Alert>
        )}
        
        <Formik
          initialValues={{ title: "", text: "", rating: 0 }}
          validationSchema={reviewSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
          }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Rating</Form.Label>
                <div>
                  <StarRating
                    rating={values.rating}
                    size="lg"
                    interactive={true}
                    onChange={(rating) => setFieldValue("rating", rating)}
                  />
                  {errors.rating && touched.rating && (
                    <div className="text-danger mt-1">{errors.rating}</div>
                  )}
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  placeholder="Summarize your experience"
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.title && errors.title}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.title}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Review</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="text"
                  placeholder="Share your experience with this tour package"
                  value={values.text}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.text && errors.text}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.text}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Add Photos (optional)</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
                <Form.Text className="text-muted">
                  You can upload up to 5 images
                </Form.Text>
              </Form.Group>

              {previewImages.length > 0 && (
                <div className="mb-3">
                  <div className="d-flex flex-wrap">
                    {previewImages.map((preview, index) => (
                      <div
                        key={index}
                        className="me-2 mb-2 position-relative"
                        style={{ width: "100px", height: "100px" }}
                      >
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="img-thumbnail"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          className="position-absolute top-0 end-0"
                          style={{ padding: "0.1rem 0.3rem" }}
                          onClick={() => {
                            const newPreviews = [...previewImages];
                            const newImages = [...selectedImages];
                            newPreviews.splice(index, 1);
                            newImages.splice(index, 1);
                            setPreviewImages(newPreviews);
                            setSelectedImages(newImages);
                          }}
                        >
                          <i className="bi bi-x"></i>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                variant="primary"
                type="submit"
                disabled={submitting}
                className="mt-2"
              >
                {submitting ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </Button>
            </Form>
          )}
        </Formik>
      </Card.Body>
    </Card>
  );
};

export default ReviewForm;
