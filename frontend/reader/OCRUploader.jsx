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
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';

const BACKEND_API_URL = 'http://127.0.0.1:5000/api/ocr/upload';

<<<<<<< HEAD
=======
// Map UI language codes to Tesseract language codes
const LANGUAGE_CODE_MAPPING = {
  'en': 'eng',  // English
  'hi': 'hin',  // Hindi
  'kn': 'kan'   // Kannada
};

>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
const OCRUploader = ({ onTextExtracted }) => {
  const [file, setFile] = useState(null);
  const [manualText, setManualText] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
<<<<<<< HEAD
  const [ocrLanguage, setOcrLanguage] = useState("en"); // OCR language selector
  
  // Add language context and translation
=======
  const [ocrLanguage, setOcrLanguage] = useState("en"); // UI language code
  
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();

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
      setStatus({ type: "danger", message: t('reader.enterText') || "Please enter some text." });
      return;
    }

<<<<<<< HEAD
    onTextExtracted(text, "Manual Input", null, ocrLanguage);
=======
    // Use current UI language for manually entered text
    onTextExtracted(text, "Manual Input", null, currentLanguage);
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
    setManualText("");
    setFile(null);
    setStatus({ type: "success", message: t('reader.manualTextLoaded') || "Manual text loaded into preview." });
  };

  const handleOCRSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus({ type: "danger", message: t('reader.selectImage') || "Please select an image file first." });
      return;
    }

    setLoading(true);
    setStatus(null);

<<<<<<< HEAD
    const formData = new FormData();
    formData.append("image", file);
    formData.append("language", ocrLanguage); // Use selected OCR language
