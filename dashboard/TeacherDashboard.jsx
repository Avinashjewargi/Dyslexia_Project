// frontend/dashboard/TeacherDashboard.jsx

import React from 'react';
import { Container, Row, Col, Card, ListGroup, Button, Table } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';
import AppFooter from '../components/Footer';

function TeacherDashboard() {
  // Dummy data for demonstration
  const teacherName = "Ms. Eleanor Vance";
  const totalStudents = 18;
  const classAverageDifficultyScore = 0.65;
  const recentStudents = [
    { id: 1, name: "Alex B.", sessions: 5, avgScore: 0.72 },
    { id: 2, name: "Jamie C.", sessions: 3, avgScore: 0.58 },
    { id: 3, name: "Taylor D.", sessions: 4, avgScore: 0.68 },
  ];

  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar />

      <Container className="my-5 flex-grow-1">
        <h1 className="mb-4">Welcome, {teacherName} (Teacher Dashboard)</h1>
        <p className="lead">Manage your students and view class-wide adaptive reading analytics.</p>

        <Row className="g-4 mb-5">

          {/* Card 1: Class Summary */}
          <Col md={4}>
            <Card className="shadow-sm h-100 bg-info text-white">
              <Card.Body>
                <Card.Title as="h4">Total Students</Card.Title>
                <Card.Text className="display-4">{totalStudents}</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          {/* Card 2: Key Metric */}
          <Col md={4}>
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title as="h4">Avg. Difficulty Score</Card.Title>
                <Card.Text className="display-4 text-warning">
                  {classAverageDifficultyScore.toFixed(2)}
                </Card.Text>
                <Card.Text className="text-muted">Class-wide reading complexity</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          {/* Card 3: Quick Actions */}
          <Col md={4}>
            <Card className="shadow-sm h-100 p-3">
              <Card.Body>
                <Card.Title as="h4" className="mb-3">Quick Actions</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item action variant="light">Add New Student</ListGroup.Item>
                  <ListGroup.Item action variant="light">Generate Report</ListGroup.Item>
                  <ListGroup.Item action variant="light">View All Analytics</ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Student Activity Table */}
        <h3 className="mb-3">Recent Student Activity</h3>
        <Card className="shadow-sm">
            <Table striped bordered hover responsive className="mb-0">
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Reading Sessions (Last Week)</th>
                        <th>Avg. Accuracy Score</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {recentStudents.map(student => (
                        <tr key={student.id}>
                            <td>{student.name}</td>
                            <td>{student.sessions}</td>
                            <td>{(student.avgScore * 100).toFixed(0)}%</td>
                            <td>
                                <Button variant="outline-primary" size="sm">View Profile</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Card>

      </Container>

      <AppFooter />
    </div>
  );
}

export default TeacherDashboard;