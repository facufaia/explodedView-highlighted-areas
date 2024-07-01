import PropTypes from "prop-types";

export default function ImageUploader({ onImageUpload }) {
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const img = e.target.files[0];
      onImageUpload(img);
    }
  };

  return (
    <div className="bg-yellow-600">
      <input type="file" accept="image/*" onChange={handleImageChange} />
    </div>
  );
}

ImageUploader.propTypes = {
  onImageUpload: PropTypes.func.isRequired,
};
