import PropTypes from "prop-types";

export default function DataUploader({ onDataUpload }) {
  const handleFileChange = (e) => {
    if (e.target.files) {
      onDataUpload(e.target.files[0]);
    }
  };

  return (
    <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
    </div>
  );
}

DataUploader.propTypes = {
  onDataUpload: PropTypes.func.isRequired,
};
