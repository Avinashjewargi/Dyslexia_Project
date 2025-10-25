// frontend/dashboard/StudentDashboard.jsx

import React, { useState, useEffect } from 'react'; // IMPORT useEffect and useState
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';
import AppFooter from '../components/Footer';
import Settings from '../components/Settings'; 
import AppProgressBar from '../components/ProgressBar'; // Use the real ProgressBar

function StudentDashboard() {
  // 1. STATE MANAGEMENT: Initialize state for profile data and loading status
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. DATA FETCHING: Use the useEffect hook to fetch data when the component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Because of the proxy setup (Step 12), we can use a relative path /api
        const response = await fetch('/api/student-profile');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProfile(data); // Store the fetched data
      } catch (e) {
        console.error("Failed to fetch student profile:", e);
        setError("Could not load student data. Check backend server.");
      } finally {
        setLoading(false); // End loading regardless of success/fail
      }
    };

    fetchProfile();
  }, []); // The empty array ensures this runs only ONCE after initial render

  // 3. Conditional Rendering while loading
  if (loading) {
    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <Spinner animation="border" role="status" className="me-2" />
            <span>Loading Adaptive Assistant Data...</span>
        </div>
    );
  }

  // 4. Conditional Rendering for error
  if (error || !profile) {
    return <Alert variant="danger" className="m-5">{error}</Alert>;
  }

  // Destructure data for clean usage (replacing dummy data)
  const { name, readingLevel, weeklyGoalHours, weeklyProgressHours } = profile;
  const weeklyProgressPercent = Math.round((weeklyProgressHours / weeklyGoalHours) * 100);

  // --- RENDER CONTENT (using real 'profile' data) ---
  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar />

      <Container className="my-5 flex-grow-1">
        <h1 className="mb-4">Welcome Back, {name}! 👋</h1>
        <p className="lead">Your personalized reading hub and progress tracking.</p>

        <Row className="g-4">

          {/* Column 1: Progress and Goals */}
          <Col md={7}>
            <Card className="shadow-sm h-100 p-3">
              <Card.Body>
                <Card.Title as="h3" className="mb-4">My Reading Progress</Card.Title>

                <Row className="mb-4">
                    <Col>
                        <Card.Text>Current Reading Level: **{readingLevel}**</Card.Text>
                    </Col>
                    <Col>
                        <Card.Text>Weekly Goal: **{weeklyGoalHours} Hours**</Card.Text>
                    </Col>
                </Row>

                {/* Using the REAL AppProgressBar component */}
                <AppProgressBar 
                  label={`Weekly Reading Time (${weeklyProgressHours} / ${weeklyGoalHours} Hours)`} 
                  value={weeklyProgressPercent}
                  variant="primary"
                />

                <AppProgressBar 
                  label="Accuracy Improvement" 
                  value={65}
                  variant="info"
                />

                <div className="mt-4">
                    <Button variant="success" size="lg" className="me-3">
                      Start New Reading Session
                    </Button>
                    <Button variant="outline-secondary">
                      Review Challenging Words
                    </Button>
                </div>

              </Card.Body>
            </Card>
          </Col>

          {/* Column 2: Settings and Quick Tools */}
          <Col md={5}>
            <Settings /> 
          </Col>

        </Row>

      </Container>

      <AppFooter />
    </div>
  );
}

export default StudentDashboard;