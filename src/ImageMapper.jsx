import { useState, useRef } from "react";
import PropTypes from "prop-types";

export default function ImageMapper({ imageSrc, onAreaAdded, vinculados }) {
  const [areas, setAreas] = useState([]);
  const imageRef = useRef(null);

  const handleImageClick = (e) => {
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newArea = { x, y, radius: 20 };
    setAreas([...areas, newArea]);
    onAreaAdded(newArea);
  };

  return (
    <div style={{ position: "relative" }}>
      <img
        ref={imageRef}
        src={imageSrc}
        alt="Despiece"
        onClick={handleImageClick}
        style={{ maxWidth: "100%" }}
      />
      {areas.map((area, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: area.x - area.radius,
            top: area.y - area.radius,
            width: area.radius * 2,
            height: area.radius * 2,
            borderRadius: "50%",
            border: "2px solid red",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "red",
            fontWeight: "bold",
            // backgroundColor: vinculados.includes(index + 1)
            //   ? "rgba(0, 255, 0, 0.3)"
            //   : "transparent",
          }}
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
}

ImageMapper.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  onAreaAdded: PropTypes.func.isRequired,
  vinculados: PropTypes.array.isRequired,
};
