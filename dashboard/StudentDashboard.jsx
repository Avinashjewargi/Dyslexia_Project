import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Row, Col, ProgressBar, Badge, Alert } from 'react-bootstrap';
import { fetchReadingSessions } from '../utils/firebase'; 

// Dummy data for 3 students' story progress
const DUMMY_STORY_PROGRESS = {
    "student-emma-2024": {
        userId: "student-emma-2024",
        name: "Emma Thompson",
        totalStories: 7,
        totalDifficultWords: 12,
        difficultWords: ["thirsty", "crow", "stones", "honest", "purse", "praised", "lazy", "greedy", "bone", "seed", "soil", "grew"],
        stories: [
            { title: "The Thirsty Crow", timesRead: 3, difficultWords: ["thirsty", "crow", "stones"] },
            { title: "The Honest Boy", timesRead: 2, difficultWords: ["honest", "purse", "praised"] },
            { title: "The Lazy Cat", timesRead: 2, difficultWords: ["lazy"] },
            { title: "The Greedy Dog", timesRead: 1, difficultWords: ["greedy", "bone"] },
            { title: "The Small Seed", timesRead: 2, difficultWords: ["seed", "soil", "grew"] },
            { title: "The Kind Dog", timesRead: 1, difficultWords: [] },
            { title: "The Brave Ant", timesRead: 1, difficultWords: [] }
        ]
    },
    "student-liam-2024": {
        userId: "student-liam-2024",
        name: "Liam Chen",
        totalStories: 5,
        totalDifficultWords: 8,
        difficultWords: ["thirsty", "pot", "honest", "praised", "lazy", "slept", "brave", "safe"],
        stories: [
            { title: "The Thirsty Crow", timesRead: 4, difficultWords: ["thirsty", "pot"] },
            { title: "The Honest Boy", timesRead: 2, difficultWords: ["honest", "praised"] },
            { title: "The Lazy Cat", timesRead: 3, difficultWords: ["lazy", "slept"] },
            { title: "The Brave Ant", timesRead: 2, difficultWords: ["brave", "safe"] },
            { title: "The Happy Bird", timesRead: 1, difficultWords: [] }
        ]
    },
    "student-sophia-2024": {
        userId: "student-sophia-2024",
        name: "Sophia Martinez",
        totalStories: 9,
        totalDifficultWords: 15,
        difficultWords: ["thirsty", "stones", "honest", "purse", "lazy", "greedy", "bone", "seed", "soil", "grew", "brave", "safe", "happy", "sang", "smiled"],
        stories: [
            { title: "The Thirsty Crow", timesRead: 2, difficultWords: ["thirsty", "stones"] },
            { title: "The Kind Dog", timesRead: 2, difficultWords: [] },
            { title: "The Honest Boy", timesRead: 3, difficultWords: ["honest", "purse"] },
            { title: "The Lazy Cat", timesRead: 1, difficultWords: ["lazy"] },
            { title: "The Happy Bird", timesRead: 2, difficultWords: ["happy", "sang", "smiled"] },
            { title: "The Brave Ant", timesRead: 2, difficultWords: ["brave", "safe"] },
            { title: "The Greedy Dog", timesRead: 1, difficultWords: ["greedy", "bone"] },
            { title: "The Small Seed", timesRead: 2, difficultWords: ["seed", "soil", "grew"] },
            { title: "The Helping Friend", timesRead: 1, difficultWords: [] }
        ]
    }
};

const StudentDashboard = ({ userId }) => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recentSession, setRecentSession] = useState(null);
    const [allStudentsProgress, setAllStudentsProgress] = useState([]);

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

                // Load dummy story progress data
                setAllStudentsProgress(Object.values(DUMMY_STORY_PROGRESS));
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

                    <Card className="shadow-sm mb-4">
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
                                {sessions.slice(0, 5).map((session) => (
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

                    {/* NEW: Story Progress Section */}
                    <h3 className="mb-3 mt-5 text-primary">📖 Story Reading Progress</h3>
                    <Alert variant="info" className="mb-3">
                        <strong>Note:</strong> This section shows progress for multiple students in the class. Click on "Stories" in the Reader page to start reading!
                    </Alert>

                    {allStudentsProgress.map((student, idx) => (
                        <Card key={idx} className="shadow-sm mb-3">
                            <Card.Header className="bg-light">
                                <Row className="align-items-center">
                                    <Col md={8}>
                                        <h5 className="mb-0">👤 {student.name}</h5>
                                        <small className="text-muted">ID: {student.userId}</small>
                                    </Col>
                                    <Col md={4} className="text-end">
                                        <Badge bg="primary" className="me-2">
                                            {student.totalStories} Stories Read
                                        </Badge>
                                        <Badge bg="warning" text="dark">
                                            {student.totalDifficultWords} Difficult Words
                                        </Badge>
                                    </Col>
                                </Row>
                            </Card.Header>
                            <Card.Body>
                                {/* Stories Progress Table */}
                                <h6 className="mb-3">Stories Completed:</h6>
                                <Table size="sm" bordered hover className="mb-3">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Story Title</th>
                                            <th>Times Read</th>
                                            <th>Difficult Words</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {student.stories.map((story, storyIdx) => (
                                            <tr key={storyIdx}>
                                                <td>{story.title}</td>
                                                <td>
                                                    <Badge bg="success">{story.timesRead}x</Badge>
                                                </td>
                                                <td>
                                                    {story.difficultWords.length > 0 ? (
                                                        <div className="d-flex flex-wrap gap-1">
                                                            {story.difficultWords.map((word, wordIdx) => (
                                                                <Badge key={wordIdx} bg="warning" text="dark" className="small">
                                                                    {word}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <Badge bg="success">None! ✓</Badge>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>

                                {/* All Difficult Words Summary */}
                                <Card className="bg-light border-warning">
                                    <Card.Body>
                                        <h6 className="text-warning mb-2">🎯 All Difficult Words for {student.name.split(' ')[0]}:</h6>
                                        <div className="d-flex flex-wrap gap-2">
                                            {student.difficultWords.map((word, wordIdx) => (
                                                <Badge key={wordIdx} bg="warning" text="dark" style={{ fontSize: '0.9rem' }}>
                                                    {word}
                                                </Badge>
                                            ))}
                                        </div>
                                        <p className="small text-muted mt-2 mb-0">
                                            💡 These words need extra practice!
                                        </p>
                                    </Card.Body>
                                </Card>
                            </Card.Body>
                        </Card>
                    ))}
                </>
            )}
        </Container>
    );
};

export default StudentDashboard;