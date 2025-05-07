import React from "react";
import PropTypes from "prop-types";

const StarRating = ({ rating, size = "sm", interactive = false, onChange }) => {
  const renderStar = (index) => {
    const starValue = index + 1;
    let starType = "bi-star";
    
    if (rating >= starValue) {
      starType = "bi-star-fill";
    } else if (rating >= starValue - 0.5) {
      starType = "bi-star-half";
    }
    
    const starSize = size === "lg" ? "fs-4" : size === "md" ? "fs-5" : "";
    const starColor = "text-warning";
    
    return (
      <i 
        key={index}
        className={`bi ${starType} ${starColor} ${starSize} ${interactive ? "cursor-pointer" : ""}`}
        onClick={() => interactive && onChange && onChange(starValue)}
        style={{ cursor: interactive ? "pointer" : "default" }}
      ></i>
    );
  };

  return (
    <div className="star-rating d-inline-block">
      {[...Array(5)].map((_, index) => renderStar(index))}
    </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  interactive: PropTypes.bool,
  onChange: PropTypes.func,
};

export default StarRating;
