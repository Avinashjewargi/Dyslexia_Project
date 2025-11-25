// frontend/reader/OCRSideBySidePreview.jsx

import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";

const OCRSideBySidePreview = ({
  uploadedFile,
  extractedText,
  source,
  onLoadText,
  onCancel,
}) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (uploadedFile) {
      const url = URL.createObjectURL(uploadedFile);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImageUrl(null);
    }
  }, [uploadedFile]);

  return (
    <Card className="shadow-lg p-4 my-4 border-warning">
      <Card.Title className="text-warning h4 mb-3">
        OCR Results Preview: {source}
      </Card.Title>

      <Row>
        {/* Left: Image */}
        <Col md={6}>
          <h6 className="text-muted">Original Image</h6>
          <div
            className="border rounded d-flex justify-content-center bg-light"
            style={{ maxHeight: "350px", overflow: "hidden" }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Uploaded preview"
                style={{ width: "100%", height: "auto", objectFit: "contain" }}
              />
            ) : (
              <p className="text-center p-4">Image preview unavailable.</p>
            )}
          </div>
        </Col>

        {/* Right: Text */}
        <Col md={6}>
          <h6 className="text-muted">Recognized Text</h6>
          <Card style={{ maxHeight: "350px", overflowY: "auto" }}>
            <Card.Body className="small text-dark p-3">
              {extractedText || "No text recognized. Please check the image."}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="d-flex justify-content-center mt-4">
        <Button
          variant="success"
          className="me-3"
          onClick={onLoadText}
          disabled={!extractedText}
        >
          Load Text into Reader
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancel / Back to Input
        </Button>
      </div>
    </Card>
  );
};

export default OCRSideBySidePreview;
