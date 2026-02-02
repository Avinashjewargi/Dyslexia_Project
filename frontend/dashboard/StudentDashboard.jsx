// frontend/dashboard/StudentDashboard.jsx (WITH TRANSLATIONS)

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Badge, ProgressBar, Alert, Table, Dropdown } from "react-bootstrap";
import { 
  BookOpen, Trophy, Flame, Target, Clock, TrendingUp, 
  Award, Star, Calendar, Brain, Zap, CheckCircle, BarChart3, Globe 
} from "lucide-react";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, AreaChart, Area, RadarChart, 
  Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from "recharts";
import { fetchReadingSessions } from "../utils/firebase";
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
const GRADIENT_COLORS = {
  primary: ['#667eea', '#764ba2'],
  success: ['#00f260', '#0575e6'],
  warning: ['#f093fb', '#f5576c'],
  info: ['#4facfe', '#00f2fe'],
};

const StudentDashboard = ({ userId }) => {
  const { t } = useTranslation();
  const { currentLanguage, languageConfig } = useLanguage();
  
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [languageFilter, setLanguageFilter] = useState('all'); // 'all' or specific language code
  
  // Realistic mock data based on actual activity
  const [stats, setStats] = useState({
    totalWordsRead: 0,
    readingStreak: 0,
    totalPoints: 0,
    level: 1,
    weeklyGoal: 75,
    weeklyProgress: 0,
    accuracyRate: 0,
    averageWPM: 0,
    totalMinutes: 0,
    badgesEarned: 0,
    sessionsCompleted: 0,
  });

  const [weeklyData, setWeeklyData] = useState([]);
  const [skillsData, setSkillsData] = useState([
    { skill: t('dashboard.skills.phonology', 'Phonology'), score: 0, fullMark: 100 },
    { skill: t('dashboard.skills.fluency', 'Fluency'), score: 0, fullMark: 100 },
    { skill: t('dashboard.skills.comprehension', 'Comprehension'), score: 0, fullMark: 100 },
    { skill: t('dashboard.skills.vocabulary', 'Vocabulary'), score: 0, fullMark: 100 },
    { skill: t('dashboard.skills.accuracy', 'Accuracy'), score: 0, fullMark: 100 },
  ]);

  const [activityData, setActivityData] = useState([]);
  const [difficultyDistribution, setDifficultyDistribution] = useState([]);

  useEffect(() => {
    const uid = userId || "local-dev-user";
    loadDashboardData(uid);
  }, [userId]);

  // Update filtered sessions when language filter changes
  useEffect(() => {
    if (languageFilter === 'all') {
      setFilteredSessions(sessions);
    } else {
      const filtered = sessions.filter(s => s.language === languageFilter);
      setFilteredSessions(filtered);
    }
  }, [languageFilter, sessions]);

  // Recalculate stats when filtered sessions change
  useEffect(() => {
    if (filteredSessions.length > 0) {
      calculateStatistics(filteredSessions);
      generateWeeklyData(filteredSessions);
      generateActivityData(filteredSessions);
      generateDifficultyDistribution(filteredSessions);
    }
  }, [filteredSessions, t]);

  const loadDashboardData = async (uid) => {
    setLoading(true);
    try {
      const fetched = await fetchReadingSessions(uid);
      const sorted = [...fetched].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      setSessions(sorted);
      setFilteredSessions(sorted);
      
      // Calculate real statistics from sessions
      calculateStatistics(sorted);
      generateWeeklyData(sorted);
      generateActivityData(sorted);
      generateDifficultyDistribution(sorted);
      
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = (sessions) => {
    if (sessions.length === 0) {
      // Reset stats if no sessions
      setStats({
        totalWordsRead: 0,
        readingStreak: 0,
        totalPoints: 0,
        level: 1,
        weeklyGoal: 75,
        weeklyProgress: 0,
        accuracyRate: 0,
        averageWPM: 0,
        totalMinutes: 0,
        badgesEarned: 0,
        sessionsCompleted: 0,
      });
      return;
    }

    const totalWords = sessions.reduce((sum, s) => {
      const wpm = s.wpm || 0;
      const time = (s.readingTimeSec || 0) / 60;
      return sum + (wpm * time);
    }, 0);

    const avgWPM = sessions.reduce((sum, s) => sum + (s.wpm || 0), 0) / sessions.length;
    const totalTime = sessions.reduce((sum, s) => sum + (s.readingTimeSec || 0), 0);
    const avgAccuracy = sessions.reduce((sum, s) => {
      const diff = s.analysis?.difficulty_score || 0;
      return sum + (1 - diff) * 100;
    }, 0) / sessions.length;

    // Calculate streak (sessions in consecutive days)
    const streak = calculateStreak(sessions);
    
    const weekProgress = (sessions.filter(s => {
      const date = new Date(s.timestamp);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    }).length / 7) * 100;

    setStats({
      totalWordsRead: Math.round(totalWords),
      readingStreak: streak,
      totalPoints: Math.round(totalWords / 10) + (sessions.length * 50),
      level: Math.floor(sessions.length / 5) + 1,
      weeklyGoal: 75,
      weeklyProgress: Math.min(weekProgress, 100),
      accuracyRate: Math.round(avgAccuracy),
      averageWPM: Math.round(avgWPM),
      totalMinutes: Math.round(totalTime / 60),
      badgesEarned: calculateBadges(sessions),
      sessionsCompleted: sessions.length,
    });

    // Update skills based on performance
    setSkillsData([
      { skill: t('dashboard.skills.phonology', 'Phonology'), score: Math.min(avgAccuracy + 5, 100), fullMark: 100 },
      { skill: t('dashboard.skills.fluency', 'Fluency'), score: Math.min((avgWPM / 200) * 100, 100), fullMark: 100 },
      { skill: t('dashboard.skills.comprehension', 'Comprehension'), score: Math.min(avgAccuracy, 100), fullMark: 100 },
      { skill: t('dashboard.skills.vocabulary', 'Vocabulary'), score: Math.min(avgAccuracy - 5, 100), fullMark: 100 },
      { skill: t('dashboard.skills.accuracy', 'Accuracy'), score: Math.min(avgAccuracy, 100), fullMark: 100 },
    ]);
  };

  const calculateStreak = (sessions) => {
    if (sessions.length === 0) return 0;
    
    const dates = sessions.map(s => new Date(s.timestamp).toDateString());
    const uniqueDates = [...new Set(dates)].sort((a, b) => new Date(b) - new Date(a));
    
    let streak = 0;
    let currentDate = new Date();
    
    for (let dateStr of uniqueDates) {
      const sessionDate = new Date(dateStr);
      const diffDays = Math.floor((currentDate - sessionDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const calculateBadges = (sessions) => {
    let badges = 0;
    if (sessions.length >= 5) badges++;
    if (sessions.length >= 10) badges++;
    if (sessions.some(s => (s.wpm || 0) > 150)) badges++;
    if (sessions.filter(s => s.analysis?.difficulty_score < 0.3).length >= 3) badges++;
    return badges;
  };

  const generateWeeklyData = (sessions) => {
    const days = [
      t('dashboard.days.sun', 'Sun'),
      t('dashboard.days.mon', 'Mon'),
      t('dashboard.days.tue', 'Tue'),
      t('dashboard.days.wed', 'Wed'),
      t('dashboard.days.thu', 'Thu'),
      t('dashboard.days.fri', 'Fri'),
      t('dashboard.days.sat', 'Sat')
    ];
    const weekData = days.map(day => ({ day, words: 0, accuracy: 0, time: 0, count: 0 }));
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    sessions.filter(s => new Date(s.timestamp) >= weekAgo).forEach(s => {
      const dayIndex = new Date(s.timestamp).getDay();
      const wpm = s.wpm || 0;
      const time = (s.readingTimeSec || 0) / 60;
      const words = wpm * time;
      
      weekData[dayIndex].words += words;
      weekData[dayIndex].accuracy += (1 - (s.analysis?.difficulty_score || 0)) * 100;
      weekData[dayIndex].time += s.readingTimeSec || 0;
      weekData[dayIndex].count++;
    });
    
    weekData.forEach(d => {
      if (d.count > 0) {
        d.words = Math.round(d.words);
        d.accuracy = Math.round(d.accuracy / d.count);
        d.time = Math.round(d.time / 60);
      }
    });
    
    setWeeklyData(weekData);
  };

  const generateActivityData = (sessions) => {
    const last30Days = sessions.slice(0, 30).reverse();
    const activity = last30Days.map((s, idx) => ({
      session: `S${idx + 1}`,
      wpm: Math.round(s.wpm || 0),
      accuracy: Math.round((1 - (s.analysis?.difficulty_score || 0)) * 100),
    }));
    setActivityData(activity);
  };

  const generateDifficultyDistribution = (sessions) => {
    const distribution = [
      { name: t('dashboard.difficulty.easy', 'Easy'), value: 0, color: '#00C49F' },
      { name: t('dashboard.difficulty.medium', 'Medium'), value: 0, color: '#FFBB28' },
      { name: t('dashboard.difficulty.hard', 'Hard'), value: 0, color: '#FF8042' },
    ];
    
    sessions.forEach(s => {
      const diff = s.analysis?.difficulty_score || 0;
      if (diff < 0.3) distribution[0].value++;
      else if (diff < 0.7) distribution[1].value++;
      else distribution[2].value++;
    });
    
    setDifficultyDistribution(distribution);
  };

  const formatTime = (sec) => {
    if (!sec) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Get unique languages from sessions
  const getAvailableLanguages = () => {
    const languages = new Set(sessions.map(s => s.language).filter(Boolean));
    return Array.from(languages);
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }}></div>
        <h4 className="mt-3">{t('dashboard.loading', 'Loading your dashboard...')}</h4>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4" style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", minHeight: "100vh" }}>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="display-4 fw-bold text-primary mb-2">
                <Trophy className="me-3" size={48} />
                {t('dashboard.title', 'My Learning Dashboard')}
              </h1>
              <p className="lead text-muted">{t('dashboard.subtitle', 'Track your reading progress and achievements')}</p>
            </div>
            
            {/* Language Filter */}
            {sessions.length > 0 && (
              <Dropdown>
                <Dropdown.Toggle variant="outline-primary" id="language-filter">
                  <Globe size={18} className="me-2" />
                  {languageFilter === 'all' 
                    ? t('dashboard.allLanguages', 'All Languages')
                    : languageFilter.toUpperCase()
                  }
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item 
                    active={languageFilter === 'all'} 
                    onClick={() => setLanguageFilter('all')}
                  >
                    {t('dashboard.allLanguages', 'All Languages')}
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  {getAvailableLanguages().map(lang => (
                    <Dropdown.Item 
                      key={lang}
                      active={languageFilter === lang}
                      onClick={() => setLanguageFilter(lang)}
                    >
                      {lang.toUpperCase()}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-lg h-100" style={{ background: `linear-gradient(135deg, ${GRADIENT_COLORS.primary[0]}, ${GRADIENT_COLORS.primary[1]})` }}>
            <Card.Body className="text-white">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-1 opacity-75">{t('dashboard.stats.totalWords', 'Total Words Read')}</p>
                  <h2 className="display-5 fw-bold mb-0">{stats.totalWordsRead.toLocaleString()}</h2>
                </div>
                <BookOpen size={40} className="opacity-50" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="border-0 shadow-lg h-100" style={{ background: `linear-gradient(135deg, ${GRADIENT_COLORS.warning[0]}, ${GRADIENT_COLORS.warning[1]})` }}>
            <Card.Body className="text-white">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-1 opacity-75">{t('dashboard.stats.readingStreak', 'Reading Streak')}</p>
                  <h2 className="display-5 fw-bold mb-0">
                    {stats.readingStreak} <small className="fs-5">{t('dashboard.stats.days', 'days')}</small>
                  </h2>
                </div>
                <Flame size={40} className="opacity-50" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="border-0 shadow-lg h-100" style={{ background: `linear-gradient(135deg, ${GRADIENT_COLORS.success[0]}, ${GRADIENT_COLORS.success[1]})` }}>
            <Card.Body className="text-white">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-1 opacity-75">{t('dashboard.stats.totalPoints', 'Total Points')}</p>
                  <h2 className="display-5 fw-bold mb-0">{stats.totalPoints.toLocaleString()}</h2>
                </div>
                <Star size={40} className="opacity-50" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="border-0 shadow-lg h-100" style={{ background: `linear-gradient(135deg, ${GRADIENT_COLORS.info[0]}, ${GRADIENT_COLORS.info[1]})` }}>
            <Card.Body className="text-white">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-1 opacity-75">{t('dashboard.stats.currentLevel', 'Current Level')}</p>
                  <h2 className="display-5 fw-bold mb-0">{stats.level}</h2>
                </div>
                <Trophy size={40} className="opacity-50" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Progress & Performance */}
      <Row className="g-4 mb-4">
        <Col md={6}>
          <Card className="border-0 shadow-lg h-100">
            <Card.Body>
              <h5 className="mb-4 d-flex align-items-center">
                <Target className="me-2 text-primary" />
                {t('dashboard.weeklyGoal', 'Weekly Goal Progress')}
              </h5>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>{t('dashboard.weeklySessions', 'Weekly Sessions')}</span>
                  <strong className="text-primary">{Math.round(stats.weeklyProgress)}%</strong>
                </div>
                <ProgressBar 
                  now={stats.weeklyProgress} 
                  variant="primary"
                  style={{ height: "30px" }}
                  label={`${Math.round(stats.weeklyProgress)}%`}
                  animated
                />
              </div>

              <Row className="mt-4">
                <Col xs={6}>
                  <div className="text-center p-3 bg-light rounded">
                    <Clock className="mb-2 text-info" size={32} />
                    <h4 className="mb-0">{stats.totalMinutes}</h4>
                    <small className="text-muted">{t('dashboard.totalMinutes', 'Total Minutes')}</small>
                  </div>
                </Col>
                <Col xs={6}>
                  <div className="text-center p-3 bg-light rounded">
                    <Zap className="mb-2 text-warning" size={32} />
                    <h4 className="mb-0">{stats.averageWPM}</h4>
                    <small className="text-muted">{t('dashboard.avgWPM', 'Avg WPM')}</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="border-0 shadow-lg h-100">
            <Card.Body>
              <h5 className="mb-4 d-flex align-items-center">
                <Brain className="me-2 text-success" />
                {t('dashboard.skillsRadar', 'Reading Skills Radar')}
              </h5>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={skillsData}>
                  <PolarGrid stroke="#e0e0e0" />
                  <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name={t('dashboard.skills.label', 'Skills')} dataKey="score" stroke="#667eea" fill="#667eea" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
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
                <TrendingUp className="me-2 text-primary" />
                {t('dashboard.weeklyActivity', 'Weekly Reading Activity')}
              </h5>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorWords" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }} />
                  <Area type="monotone" dataKey="words" stroke="#667eea" fillOpacity={1} fill="url(#colorWords)" name={t('dashboard.words', 'Words')} />
                </AreaChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="border-0 shadow-lg h-100">
            <Card.Body>
              <h5 className="mb-4 d-flex align-items-center">
                <BarChart3 className="me-2 text-warning" />
                {t('dashboard.contentDifficulty', 'Content Difficulty')}
              </h5>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={difficultyDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {difficultyDistribution.map((entry, index) => (
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

      {/* Performance Metrics */}
      <Row className="g-4 mb-4">
        <Col md={12}>
          <Card className="border-0 shadow-lg">
            <Card.Body>
              <h5 className="mb-4 d-flex align-items-center">
                <Calendar className="me-2 text-info" />
                {t('dashboard.performanceOverTime', 'Performance Over Time (Last 30 Sessions)')}
              </h5>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="session" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="wpm" stroke="#667eea" strokeWidth={3} name="WPM" />
                  <Line yAxisId="right" type="monotone" dataKey="accuracy" stroke="#00C49F" strokeWidth={3} name={t('dashboard.accuracy', 'Accuracy %')} />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Achievements & Recent Sessions */}
      <Row className="g-4">
        <Col md={4}>
          <Card className="border-0 shadow-lg">
            <Card.Body>
              <h5 className="mb-4 d-flex align-items-center">
                <Award className="me-2 text-warning" />
                {t('dashboard.achievements', 'Achievements')}
              </h5>
              <div className="d-flex flex-wrap gap-2">
                {stats.badgesEarned >= 1 && (
                  <Badge bg="warning" className="p-3" style={{ fontSize: "1rem" }}>
                    🏆 {t('dashboard.badges.first5', 'First 5 Sessions')}
                  </Badge>
                )}
                {stats.badgesEarned >= 2 && (
                  <Badge bg="success" className="p-3" style={{ fontSize: "1rem" }}>
                    ⭐ {t('dashboard.badges.master10', '10 Sessions Master')}
                  </Badge>
                )}
                {stats.badgesEarned >= 3 && (
                  <Badge bg="info" className="p-3" style={{ fontSize: "1rem" }}>
                    🚀 {t('dashboard.badges.speedReader', 'Speed Reader')}
                  </Badge>
                )}
                {stats.badgesEarned >= 4 && (
                  <Badge bg="danger" className="p-3" style={{ fontSize: "1rem" }}>
                    🎯 {t('dashboard.badges.accuracyPro', 'Accuracy Pro')}
                  </Badge>
                )}
                {stats.badgesEarned === 0 && (
                  <Alert variant="light">
                    <small>{t('dashboard.noBadges', 'Keep reading to unlock achievements!')}</small>
                  </Alert>
                )}
              </div>
              
              <div className="mt-4">
                <h6 className="mb-3">{t('dashboard.quickStats', 'Quick Stats')}</h6>
                <div className="d-flex justify-content-between mb-2">
                  <span>{t('dashboard.sessionsCompleted', 'Sessions Completed')}</span>
                  <strong>{stats.sessionsCompleted}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>{t('dashboard.accuracyRate', 'Accuracy Rate')}</span>
                  <strong>{stats.accuracyRate}%</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>{t('dashboard.badgesEarned', 'Badges Earned')}</span>
                  <strong>{stats.badgesEarned} / 4</strong>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="border-0 shadow-lg">
            <Card.Body>
              <h5 className="mb-4 d-flex align-items-center">
                <CheckCircle className="me-2 text-success" />
                {t('dashboard.recentSessions', 'Recent Reading Sessions')}
              </h5>
              <Table hover responsive>
                <thead className="table-light">
                  <tr>
                    <th>{t('dashboard.table.date', 'Date')}</th>
                    <th>{t('dashboard.table.source', 'Source')}</th>
                    <th>{t('dashboard.table.wpm', 'WPM')}</th>
                    <th>{t('dashboard.table.time', 'Time')}</th>
                    <th>{t('dashboard.table.difficulty', 'Difficulty')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSessions.slice(0, 5).map((s, idx) => (
                    <tr key={idx}>
                      <td>
                        {new Date(s.timestamp).toLocaleDateString()}<br />
                        <small className="text-muted">
                          {new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </small>
                      </td>
                      <td>
                        {s.analysis?.source || t('dashboard.unknown', 'Unknown')}
                        {s.language && (
                          <div>
                            <Badge bg="secondary" className="mt-1">
                              {s.language.toUpperCase()}
                            </Badge>
                          </div>
                        )}
                      </td>
                      <td>
                        <Badge bg={s.wpm > 150 ? "success" : s.wpm > 100 ? "info" : "warning"}>
                          {Math.round(s.wpm || 0)} WPM
                        </Badge>
                      </td>
                      <td>{formatTime(s.readingTimeSec)}</td>
                      <td>
                        <Badge bg={s.analysis?.difficulty_score > 0.7 ? "danger" : s.analysis?.difficulty_score > 0.4 ? "warning" : "success"}>
                          {(s.analysis?.difficulty_score || 0).toFixed(2)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {filteredSessions.length === 0 && (
                <Alert variant="info">
                  <p className="mb-0">
                    {languageFilter === 'all' 
                      ? t('dashboard.noSessions', 'No reading sessions yet. Start reading to see your progress!')
                      : t('dashboard.noSessionsFiltered', 'No sessions found for the selected language.')
                    }
                  </p>
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentDashboard;