=======
    // Convert UI language code to Tesseract code
    const tesseractLang = LANGUAGE_CODE_MAPPING[ocrLanguage] || 'eng';

    const formData = new FormData();
    formData.append("image", file);
    formData.append("language", tesseractLang); // Send Tesseract code (eng/hin/kan)

    console.log("📤 Sending OCR request:");
    console.log("- File:", file.name);
    console.log("- UI Language:", ocrLanguage);
    console.log("- Tesseract Language:", tesseractLang);
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682

    try {
      const response = await fetch(BACKEND_API_URL, {
        method: 'POST',
        body: formData,
      });

      const contentType = response.headers.get("content-type");
      
      console.log("🔍 Response Status:", response.status);
      console.log("🔍 Response Content-Type:", contentType);
      
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        console.error("❌ Non-JSON Response:", textResponse);
<<<<<<< HEAD
        throw new Error(t('reader.nonJsonResponse') || "Server returned a non-JSON response. Check backend logs.");
=======
        throw new Error(t('reader.nonJsonResponse') || "Server returned a non-JSON response.");
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
      }

      const result = await response.json();
      
      console.log("📦 Full Backend Response:", result);

      if (response.ok && result.success && result.extractedText) {
<<<<<<< HEAD
        console.log("✅ OCR Success:", result.extractedText);
        console.log("📝 Detected Language:", result.language || ocrLanguage);
        console.log("📜 Script:", result.script);
        
        setStatus({ type: "success", message: t('reader.ocrSuccess') || "OCR successful!" });
        
        // Pass the language from OCR result
=======
        console.log("✅ OCR Success:");
        console.log("- Extracted text length:", result.extractedText.length);
        console.log("- Detected language:", result.language);
        console.log("- Script:", result.script);
        console.log("- Text preview:", result.extractedText.substring(0, 100));
        
        setStatus({ type: "success", message: t('reader.ocrSuccess') || "OCR successful!" });
        
        // Pass the UI language code (en/hi/kn) not Tesseract code
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
        onTextExtracted(
          result.extractedText, 
          result.source || "OCR Upload", 
          file,
<<<<<<< HEAD
          result.language || ocrLanguage
=======
          result.language || ocrLanguage // Backend returns UI language code
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
        );
      } else {
        console.error("❌ OCR Error:", result.error || "Unknown error");
        console.error("❌ Full Error Response:", result);
<<<<<<< HEAD
        setStatus({
          type: "danger",
          message: result.error || t('reader.ocrFailed') || "OCR failed on server.",
        });
      }
    } catch (err) {
      console.error("Network error while calling OCR API:", err);
      setStatus({
        type: "danger",
        message: `${t('reader.networkError') || 'Network / server error'}: ${err.message}`,
=======
        
        let errorMessage = result.error || t('reader.ocrFailed') || "OCR failed on server.";
        
        if (result.help) {
          errorMessage += `\n\n💡 Help: ${result.help}`;
        }
        
        if (result.details) {
          errorMessage += `\n\n📋 Details: ${result.details}`;
        }
        
        setStatus({
          type: "danger",
          message: errorMessage,
        });
      }
    } catch (err) {
      console.error("❌ Network error while calling OCR API:", err);
      setStatus({
        type: "danger",
        message: `${t('reader.networkError') || 'Network error'}: ${err.message}`,
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-3 shadow-sm border-primary">
      <Card.Title className="text-primary h5 mb-3">
        📸 {t('reader.ocrImageReader') || 'OCR Image Reader'}
      </Card.Title>

      <h6 className="small fw-bold text-secondary">
        {t('reader.option1') || 'Option 1'}: {t('reader.uploadImage') || 'Upload Image'}
      </h6>
      <Form onSubmit={handleOCRSubmit} className="mb-3">
        {/* Language Selector */}
        <Form.Group className="mb-2">
          <Form.Label className="small mb-1">
<<<<<<< HEAD
            <strong>Select Image Language</strong>
=======
            <strong>📝 Select Image Language</strong>
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
          </Form.Label>
          <Form.Select 
            size="sm" 
            value={ocrLanguage}
            onChange={(e) => setOcrLanguage(e.target.value)}
            disabled={loading}
<<<<<<< HEAD
          >
            <option value="en">English (English)</option>
            <option value="hi">Hindi (हिंदी)</option>
            <option value="kn">Kannada (ಕನ್ನಡ)</option>
          </Form.Select>
          <Form.Text className="text-muted" style={{ fontSize: '0.75rem' }}>
            Choose the language of the text in your image
=======
            className="mb-1"
          >
            <option value="en">🇬🇧 English (English)</option>
            <option value="hi">🇮🇳 Hindi (हिंदी)</option>
            <option value="kn">🇮🇳 Kannada (ಕನ್ನಡ)</option>
          </Form.Select>
          <Form.Text className="text-muted" style={{ fontSize: '0.75rem' }}>
            ⚠️ Choose the language of text in your image for accurate OCR
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
          </Form.Text>
        </Form.Group>

        {/* File Upload */}
        <Form.Group className="mb-2">
          <Form.Control
            type="file"
            accept="image/*"
            size="sm"
            disabled={loading}
            onChange={handleFileChange}
          />
        </Form.Group>

        {/* Submit Button */}
        <Button
          variant="primary"
          type="submit"
          size="sm"
          disabled={loading || !file}
          className="w-100"
        >
          {loading ? (
<<<<<<< HEAD
            <Spinner animation="border" size="sm" />
          ) : (
            t('reader.runOcrLoadText') || "Run OCR & Load Text"
=======
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Processing OCR...
            </>
          ) : (
            <>🔍 {t('reader.runOcrLoadText') || "Run OCR & Load Text"}</>
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
          )}
        </Button>
      </Form>

      <div className="text-center small text-muted my-2">
        - {t('reader.or') || 'OR'} -
      </div>

      <h6 className="small fw-bold text-secondary">
        {t('reader.option2') || 'Option 2'}: {t('reader.manualText') || 'Manual Text'}
      </h6>
      <InputGroup className="mb-2">
        <FormControl
          as="textarea"
<<<<<<< HEAD
          rows={2}
          placeholder={t('reader.typeTextHere') || "Type text here..."}
=======
          rows={3}
          placeholder={t('reader.typeTextHere') || "Type or paste text here..."}
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
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
<<<<<<< HEAD
        {t('reader.loadManualText') || 'Load Manual Text'}
      </Button>

      {status && (
        <Alert variant={status.type} className="mt-3 small p-2">
          {status.message}
        </Alert>
      )}
=======
        ✓ {t('reader.loadManualText') || 'Load Manual Text'}
      </Button>

      {status && (
        <Alert variant={status.type} className="mt-3 small p-2" style={{ whiteSpace: 'pre-line' }}>
          {status.message}
        </Alert>
      )}
      
      {/* Debug Info */}
      {file && (
        <div className="mt-2 small text-muted" style={{ fontSize: '0.7rem' }}>
          <div>📁 File: {file.name}</div>
          <div>🌐 Selected Language: {ocrLanguage} → {LANGUAGE_CODE_MAPPING[ocrLanguage]}</div>
        </div>
      )}
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
    </Card>
  );
};

export default OCRUploader;