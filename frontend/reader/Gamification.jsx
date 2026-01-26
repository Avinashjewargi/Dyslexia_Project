// frontend/reader/Gamification.jsx (NEW VERSION)

import React from 'react';
import { Card, Badge, ProgressBar } from 'react-bootstrap';

const Gamification = ({ score, badges, streak, sessionPoints, pointsBreakdown }) => {
    // Calculate total points if breakdown provided
    const totalBreakdownPoints = pointsBreakdown 
        ? Object.values(pointsBreakdown).reduce((sum, val) => sum + val, 0)
        : score;

    return (
        <Card className="shadow-sm p-3 bg-light text-center border-success h-100">
            <h5 className="text-success mb-3">🏆 My Achievements</h5>
            
            {/* Total Points with Animation */}
            <div className="d-flex justify-content-between small mb-2 px-3">
                <strong>Total Points:</strong> 
                <span className="badge bg-primary rounded-pill fs-6" 
                      style={{ 
                          transition: 'all 0.3s ease',
                          transform: score > 0 ? 'scale(1.1)' : 'scale(1)'
                      }}>
                    {score}
                </span>
            </div>

            {/* Session Points (NEW) */}
            {sessionPoints > 0 && (
                <div className="d-flex justify-content-between small mb-2 px-3 text-success">
                    <strong>This Session:</strong> 
                    <span className="fw-bold">+{sessionPoints} pts 🎉</span>
                </div>
            )}
            
            {/* Reading Streak */}
            <div className="d-flex justify-content-between small px-3 mb-3">
                <strong>Reading Streak:</strong> 
                <span className="text-warning fw-bold">{streak} Days 🔥</span>
            </div>

            {/* Points Breakdown Progress Bar (NEW) */}
            {pointsBreakdown && totalBreakdownPoints > 0 && (
                <div className="mb-3 border-top pt-3">
                    <small className="text-muted d-block mb-2">Points Breakdown:</small>
                    <ProgressBar style={{ height: '25px' }}>
                        {pointsBreakdown.reading > 0 && (
                            <ProgressBar 
                                variant="success" 
                                now={(pointsBreakdown.reading / totalBreakdownPoints) * 100}
                                label={`Reading ${pointsBreakdown.reading}`}
                                key={1}
                            />
                        )}
                        {pointsBreakdown.pronunciation > 0 && (
                            <ProgressBar 
                                variant="info" 
                                now={(pointsBreakdown.pronunciation / totalBreakdownPoints) * 100}
                                label={`STT ${pointsBreakdown.pronunciation}`}
                                key={2}
                            />
                        )}
                        {pointsBreakdown.stories > 0 && (
                            <ProgressBar 
                                variant="warning" 
                                now={(pointsBreakdown.stories / totalBreakdownPoints) * 100}
                                label={`Stories ${pointsBreakdown.stories}`}
                                key={3}
                            />
                        )}
                        {pointsBreakdown.games > 0 && (
                            <ProgressBar 
                                variant="danger" 
                                now={(pointsBreakdown.games / totalBreakdownPoints) * 100}
                                label={`Games ${pointsBreakdown.games}`}
                                key={4}
                            />
                        )}
                    </ProgressBar>
                </div>
            )}
            
            {/* Badges Section */}
            <div className="border-top pt-3">
                <small className="d-block text-muted mb-2 fw-bold">Badges Earned:</small>
                <div className="d-flex flex-wrap justify-content-center gap-2">
                    {badges && badges.length > 0 ? (
                        badges.map((badge, index) => (
                            <Badge key={index} bg="secondary" className="p-2">
                                {badge}
                            </Badge>
                        ))
                    ) : (
                        <small className="text-muted fst-italic">No badges yet. Keep reading!</small>
                    )}
                </div>
            </div>
            
            <button className="btn btn-outline-success btn-sm mt-4 w-100">
                View Leaderboard
            </button>
        </Card>
    );
};

// Default props
Gamification.defaultProps = {
    sessionPoints: 0,
    pointsBreakdown: null
};

export default Gamification;