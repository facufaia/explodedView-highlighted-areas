import { useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function PDFViewer({ file, onAreaAdded, vinculados }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [areas, setAreas] = useState([]);
  const pageRef = useRef(null); // Add this line

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const handleImageClick = (e) => {
    const rect = pageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newArea = { x, y, radius: 20 };
    setAreas([...areas, newArea]);
    console.log(areas);
    onAreaAdded(newArea);
  };

  return (
    <div>
      <Document
        file={file}
        pageRef={pageRef}
        onClick={handleImageClick}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <div ref={pageRef} style={{ position: "relative" }}>
          {" "}
          {/* Update this line */}
          <Page pageNumber={pageNumber} />
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
              }}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </Document>
      <div>
        <p>
          Page {pageNumber} of {numPages}
        </p>
        {/* <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>
        <button
          disabled={currentPage >= numPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button> */}
      </div>
    </div>
  );
}
