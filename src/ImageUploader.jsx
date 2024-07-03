import PropTypes from "prop-types";

export default function ImageUploader({ onImageUpload }) {
  const handleFileChange = (e) => {
    onImageUpload(e.target.files[0]);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
    </div>
  );
}

ImageUploader.propTypes = {
  onImageUpload: PropTypes.func.isRequired,
};
