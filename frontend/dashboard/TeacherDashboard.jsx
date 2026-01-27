// frontend/dashboard/TeacherDashboard.jsx

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, ProgressBar, Button, Alert } from 'react-bootstrap';
import { 
  Users, TrendingUp, BookOpen, Award, Clock, Target,
  BarChart3, PieChart as PieIcon, UserCheck, AlertCircle 
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area, ComposedChart
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
const GRADIENT_COLORS = {
  primary: ['#667eea', '#764ba2'],
  success: ['#00f260', '#0575e6'],
  warning: ['#f093fb', '#f5576c'],
  info: ['#4facfe', '#00f2fe'],
};

function TeacherDashboard() {
  const teacherName = "Ms. Eleanor Vance";
  
  const [classStats, setClassStats] = useState({
    totalStudents: 24,
    activeToday: 18,
    weeklyAvgSessions: 4.5,
    classAvgWPM: 128,
    classAvgAccuracy: 85,
    totalReadingMinutes: 2840,
  });

  const [studentPerformance, setStudentPerformance] = useState([
    { id: 1, name: "Emma Thompson", sessions: 15, avgWPM: 145, accuracy: 92, progress: 85, status: "excellent" },
    { id: 2, name: "Liam Chen", sessions: 12, avgWPM: 138, accuracy: 88, progress: 78, status: "good" },
    { id: 3, name: "Olivia Martinez", sessions: 18, avgWPM: 152, accuracy: 94, progress: 92, status: "excellent" },
    { id: 4, name: "Noah Johnson", sessions: 8, avgWPM: 98, accuracy: 75, progress: 52, status: "needs-attention" },
    { id: 5, name: "Ava Williams", sessions: 14, avgWPM: 132, accuracy: 86, progress: 80, status: "good" },
    { id: 6, name: "Sophia Brown", sessions: 10, avgWPM: 115, accuracy: 80, progress: 65, status: "average" },
    { id: 7, name: "Jackson Davis", sessions: 16, avgWPM: 148, accuracy: 90, progress: 88, status: "excellent" },
    { id: 8, name: "Isabella Wilson", sessions: 6, avgWPM: 92, accuracy: 72, progress: 48, status: "needs-attention" },
  ]);

  const [weeklyEngagement, setWeeklyEngagement] = useState([
    { day: "Mon", students: 18, sessions: 28, avgTime: 45 },
    { day: "Tue", students: 20, sessions: 32, avgTime: 48 },
    { day: "Wed", students: 17, sessions: 25, avgTime: 42 },
    { day: "Thu", students: 22, sessions: 38, avgTime: 52 },
    { day: "Fri", students: 19, sessions: 30, avgTime: 46 },
    { day: "Sat", students: 12, sessions: 18, avgTime: 38 },
    { day: "Sun", students: 10, sessions: 15, avgTime: 35 },
  ]);

  const [skillsDistribution, setSkillsDistribution] = useState([
    { name: "Excellent (85-100%)", value: 8, color: "#00C49F" },
    { name: "Good (70-84%)", value: 10, color: "#0088FE" },
    { name: "Average (55-69%)", value: 4, color: "#FFBB28" },
    { name: "Needs Help (<55%)", value: 2, color: "#FF8042" },
  ]);

  const [progressTrend, setProgressTrend] = useState([
    { week: "Week 1", avgWPM: 115, accuracy: 78, engagement: 65 },
    { week: "Week 2", avgWPM: 120, accuracy: 80, engagement: 70 },
    { week: "Week 3", avgWPM: 125, accuracy: 82, engagement: 75 },
    { week: "Week 4", avgWPM: 128, accuracy: 85, engagement: 80 },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "excellent": return "success";
      case "good": return "info";
      case "average": return "warning";
      case "needs-attention": return "danger";
      default: return "secondary";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "excellent": return "🌟";
      case "good": return "✅";
      case "average": return "📊";
      case "needs-attention": return "⚠️";
      default: return "📝";
    }
  };

  return (
    <Container fluid className="py-4" style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", minHeight: "100vh" }}>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h1 className="display-4 fw-bold text-primary mb-2">
            <Users className="me-3" size={48} />
            Teacher Dashboard
          </h1>
          <p className="lead text-muted">Welcome back, {teacherName}! Monitor your class progress and student performance.</p>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-lg h-100" style={{ background: `linear-gradient(135deg, ${GRADIENT_COLORS.primary[0]}, ${GRADIENT_COLORS.primary[1]})` }}>
            <Card.Body className="text-white">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-1 opacity-75">Total Students</p>
                  <h2 className="display-5 fw-bold mb-0">{classStats.totalStudents}</h2>
                  <small className="opacity-75">{classStats.activeToday} active today</small>
                </div>
                <Users size={40} className="opacity-50" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="border-0 shadow-lg h-100" style={{ background: `linear-gradient(135deg, ${GRADIENT_COLORS.success[0]}, ${GRADIENT_COLORS.success[1]})` }}>
            <Card.Body className="text-white">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-1 opacity-75">Class Avg WPM</p>
                  <h2 className="display-5 fw-bold mb-0">{classStats.classAvgWPM}</h2>
                  <small className="opacity-75">+12% from last week</small>
                </div>
                <TrendingUp size={40} className="opacity-50" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="border-0 shadow-lg h-100" style={{ background: `linear-gradient(135deg, ${GRADIENT_COLORS.warning[0]}, ${GRADIENT_COLORS.warning[1]})` }}>
            <Card.Body className="text-white">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-1 opacity-75">Avg Accuracy</p>
                  <h2 className="display-5 fw-bold mb-0">{classStats.classAvgAccuracy}%</h2>
                  <small className="opacity-75">Class performance</small>
                </div>
                <Target size={40} className="opacity-50" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="border-0 shadow-lg h-100" style={{ background: `linear-gradient(135deg, ${GRADIENT_COLORS.info[0]}, ${GRADIENT_COLORS.info[1]})` }}>
            <Card.Body className="text-white">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-1 opacity-75">Total Minutes</p>
                  <h2 className="display-5 fw-bold mb-0">{classStats.totalReadingMinutes}</h2>
                  <small className="opacity-75">This month</small>
                </div>
                <Clock size={40} className="opacity-50" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row className="g-4 mb-4">
        <Col md={8}>
          <Card className="border-0 shadow-lg">
            <Card.Body>
              <h5 className="mb-4 d-flex align-items-center">
                <BarChart3 className="me-2 text-primary" />
                Weekly Engagement Overview
              </h5>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={weeklyEngagement}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="sessions" fill="#667eea" name="Total Sessions" />
                  <Line yAxisId="right" type="monotone" dataKey="students" stroke="#00C49F" strokeWidth={3} name="Active Students" />
                </ComposedChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="border-0 shadow-lg h-100">
            <Card.Body>
              <h5 className="mb-4 d-flex align-items-center">
                <PieIcon className="me-2 text-warning" />
                Student Performance
              </h5>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={skillsDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {skillsDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Progress Trend */}
      <Row className="g-4 mb-4">
        <Col md={12}>
          <Card className="border-0 shadow-lg">
            <Card.Body>
              <h5 className="mb-4 d-flex align-items-center">
                <TrendingUp className="me-2 text-success" />
                Class Progress Trend (Last 4 Weeks)
              </h5>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={progressTrend}>
                  <defs>
                    <linearGradient id="colorWPM" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00C49F" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }} />
                  <Legend />
                  <Area type="monotone" dataKey="avgWPM" stroke="#667eea" fillOpacity={1} fill="url(#colorWPM)" name="Avg WPM" />
                  <Area type="monotone" dataKey="accuracy" stroke="#00C49F" fillOpacity={1} fill="url(#colorAccuracy)" name="Avg Accuracy %" />
                </AreaChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Students Requiring Attention */}
      <Row className="g-4 mb-4">
        <Col md={12}>
          <Alert variant="warning" className="border-0 shadow-sm">
            <div className="d-flex align-items-center">
              <AlertCircle size={24} className="me-3" />
              <div>
                <strong>Students Requiring Attention:</strong> {studentPerformance.filter(s => s.status === "needs-attention").length} students need extra support
              </div>
            </div>
          </Alert>
        </Col>
      </Row>

      {/* Student Performance Table */}
      <Row className="g-4">
        <Col md={12}>
          <Card className="border-0 shadow-lg">
            <Card.Body>
              <h5 className="mb-4 d-flex align-items-center">
                <UserCheck className="me-2 text-info" />
                Individual Student Performance
              </h5>
              <Table hover responsive>
                <thead className="table-light">
                  <tr>
                    <th>Status</th>
                    <th>Student Name</th>
                    <th>Sessions</th>
                    <th>Avg WPM</th>
                    <th>Accuracy</th>
                    <th>Overall Progress</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {studentPerformance.map((student) => (
                    <tr key={student.id}>
                      <td className="text-center">
                        <span style={{ fontSize: "1.5rem" }}>{getStatusIcon(student.status)}</span>
                      </td>
                      <td>
                        <strong>{student.name}</strong>
                      </td>
                      <td>
                        <Badge bg="secondary">{student.sessions}</Badge>
                      </td>
                      <td>
                        <Badge bg={student.avgWPM > 140 ? "success" : student.avgWPM > 110 ? "info" : "warning"}>
                          {student.avgWPM} WPM
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={student.accuracy > 85 ? "success" : student.accuracy > 75 ? "info" : "danger"}>
                          {student.accuracy}%
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <ProgressBar 
                            now={student.progress} 
                            variant={getStatusColor(student.status)}
                            style={{ width: "150px", height: "20px" }}
                          />
                          <small className="fw-bold">{student.progress}%</small>
                        </div>
                      </td>
                      <td>
                        <Button 
                          variant={student.status === "needs-attention" ? "danger" : "outline-primary"} 
                          size="sm"
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="g-4 mt-4">
        <Col md={12}>
          <Card className="border-0 shadow-lg">
            <Card.Body>
              <h5 className="mb-3">Quick Actions</h5>
              <div className="d-flex gap-3 flex-wrap">
                <Button variant="primary" size="lg">
                  <BookOpen size={20} className="me-2" />
                  Assign Reading Material
                </Button>
                <Button variant="success" size="lg">
                  <Award size={20} className="me-2" />
                  Generate Progress Reports
                </Button>
                <Button variant="info" size="lg">
                  <Users size={20} className="me-2" />
                  Manage Students
                </Button>
                <Button variant="warning" size="lg">
                  <Target size={20} className="me-2" />
                  Set Class Goals
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default TeacherDashboard;