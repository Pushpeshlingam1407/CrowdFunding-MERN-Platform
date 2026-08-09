import React, { useState } from "react";
import "./StarRating.css";
import { Star } from "lucide-react";

const StarRating = ({ rating, setRating, readonly = false, size = 20 }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="rating-container">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className={`star-button ${readonly ? "cursor-default" : "cursor-pointer"} ${star <= (hover || rating) ? "active" : ""} ${star <= hover ? "hovered" : ""}`}
          type="button"
          onClick={() => !readonly && setRating(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
        >
          <Star
            size={size}
            fill={star <= (hover || rating) ? "currentColor" : "none"}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
