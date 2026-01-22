
import React, { useState, useEffect } from "react";
import { Card, Button, Spinner, Badge, Row, Col } from "react-bootstrap";
import { Volume2, Check, X } from "lucide-react";

const WordLearning = ({ word, onComplete, onSkip }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [syllables, setSyllables] = useState([]);

  useEffect(() => {
    if (word) {
      fetchWordImage(word);
      breakIntoSyllables(word);
    }
  }, [word]);

 
  const fetchWordImage = async (searchWord) => {
    setIsLoadingImage(true);
    try {

      const response = await fetch(
        `https://source.unsplash.com/400x300/?${encodeURIComponent(searchWord)}`
      );
      setImageUrl(response.url);
    } catch (error) {
      console.error("Error loading image:", error);
    
      setImageUrl(`https://via.placeholder.com/400x300/4CAF50/ffffff?text=${searchWord}`);
    } finally {
      setIsLoadingImage(false);
    }
  };


  const breakIntoSyllables = (word) => {
    const vowels = "aeiouAEIOU";
    const syllableArray = [];
    let currentSyllable = "";

    for (let i = 0; i < word.length; i++) {
      currentSyllable += word[i];

      if (
        i === word.length - 1 ||
        (vowels.includes(word[i]) && !vowels.includes(word[i + 1]))
      ) {
        syllableArray.push(currentSyllable);
        currentSyllable = "";
      }
    }

  
    if (syllableArray.length === 0 || syllableArray.length === 1) {
      const chunkSize = Math.ceil(word.length / Math.ceil(word.length / 3));
      for (let i = 0; i < word.length; i += chunkSize) {
        syllableArray.push(word.slice(i, i + chunkSize));
      }
    }

    setSyllables(syllableArray);
  };

  
  const speakWord = (textToSpeak, rate = 0.7) => {
    if ("speechSynthesis" in window) {
  
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = rate; 
      utterance.pitch = 1.1;
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);

      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, your browser doesn't support text-to-speech!");
    }
  };

  const handlePracticeDone = () => {
    speakWord("Great job!");
    setTimeout(() => {
      onComplete(word);
    }, 1500);
  };

  return (
    <Card className="shadow-lg border-0 mb-4" style={{ backgroundColor: "#FFF9E6" }}>
      <Card.Body className="p-4">
        {/* Header */}
        <div className="text-center mb-3">
          <h3 className="text-primary" style={{ fontSize: "2rem", fontWeight: "bold" }}>
            Let's Learn: <span className="text-success">{word}</span>
          </h3>
        </div>

        <Row>
          {/* Image Section */}
          <Col md={6} className="mb-3">
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-2">
                {isLoadingImage ? (
                  <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : (
                  <img
                    src={imageUrl}
                    alt={word}
                    className="img-fluid rounded"
                    style={{ width: "100%", height: "300px", objectFit: "cover" }}
                  />
                )}
                <div className="text-center mt-2">
                  <Badge bg="info" style={{ fontSize: "1.2rem", padding: "10px 20px" }}>
                    {word}
                  </Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Learning Section */}
          <Col md={6}>
            {/* Syllable Breakdown */}
            <Card className="mb-3 border-warning" style={{ backgroundColor: "#FFFACD" }}>
              <Card.Body>
                <h5 className="text-center mb-3">
                  <strong>Break it down:</strong>
                </h5>
                <div className="d-flex justify-content-center flex-wrap gap-2">
                  {syllables.map((syllable, index) => (
                    <Button
                      key={index}
                      variant="outline-primary"
                      size="lg"
                      style={{
                        fontSize: "1.8rem",
                        fontWeight: "bold",
                        padding: "15px 25px",
                        borderWidth: "3px",
                        letterSpacing: "0.1em",
                      }}
                      onClick={() => speakWord(syllable, 0.6)}
                    >
                      {syllable}
                    </Button>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {/* Pronunciation Buttons */}
            <Card className="mb-3 border-success" style={{ backgroundColor: "#E8F5E9" }}>
              <Card.Body>
                <h5 className="text-center mb-3">
                  <strong>Listen & Repeat:</strong>
                </h5>
                <div className="d-grid gap-2">
                  <Button
                    variant="success"
                    size="lg"
                    onClick={() => speakWord(word, 0.7)}
                    disabled={isSpeaking}
                    style={{ fontSize: "1.3rem", padding: "15px" }}
                  >
                    <Volume2 size={24} className="me-2" />
                    {isSpeaking ? "Speaking..." : "Say the Word"}
                  </Button>

                  <Button
                    variant="info"
                    size="lg"
                    onClick={() => speakWord(word, 0.4)}
                    disabled={isSpeaking}
                    style={{ fontSize: "1.3rem", padding: "15px" }}
                  >
                    <Volume2 size={24} className="me-2" />
                    Slow Motion
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {/* Action Buttons */}
            <div className="d-flex gap-2">
              <Button
                variant="primary"
                size="lg"
                className="flex-fill"
                onClick={handlePracticeDone}
                style={{ fontSize: "1.2rem", padding: "15px" }}
              >
                <Check size={24} className="me-2" />
                I Got It!
              </Button>
              <Button
                variant="outline-secondary"
                size="lg"
                onClick={() => onSkip(word)}
                style={{ fontSize: "1.2rem", padding: "15px" }}
              >
                <X size={24} className="me-2" />
                Skip
              </Button>
            </div>
          </Col>
        </Row>

        {/* Fun Fact Section */}
        <Card className="mt-3 border-0" style={{ backgroundColor: "#E1F5FE" }}>
          <Card.Body className="text-center">
            <p style={{ fontSize: "1.1rem", margin: 0 }}>
              🌟 <strong>Tip:</strong> Click on each syllable to hear it separately!
            </p>
          </Card.Body>
        </Card>
      </Card.Body>
    </Card>
  );
};

export default WordLearning;