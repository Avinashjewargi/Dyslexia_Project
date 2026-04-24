// frontend/reader/OCRUploader.jsx - FIXED VERSION

import React, { useState, useEffect } from "react";
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

// Maps app language code → Tesseract language code
const LANGUAGE_CODE_MAPPING = {
  'en': 'eng',
  'hi': 'hin',
  'kn': 'kan',
  'ta': 'tam',
  'te': 'tel',
  'mr': 'mar',   // Marathi uses Hindi traineddata as fallback if mar not installed
  'bn': 'ben',
};

// Human-readable labels for the dropdown
const LANGUAGE_OPTIONS = [
  { code: 'en', label: '🇬🇧 English',          tessCode: 'eng' },
  { code: 'hi', label: '🇮🇳 Hindi (हिंदी)',     tessCode: 'hin' },
  { code: 'kn', label: '🇮🇳 Kannada (ಕನ್ನಡ)',  tessCode: 'kan' },
  { code: 'ta', label: '🇮🇳 Tamil (தமிழ்)',    tessCode: 'tam' },
  { code: 'te', label: '🇮🇳 Telugu (తెలుగు)',  tessCode: 'tel' },
];

// Instructions shown when OCR fails due to missing language pack
const MISSING_LANGPACK_HELP = {
  hin: `Tesseract Hindi pack missing. On your server run:
  Ubuntu/Debian: sudo apt-get install tesseract-ocr-hin
  Or download hin.traineddata from:
  https://github.com/tesseract-ocr/tessdata/blob/main/hin.traineddata
  and place it in your Tesseract tessdata folder.`,
  kan: `Tesseract Kannada pack missing. On your server run:
  Ubuntu/Debian: sudo apt-get install tesseract-ocr-kan
  Or download kan.traineddata from:
  https://github.com/tesseract-ocr/tessdata/blob/main/kan.traineddata
  and place it in your Tesseract tessdata folder.`,
  tam: `Tesseract Tamil pack missing. Run: sudo apt-get install tesseract-ocr-tam`,
  tel: `Tesseract Telugu pack missing. Run: sudo apt-get install tesseract-ocr-tel`,
};

