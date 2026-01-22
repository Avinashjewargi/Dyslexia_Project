//frontend/reader/Gamification.jsx


import React from 'react';
import { Card, Badge } from 'react-bootstrap';

const Gamification = ({ score, badges, streak }) => {
    return (
        <Card className="shadow-sm p-3 bg-light text-center border-success h-100">
            <h5 className="text-success mb-3">🏆 My Achievements</h5>
            
            <div className="d-flex justify-content-between small mb-2 px-3">
                <strong>Total Points:</strong> 
                <span className="badge bg-primary rounded-pill fs-6">{score}</span>
            </div>
            
            <div className="d-flex justify-content-between small px-3">
                <strong>Reading Streak:</strong> 
                <span className="text-warning fw-bold">{streak} Days 🔥</span>
            </div>
            
            <div className="mt-4 border-top pt-3">
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
            
            <button className="btn btn-outline-success btn-sm mt-4 w-100">View Leaderboard</button>
        </Card>
    );
};

export default Gamification;