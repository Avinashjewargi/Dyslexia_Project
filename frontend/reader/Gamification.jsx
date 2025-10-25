// frontend/reader/Gamification.jsx

import React from 'react';
import { Card, Badge, ListGroup, Button } from 'react-bootstrap';

/**
 * Component to display gamification elements like points, badges, and streaks.
 * @param {number} points - The student's current point total.
 * @param {number} readingStreak - The number of consecutive days the student has read.
 * @param {Array<string>} badges - List of earned badge names.
 */
function Gamification({ points = 150, readingStreak = 7, badges = ['Focus Star', 'Weekly Goal'] }) {

  return (
    <Card className="shadow-sm border-success">
      <Card.Header className="bg-success text-white">
        <h5 className="mb-0">My Achievements 🏆</h5>
      </Card.Header>
      <Card.Body>

        {/* Points Display */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="text-primary mb-0">Total Points:</h4>
          <Badge bg="primary" style={{ fontSize: '1.5rem' }}>{points}</Badge>
        </div>

        {/* Streak */}
        <div className="text-center mb-3 p-2 border rounded">
            <h6 className="mb-0">Reading Streak: 
                <span className="text-warning ms-2" style={{ fontSize: '1.2rem' }}>
                    {readingStreak} Days 🔥
                </span>
            </h6>
        </div>

        {/* Badges List */}
        <h6 className="mt-3">Badges Earned:</h6>
        <ListGroup horizontal className="justify-content-center">
          {badges.length > 0 ? (
            badges.map((badge, index) => (
              <ListGroup.Item key={index} className="p-2 me-1 bg-light border-0">
                <Badge pill bg="secondary">{badge}</Badge>
              </ListGroup.Item>
            ))
          ) : (
            <p className="text-muted">No badges yet. Keep reading!</p>
          )}
        </ListGroup>

      </Card.Body>
      <Card.Footer className="text-center">
        <Button variant="outline-success" size="sm">View Leaderboard</Button>
      </Card.Footer>
    </Card>
  );
}

export default Gamification;