const OCRUploader = ({ onTextExtracted }) => {
  const [file, setFile]             = useState(null);
  const [manualText, setManualText] = useState("");
  const [loading, setLoading]       = useState(false);
  const [status, setStatus]         = useState(null);
  const [ocrLanguage, setOcrLanguage] = useState("en");

  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();

  // FIX 2: Auto-sync OCR language selector with the app's current language
  useEffect(() => {
    if (currentLanguage && LANGUAGE_CODE_MAPPING[currentLanguage]) {
      setOcrLanguage(currentLanguage);
    }
  }, [currentLanguage]);

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
    onTextExtracted(text, "Manual Input", null, currentLanguage);
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

    const tesseractLang = LANGUAGE_CODE_MAPPING[ocrLanguage] || 'eng';

    const formData = new FormData();
    formData.append("image", file);
    formData.append("language", tesseractLang);

    try {
      const response = await fetch(BACKEND_API_URL, {
        method: 'POST',
        body: formData,
      });

      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        console.error("Non-JSON Response:", textResponse);
        throw new Error("Server returned a non-JSON response. Is the Flask server running?");
      }

      const result = await response.json();

      if (response.ok && result.success && result.extractedText) {
        // FIX 3: Warn user if OCR returned suspiciously short/garbled text
        const extractedText = result.extractedText.trim();
        const wordCount     = extractedText.split(/\s+/).filter(Boolean).length;

        // Heuristic: if language is non-English but output is all ASCII, likely garbled
        const isNonEnglish  = ocrLanguage !== 'en';
        const isAllAscii    = /^[\x00-\x7F]*$/.test(extractedText);
        const likelyGarbled = isNonEnglish && isAllAscii && wordCount > 3;

        if (likelyGarbled) {
          setStatus({
            type: "warning",
            message: `⚠️ OCR ran but the output looks incorrect — it appears as English characters instead of ${LANGUAGE_OPTIONS.find(l => l.code === ocrLanguage)?.label}.\n\nThis usually means the Tesseract language pack for this language is not installed on the server.\n\n${MISSING_LANGPACK_HELP[tesseractLang] || ''}`,
          });
          // Still load the text so user can see what was returned
          onTextExtracted(extractedText, result.source || "OCR Upload", file, ocrLanguage);
        } else {
          setStatus({ type: "success", message: t('reader.ocrSuccess') || "OCR successful!" });
          onTextExtracted(extractedText, result.source || "OCR Upload", file, result.language || ocrLanguage);
        }

      } else {
        // Server returned an error
        let errorMessage = result.error || t('reader.ocrFailed') || "OCR failed on server.";

        // FIX 3: Detect missing language pack error from Tesseract stderr messages
        const isMissingPack =
          errorMessage.toLowerCase().includes('failed loading language') ||
          errorMessage.toLowerCase().includes('traineddata') ||
          errorMessage.toLowerCase().includes('could not initialize tesseract') ||
          errorMessage.toLowerCase().includes('please make sure');

        if (isMissingPack) {
          const helpText = MISSING_LANGPACK_HELP[tesseractLang];
          errorMessage = `❌ Tesseract language pack for "${tesseractLang}" is not installed on the server.\n\n${helpText || 'Please install the required language pack on your server.'}`;
        } else {
          if (result.help)    errorMessage += `\n\n💡 Help: ${result.help}`;
          if (result.details) errorMessage += `\n\n📋 Details: ${result.details}`;
        }

        setStatus({ type: "danger", message: errorMessage });
      }

    } catch (err) {
      console.error("Network error while calling OCR API:", err);

      let errorMessage = err.message;
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        errorMessage = 'Cannot reach the OCR server at ' + BACKEND_API_URL + '.\n\nMake sure your Flask backend is running:\n  python app.py\n  (or: flask run)';
      }

      setStatus({ type: "danger", message: `Network error: ${errorMessage}` });
    } finally {
      setLoading(false);
    }
  };

  const selectedTessCode = LANGUAGE_CODE_MAPPING[ocrLanguage] || 'eng';

  return (
    <Card className="p-3 shadow-sm border-primary">
      <Card.Title className="text-primary h5 mb-3">
        📸 {t('reader.ocrImageReader') || 'OCR Image Reader'}
      </Card.Title>

      <h6 className="small fw-bold text-secondary">
        {t('reader.option1') || 'Option 1'}: {t('reader.uploadImage') || 'Upload Image'}
      </h6>

      <Form onSubmit={handleOCRSubmit} className="mb-3">
        <Form.Group className="mb-2">
          <Form.Label className="small mb-1">
            <strong>📝 {t('reader.selectImageLanguage') || 'Select Image Language'}</strong>
          </Form.Label>
          <Form.Select
            size="sm"
            value={ocrLanguage}
            onChange={(e) => {
              setOcrLanguage(e.target.value);
              setStatus(null); // clear old errors when language changes
            }}
            disabled={loading}
            className="mb-1"
          >
            {LANGUAGE_OPTIONS.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.label}</option>
            ))}
          </Form.Select>
          <Form.Text className="text-muted" style={{ fontSize: '0.75rem' }}>
            ⚠️ {t('reader.ocrLanguageHint') || 'Choose the language of text in your image for accurate OCR'}
          </Form.Text>
        </Form.Group>

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
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Processing OCR ({selectedTessCode})...
            </>
          ) : (
            <>🔍 {t('reader.runOcrLoadText') || "Run OCR & Load Text"}</>
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
          rows={3}
          placeholder={t('reader.typeTextHere') || "Type or paste text here..."}
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
        ✓ {t('reader.loadManualText') || 'Load Manual Text'}
      </Button>

      {status && (
        <Alert variant={status.type} className="mt-3 small p-2" style={{ whiteSpace: 'pre-line' }}>
          {status.message}
        </Alert>
      )}

      {file && !loading && (
        <div className="mt-2 small text-muted" style={{ fontSize: '0.7rem' }}>
          <div>📁 File: {file.name}</div>
          <div>🌐 Language: {ocrLanguage} → Tesseract: <code>{selectedTessCode}</code></div>
        </div>
      )}
    </Card>
  );
};

export default OCRUploader;