
import React, { useState } from "react";
import {
  Form,
  Button,
  Card,
  Spinner,
  Alert,
  InputGroup,
  FormControl,
} from "react-bootstrap";

const BACKEND_API_URL = 'http://127.0.0.1:5000/api/ocr/upload';

const OCRUploader = ({ onTextExtracted }) => {
  const [file, setFile] = useState(null);
  const [manualText, setManualText] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setManualText("");
      setStatus(null);
    }
  };

  const handleManualSubmit = () => {
    const text = manualText.trim();
    if (!text) {
      setStatus({ type: "danger", message: "Please enter some text." });
      return;
    }

    onTextExtracted(text, "Manual Input", null);
    setManualText("");
    setFile(null);
    setStatus({ type: "success", message: "Manual text loaded into preview." });
  };

  const handleOCRSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus({ type: "danger", message: "Please select an image file first." });
      return;
    }

    setLoading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(BACKEND_API_URL, {
        method: 'POST',
        body: formData,
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned a non-JSON response. Check backend logs.");
      }

      const result = await response.json();

      // FIXED: Check result.success and result.extractedText (not response or extracted_text)
      if (response.ok && result.success && result.extractedText) {
        console.log("✅ OCR Success:", result.extractedText);
        setStatus({ type: "success", message: "OCR successful!" });
        onTextExtracted(result.extractedText, result.source || "OCR Upload", file);
      } else {
        console.error("❌ OCR Error:", result.error || "Unknown error");
        setStatus({
          type: "danger",
          message: result.error || "OCR failed on server.",
        });
      }
    } catch (err) {
      console.error("Network error while calling OCR API:", err);
      setStatus({
        type: "danger",
        message: `Network / server error: ${err.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-3 shadow-sm border-primary">
      <Card.Title className="text-primary h5 mb-3">
        📸 OCR Image Reader
      </Card.Title>

      {/* Option 1: OCR Image Upload */}
      <h6 className="small fw-bold text-secondary">Option 1: Upload Image</h6>
      <Form onSubmit={handleOCRSubmit} className="mb-3">
        <Form.Group className="mb-2">
          <Form.Control
            type="file"
            accept="image/*"
            size="sm"
            disabled={loading}
            onChange={handleFileChange}
          />
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          size="sm"
          disabled={loading || !file}
          className="w-100"
        >
          {loading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            "Run OCR & Load Text"
          )}
        </Button>
      </Form>

      <div className="text-center small text-muted my-2">- OR -</div>

      {/* Option 2: Manual Text */}
      <h6 className="small fw-bold text-secondary">Option 2: Manual Text</h6>
      <InputGroup className="mb-2">
        <FormControl
          as="textarea"
          rows={2}
          placeholder="Type text here..."
          size="sm"
          value={manualText}
          onChange={(e) => {
            setManualText(e.target.value || "");
            setFile(null);
          }}
        />
      </InputGroup>
      <Button
        variant="outline-success"
        size="sm"
        className="w-100"
        disabled={loading || !manualText.trim()}
        onClick={handleManualSubmit}
      >
        Load Manual Text
      </Button>

      {status && (
        <Alert variant={status.type} className="mt-3 small p-2">
          {status.message}
        </Alert>
      )}
    </Card>
  );
};

export default OCRUploader;