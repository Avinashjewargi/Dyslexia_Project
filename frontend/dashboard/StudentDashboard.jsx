import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Row, Col, ProgressBar } from 'react-bootstrap';
import { fetchReadingSessions } from '../utils/firebase'; 

const StudentDashboard = ({ userId }) => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recentSession, setRecentSession] = useState(null);

    useEffect(() => {
        const currentUserId = userId || "local-dev-user";

        const loadSessions = async () => {
            setLoading(true);
            try {
                const fetchedSessions = await fetchReadingSessions(currentUserId);
                setSessions(fetchedSessions);
                
                if (fetchedSessions.length > 0) {
                    const sorted = [...fetchedSessions].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                    setRecentSession(sorted[0]);
                    setSessions(sorted);
                }
            } catch (error) {
                console.error("Dashboard Error:", error);
            } finally {
                setLoading(false);
            }
        };
        loadSessions();
    }, [userId]);

    const formatTime = (val) => {
        const seconds = Number(val);
        if (isNaN(seconds)) return '0:00';
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    };

    if (loading) {
        return (
            <Container className="my-5 text-center">
                <ProgressBar animated now={100} label="Loading Data..." />
            </Container>
        );
    }
    
    return (
        <Container className="my-5">
            <h2 className="mb-4 text-primary">My Reading Progress</h2>
            
            {sessions.length === 0 ? (
                <Card className="p-5 text-center shadow-sm bg-light">
                    <Card.Body>
                        <h3>No Reading History Yet 📚</h3>
                        <p className="text-muted">Go to the <strong>Reader</strong> page to start your first session!</p>
                    </Card.Body>
                </Card>
            ) : (
                <>
                    {recentSession && (
                        <Row className="mb-4">
                            <Col md={12}>
                                <Card className="shadow-sm border-primary">
                                    <Card.Header className="bg-primary text-white">Last Session Overview</Card.Header>
                                    <Card.Body>
                                        <Row className="text-center">
                                            <Col md={4}>
                                                <h3>{Math.round(recentSession.wpm || 0)}</h3>
                                                <span className="text-muted">Words Per Minute</span>
                                            </Col>
                                            <Col md={4}>
                                                <h3>{formatTime(recentSession.readingTimeSec)}</h3>
                                                <span className="text-muted">Duration</span>
                                            </Col>
                                            <Col md={4}>
                                                <h3>{recentSession.analysis?.difficulty_score || 0}</h3>
                                                <span className="text-muted">Text Difficulty</span>
                                            </Col>
                                        </Row>
                                        <div className="mt-3 pt-3 border-top">
                                            <strong>Difficult Words Found: </strong>
                                            {recentSession.analysis?.difficult_words?.length > 0 ? (
                                                <span className="text-danger">
                                                    {recentSession.analysis.difficult_words.join(', ')}
                                                </span>
                                            ) : (
                                                <span className="text-success">None! Great job!</span>
                                            )}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    )}

                    <Card className="shadow-sm">
                        <Card.Header>Session History</Card.Header>
                        <Table hover responsive className="mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th>Date</th>
                                    <th>Source Text</th>
                                    <th>WPM</th>
                                    <th>Time</th>
                                    <th>Difficulty</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sessions.map((session) => (
                                    <tr key={session.id}>
                                        <td>{new Date(session.timestamp).toLocaleDateString()} {new Date(session.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                                        <td className="text-truncate" style={{maxWidth: '200px'}}>
                                            {session.analysis?.source || 'Unknown'}
                                        </td>
                                        <td>{Math.round(session.wpm || 0)}</td>
                                        <td>{formatTime(session.readingTimeSec)}</td>
                                        <td>
                                            <span className={`badge ${session.analysis?.difficulty_score > 0.5 ? 'bg-warning text-dark' : 'bg-success'}`}>
                                                {session.analysis?.difficulty_score || 0}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card>
                </>
            )}
        </Container>
    );
};

export default StudentDashboard; 