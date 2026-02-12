// frontend/reader/Gamification.jsx

import React, { useState } from 'react';
import { Card, Badge, ProgressBar, Modal, Table } from 'react-bootstrap';
import { Trophy, Medal, Award, Star, TrendingUp, Zap } from 'lucide-react';

const Gamification = ({ score, badges, streak, sessionPoints, pointsBreakdown }) => {
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    // Mock leaderboard data (in real app, fetch from backend)
    const leaderboardData = [
        { rank: 1, name: "Olivia Martinez", points: 9200, sessions: 18, avgWPM: 152, accuracy: 94, badge: "🌟", color: "#FFD700" },
        { rank: 2, name: "Jackson Davis", points: 8800, sessions: 16, avgWPM: 148, accuracy: 90, badge: "🥈", color: "#C0C0C0" },
        { rank: 3, name: "Emma Thompson", points: 8500, sessions: 15, avgWPM: 145, accuracy: 92, badge: "🥉", color: "#CD7F32" },
        { rank: 4, name: "Liam Chen", points: 7800, sessions: 12, avgWPM: 138, accuracy: 88, badge: "⭐", color: "#4A90E2" },
        { rank: 5, name: "Ava Williams", points: 7200, sessions: 14, avgWPM: 132, accuracy: 86, badge: "✨", color: "#7B68EE" },
        { rank: 6, name: "Sophia Brown", points: 6500, sessions: 10, avgWPM: 115, accuracy: 80, badge: "📚", color: "#50C878" },
        { rank: 7, name: "Noah Johnson", points: 5200, sessions: 8, avgWPM: 98, accuracy: 75, badge: "💪", color: "#FF6B6B" },
        { rank: 8, name: "Isabella Wilson", points: 4800, sessions: 6, avgWPM: 92, accuracy: 72, badge: "🎯", color: "#95A5A6" },
    ];

    // Calculate total points if breakdown provided
    const totalBreakdownPoints = pointsBreakdown 
        ? Object.values(pointsBreakdown).reduce((sum, val) => sum + val, 0)
        : score;

    const getRankIcon = (rank) => {
        if (rank === 1) return <Trophy size={24} className="text-warning" />;
        if (rank === 2) return <Medal size={24} className="text-secondary" />;
        if (rank === 3) return <Award size={24} style={{ color: "#CD7F32" }} />;
        return <Star size={20} className="text-muted" />;
    };

    return (
        <>
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

                {/* Session Points */}
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

                {/* Points Breakdown Progress Bar */}
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
                
                <button 
                    className="btn btn-outline-success btn-sm mt-4 w-100"
                    onClick={() => setShowLeaderboard(true)}
                >
                    <Trophy size={16} className="me-2" />
                    View Full Leaderboard
                </button>

                {/* Top 5 Students - Inside the Box */}
                <div className="mt-3 border-top pt-3">
                    <small className="d-block text-muted mb-3 fw-bold text-center">
                        <Star size={14} className="me-1" />
                        Top 5 Students
                    </small>
                    {leaderboardData.slice(0, 5).map((student, index) => (
                        <div 
                            key={student.rank}
                            className="d-flex align-items-center justify-content-between mb-2 p-2 rounded"
                            style={{ 
                                background: index === 0 
                                    ? "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)" 
                                    : index === 1 
                                    ? "linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 100%)"
                                    : index === 2
                                    ? "linear-gradient(135deg, #CD7F32 0%, #D4A574 100%)"
                                    : "#f8f9fa",
                                border: index <= 2 ? "2px solid rgba(255,255,255,0.2)" : "1px solid #dee2e6"
                            }}
                        >
                            <div className="d-flex align-items-center">
                                <div 
                                    className="rounded-circle d-flex align-items-center justify-content-center me-2"
                                    style={{
                                        width: "28px",
                                        height: "28px",
                                        background: index <= 2 ? "rgba(255,255,255,0.3)" : "#dee2e6",
                                        fontWeight: "bold",
                                        fontSize: "0.75rem",
                                        color: index <= 2 ? "white" : "#495057"
                                    }}
                                >
                                    {student.rank}
                                </div>
                                <div>
                                    <div 
                                        className="fw-bold" 
                                        style={{ 
                                            fontSize: "0.8rem",
                                            color: index <= 2 ? "white" : "#212529"
                                        }}
                                    >
                                        {student.badge} {student.name}
                                    </div>
                                    <small 
                                        style={{ 
                                            fontSize: "0.65rem",
                                            color: index <= 2 ? "rgba(255,255,255,0.9)" : "#6c757d"
                                        }}
                                    >
                                        {student.avgWPM} WPM • {student.accuracy}%
                                    </small>
                                </div>
                            </div>
                            <Badge 
                                bg={index === 0 ? "light" : index === 1 ? "dark" : index === 2 ? "warning" : "secondary"}
                                text={index === 0 ? "dark" : "white"}
                                className="px-2 py-1"
                                style={{ fontSize: "0.7rem" }}
                            >
                                <Zap size={12} />
                                {student.points}
                            </Badge>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Leaderboard Modal */}
            <Modal 
                show={showLeaderboard} 
                onHide={() => setShowLeaderboard(false)}
                size="lg"
                centered
            >
                <Modal.Header closeButton className="border-0" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                    <Modal.Title className="text-white w-100 text-center">
                        <Trophy size={32} className="me-2" />
                        Class Leaderboard
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-0">
                    {/* Top 3 Podium */}
                    <div className="p-4" style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
                        <div className="row justify-content-center align-items-end">
                            {/* 2nd Place */}
                            <div className="col-4 text-center">
                                <div 
                                    className="card shadow-lg border-0 p-3 mb-2"
                                    style={{ 
                                        background: "linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 100%)",
                                        transform: "translateY(20px)"
                                    }}
                                >
                                    <Medal size={40} className="mx-auto mb-2" style={{ color: "#C0C0C0" }} />
                                    <h6 className="mb-1">{leaderboardData[1].name}</h6>
                                    <h4 className="mb-0 fw-bold">{leaderboardData[1].points}</h4>
                                    <small className="text-muted">points</small>
                                </div>
                                <div className="bg-secondary text-white fw-bold py-2 rounded">
                                    2nd
                                </div>
                            </div>

                            {/* 1st Place */}
                            <div className="col-4 text-center">
                                <div 
                                    className="card shadow-lg border-0 p-3 mb-2"
                                    style={{ background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)" }}
                                >
                                    <Trophy size={48} className="mx-auto mb-2 text-white" />
                                    <h5 className="mb-1 fw-bold text-white">{leaderboardData[0].name}</h5>
                                    <h3 className="mb-0 fw-bold text-white">{leaderboardData[0].points}</h3>
                                    <small className="text-white">points</small>
                                </div>
                                <div className="bg-warning text-white fw-bold py-3 rounded">
                                    <Star size={20} className="me-1" />
                                    1st
                                </div>
                            </div>

                            {/* 3rd Place */}
                            <div className="col-4 text-center">
                                <div 
                                    className="card shadow-lg border-0 p-3 mb-2"
                                    style={{ 
                                        background: "linear-gradient(135deg, #CD7F32 0%, #D4A574 100%)",
                                        transform: "translateY(40px)"
                                    }}
                                >
                                    <Award size={36} className="mx-auto mb-2 text-white" />
                                    <h6 className="mb-1 text-white">{leaderboardData[2].name}</h6>
                                    <h5 className="mb-0 fw-bold text-white">{leaderboardData[2].points}</h5>
                                    <small className="text-white">points</small>
                                </div>
                                <div className="text-white fw-bold py-2 rounded" style={{ background: "#CD7F32" }}>
                                    3rd
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Full Leaderboard Table */}
                    <div className="p-3">
                        <h6 className="mb-3 text-center text-muted">
                            <TrendingUp size={18} className="me-2" />
                            Full Rankings
                        </h6>
                        <Table hover responsive className="mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="text-center">Rank</th>
                                    <th>Student</th>
                                    <th className="text-center">Points</th>
                                    <th className="text-center">Sessions</th>
                                    <th className="text-center">Avg WPM</th>
                                    <th className="text-center">Accuracy</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboardData.map((student) => (
                                    <tr 
                                        key={student.rank}
                                        style={{ 
                                            background: student.rank <= 3 ? `${student.color}15` : "transparent",
                                            borderLeft: student.rank <= 3 ? `4px solid ${student.color}` : "none"
                                        }}
                                    >
                                        <td className="text-center align-middle">
                                            <div className="d-flex align-items-center justify-content-center">
                                                {getRankIcon(student.rank)}
                                                <span className="ms-2 fw-bold">{student.rank}</span>
                                            </div>
                                        </td>
                                        <td className="align-middle">
                                            <div className="d-flex align-items-center">
                                                <span className="fs-4 me-2">{student.badge}</span>
                                                <strong>{student.name}</strong>
                                            </div>
                                        </td>
                                        <td className="text-center align-middle">
                                            <Badge 
                                                bg={student.rank === 1 ? "warning" : student.rank === 2 ? "secondary" : student.rank === 3 ? "info" : "light"}
                                                text={student.rank <= 3 ? "white" : "dark"}
                                                className="px-3 py-2"
                                            >
                                                <Zap size={14} className="me-1" />
                                                {student.points}
                                            </Badge>
                                        </td>
                                        <td className="text-center align-middle">
                                            <Badge bg="primary">{student.sessions}</Badge>
                                        </td>
                                        <td className="text-center align-middle">
                                            <Badge bg={student.avgWPM > 140 ? "success" : student.avgWPM > 110 ? "info" : "warning"}>
                                                {student.avgWPM} WPM
                                            </Badge>
                                        </td>
                                        <td className="text-center align-middle">
                                            <Badge bg={student.accuracy > 85 ? "success" : student.accuracy > 75 ? "info" : "danger"}>
                                                {student.accuracy}%
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-0 bg-light">
                    <small className="text-muted w-100 text-center">
                        Keep reading to climb the leaderboard! 📚
                    </small>
                </Modal.Footer>
            </Modal>
        </>
    );
};

// Default props
Gamification.defaultProps = {
    sessionPoints: 0,
    pointsBreakdown: null
};

export default Gamification;