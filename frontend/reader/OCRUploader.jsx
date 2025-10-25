// frontend/reader/OCRUploader.jsx

import React, { useState } from 'react';
import { Form, Button, Alert, Spinner, Card } from 'react-bootstrap';
import { CameraFill } from 'react-bootstrap-icons';

function OCRUploader({ onTextExtracted }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setMessage({ type: 'warning', text: 'Please select an image file first.' });
      return;
    }

    const formData = new FormData();
    // The key 'image' MUST match the name used in multer middleware (upload.single('image'))
    formData.append('image', file); 

    setLoading(true);
    setMessage('');

    try {
      // Use the proxied API endpoint
      const response = await fetch('/api/ocr', {
        method: 'POST',
        body: formData, // FormData sends the file correctly
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: 'success', text: `OCR completed for ${file.name}!` });
        // Pass the extracted text up to the parent component (e.g., ReaderPage)
        onTextExtracted(data.extractedText);
      } else {
        // Handle server-side errors (e.g., file size limit)
        setMessage({ type: 'danger', text: data.error || 'OCR failed due to a server error.' });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setMessage({ type: 'danger', text: 'Network error or server unreachable.' });
    } finally {
      setLoading(false);
      setFile(null); // Clear the file input
    }
  };

  return (
    <Card className="p-4 shadow-sm border-primary">
      <Card.Title className="text-primary mb-3"><CameraFill className="me-2" /> OCR Image Reader</Card.Title>
      <p className="text-muted">Upload an image of text to convert it for adaptive reading.</p>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Select Image File (PNG, JPG)</Form.Label>
          <Form.Control type="file" name="image" onChange={handleFileChange} accept="image/*" />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading || !file}>
          {loading ? (
            <><Spinner animation="border" size="sm" className="me-2" /> Processing...</>
          ) : (
            'Run OCR and Load Text'
          )}
        </Button>
      </Form>

      {message && (
        <Alert variant={message.type} className="mt-3">
          {message.text}
        </Alert>
      )}
    </Card>
  );
}

export default OCRUploader;