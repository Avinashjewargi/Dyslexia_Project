// frontend/reader/Gamification.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Badge, ProgressBar, Modal, Table, Spinner, Alert } from 'react-bootstrap';
import { Trophy, Medal, Award, Star, TrendingUp, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const API = 'http://localhost:5000/api';

function getAuthToken() {
  return (
    localStorage.getItem('dyslexia_token') ||
    sessionStorage.getItem('dyslexia_token') ||
    null
  );
}

const Gamification = ({ user, score, badges, streak, sessionPoints, pointsBreakdown, myRank }) => {
  const { t } = useTranslation();
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardRows, setLeaderboardRows] = useState([]);
  const [loadingBoard, setLoadingBoard] = useState(false);
  const [boardError, setBoardError] = useState(null);

  const isStudentWithAuth =
    user &&
    user.role === 'student' &&
    getAuthToken();

  const loadLeaderboard = useCallback(async () => {
    if (!isStudentWithAuth) {
      setLeaderboardRows([]);
      return;
    }
    setLoadingBoard(true);
    setBoardError(null);
    try {
      const token = getAuthToken();
      const res = await fetch(
        `${API}/storage/leaderboard?period=alltime&limit=5&sortBy=totalPoints`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to load leaderboard');
      }
      const rows = (data.leaderboard || []).map((entry) => ({
        rank: entry.rank,
        name:
          entry.userName ||
          (entry.userId && typeof entry.userId === 'object' && entry.userId.name) ||
          t('reader.leaderboardStudent', 'Student'),
        points: entry.totalPoints ?? 0,
        sessions: entry.gamesPlayed ?? 0,
        avgWPM: entry.averageWPM ?? 0,
        accuracy: entry.averageAccuracy ?? 0,
      }));
      setLeaderboardRows(rows);
    } catch (e) {
      console.error(e);
      setBoardError(e.message || 'Network error');
      setLeaderboardRows([]);
    } finally {
      setLoadingBoard(false);
    }
  }, [isStudentWithAuth, t]);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  const totalBreakdownPoints = pointsBreakdown
    ? Object.values(pointsBreakdown).reduce((sum, val) => sum + val, 0)
    : score;

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy size={24} className="text-warning" />;
    if (rank === 2) return <Medal size={24} className="text-secondary" />;
    if (rank === 3) return <Award size={24} style={{ color: '#CD7F32' }} />;
    return <Star size={20} className="text-muted" />;
  };

  return (
    <>
      <Card className="shadow-sm p-3 bg-light text-center border-success h-100">
        <h5 className="text-success mb-3">
          🏆 {t('reader.myAchievements', 'My Achievements')}
        </h5>

        <div className="d-flex justify-content-between small mb-2 px-3">
          <strong>{t('reader.totalPoints', 'Total Points')}:</strong>
          <span
            className="badge bg-primary rounded-pill fs-6"
            style={{
              transition: 'all 0.3s ease',
              transform: score > 0 ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            {score}
          </span>
        </div>

        {isStudentWithAuth && myRank != null && (
          <div className="d-flex justify-content-between small mb-2 px-3 text-primary">
            <strong>{t('reader.yourRank', 'Your rank')}:</strong>
            <span className="fw-bold">#{myRank}</span>
          </div>
        )}

        {sessionPoints > 0 && (
          <div className="d-flex justify-content-between small mb-2 px-3 text-success">
            <strong>{t('reader.pointsThisSession', 'This session')}:</strong>
            <span className="fw-bold">+{sessionPoints} pts 🎉</span>
          </div>
        )}

        <div className="d-flex justify-content-between small px-3 mb-3">
          <strong>{t('reader.readingStreak', 'Reading streak')}:</strong>
          <span className="text-warning fw-bold">{streak} {t('reader.daysFire', 'days')} 🔥</span>
        </div>

        {pointsBreakdown && totalBreakdownPoints > 0 && (
          <div className="mb-3 border-top pt-3">
            <small className="text-muted d-block mb-2">
              {t('reader.pointsBreakdown', 'Points breakdown (this page)')}:
            </small>
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

        <div className="border-top pt-3">
          <small className="d-block text-muted mb-2 fw-bold">
            {t('reader.badgesEarned', 'Badges earned')}:
          </small>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            {badges && badges.length > 0 ? (
              badges.map((badge, index) => (
                <Badge key={index} bg="secondary" className="p-2">
                  {badge}
                </Badge>
              ))
            ) : (
              <small className="text-muted fst-italic">
                {t('reader.noBadgesYet', 'No badges yet. Keep reading!')}
              </small>
            )}
          </div>
        </div>

        <button
          type="button"
          className="btn btn-outline-success btn-sm mt-4 w-100"
          onClick={() => {
            setShowLeaderboard(true);
            loadLeaderboard();
          }}
          disabled={!isStudentWithAuth}
        >
          <Trophy size={16} className="me-2" />
          {t('reader.viewLeaderboard', 'View leaderboard')}
        </button>

        {!isStudentWithAuth && (
          <Alert variant="light" className="small mt-2 mb-0 py-2 text-start border">
            {t(
              'reader.leaderboardLoginHint',
              'Log in as a student to save points and see the top 5 leaderboard.'
            )}
          </Alert>
        )}

        <div className="mt-3 border-top pt-3">
          <small className="d-block text-muted mb-3 fw-bold text-center">
            <Star size={14} className="me-1" />
            {t('reader.topFiveStudents', 'Top 5 students')}
          </small>
          {loadingBoard && (
            <div className="py-3">
              <Spinner animation="border" size="sm" />
            </div>
          )}
          {boardError && !loadingBoard && isStudentWithAuth && (
            <small className="text-danger">{boardError}</small>
          )}
          {!loadingBoard &&
            isStudentWithAuth &&
            leaderboardRows.length === 0 &&
            !boardError && (
              <small className="text-muted">
                {t('reader.leaderboardEmpty', 'No rankings yet — be the first to earn points!')}
              </small>
            )}
          {!loadingBoard &&
            leaderboardRows.map((student, index) => (
              <div
                key={`${student.rank}-${student.name}`}
                className="d-flex align-items-center justify-content-between mb-2 p-2 rounded"
                style={{
                  background:
                    index === 0
                      ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                      : index === 1
                        ? 'linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 100%)'
                        : index === 2
                          ? 'linear-gradient(135deg, #CD7F32 0%, #D4A574 100%)'
                          : '#f8f9fa',
                  border:
                    index <= 2 ? '2px solid rgba(255,255,255,0.2)' : '1px solid #dee2e6',
                }}
              >
                <div className="d-flex align-items-center text-start overflow-hidden">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center me-2 flex-shrink-0"
                    style={{
                      width: '28px',
                      height: '28px',
                      background: index <= 2 ? 'rgba(255,255,255,0.3)' : '#dee2e6',
                      fontWeight: 'bold',
                      fontSize: '0.75rem',
                      color: index <= 2 ? 'white' : '#495057',
                    }}
                  >
                    {student.rank}
                  </div>
                  <div className="min-w-0">
                    <div
                      className="fw-bold text-truncate"
                      style={{
                        fontSize: '0.8rem',
                        color: index <= 2 ? 'white' : '#212529',
                        maxWidth: '140px',
                      }}
                      title={student.name}
                    >
                      {student.name}
                    </div>
                    <small
                      style={{
                        fontSize: '0.65rem',
                        color: index <= 2 ? 'rgba(255,255,255,0.9)' : '#6c757d',
                      }}
                    >
                      {student.avgWPM} WPM • {student.accuracy}%
                    </small>
                  </div>
                </div>
                <Badge
                  bg={index === 0 ? 'light' : index === 1 ? 'dark' : index === 2 ? 'warning' : 'secondary'}
                  text={index === 0 ? 'dark' : 'white'}
                  className="px-2 py-1 flex-shrink-0 ms-1"
                  style={{ fontSize: '0.7rem' }}
                >
                  <Zap size={12} />
                  {student.points}
                </Badge>
              </div>
            ))}
        </div>
      </Card>

      <Modal show={showLeaderboard} onHide={() => setShowLeaderboard(false)} size="lg" centered>
        <Modal.Header
          closeButton
          className="border-0"
          style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          <Modal.Title className="text-white w-100 text-center">
            <Trophy size={32} className="me-2" />
            {t('reader.leaderboardModalTitle', 'Student leaderboard')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <div
            className="p-4"
            style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}
          >
            <div className="row justify-content-center align-items-end">
              {[1, 0, 2].map((idx) => {
                const s = leaderboardRows[idx];
                const place = idx === 0 ? 2 : idx === 1 ? 1 : 3;
                const lift = idx === 0 ? 20 : idx === 1 ? 0 : 40;
                return (
                  <div key={place} className="col-4 text-center">
                    {s ? (
                      <>
                        <div
                          className="card shadow-lg border-0 p-3 mb-2"
                          style={{
                            background:
                              place === 1
                                ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                                : place === 2
                                  ? 'linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 100%)'
                                  : 'linear-gradient(135deg, #CD7F32 0%, #D4A574 100%)',
                            transform: `translateY(${lift}px)`,
                          }}
                        >
                          {place === 1 && (
                            <Trophy size={48} className="mx-auto mb-2 text-white" />
                          )}
                          {place === 2 && (
                            <Medal size={40} className="mx-auto mb-2" style={{ color: '#888' }} />
                          )}
                          {place === 3 && (
                            <Award size={36} className="mx-auto mb-2 text-white" />
                          )}
                          <h6
                            className={`mb-1 ${place === 1 ? 'fw-bold text-white' : ''}`}
                            style={place === 3 ? { color: 'white' } : {}}
                          >
                            {s.name}
                          </h6>
                          <h4
                            className={`mb-0 fw-bold ${place === 1 || place === 3 ? 'text-white' : ''}`}
                          >
                            {s.points}
                          </h4>
                          <small className={place === 1 || place === 3 ? 'text-white' : 'text-muted'}>
                            {t('reader.pointsLabel', 'points')}
                          </small>
                        </div>
                        <div
                          className={`text-white fw-bold rounded ${place === 1 ? 'py-3' : 'py-2'}`}
                          style={{
                            background:
                              place === 1 ? '#ffc107' : place === 2 ? '#6c757d' : '#CD7F32',
                          }}
                        >
                          {place === 1 && <Star size={20} className="me-1" />}
                          {place}
                          {place === 1 ? 'st' : place === 2 ? 'nd' : 'rd'}
                        </div>
                      </>
                    ) : (
                      <div className="text-muted small py-5">—</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3">
            <h6 className="mb-3 text-center text-muted">
              <TrendingUp size={18} className="me-2" />
              {t('reader.topFiveFull', 'Top 5')}
            </h6>
            <Table hover responsive className="mb-0">
              <thead className="table-light">
                <tr>
                  <th className="text-center">#</th>
                  <th>{t('reader.studentCol', 'Student')}</th>
                  <th className="text-center">{t('reader.pointsCol', 'Points')}</th>
                  <th className="text-center">WPM</th>
                  <th className="text-center">%</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardRows.map((student) => (
                  <tr key={`row-${student.rank}-${student.name}`}>
                    <td className="text-center align-middle">
                      <div className="d-flex align-items-center justify-content-center">
                        {getRankIcon(student.rank)}
                        <span className="ms-2 fw-bold">{student.rank}</span>
                      </div>
                    </td>
                    <td className="align-middle">
                      <strong>{student.name}</strong>
                    </td>
                    <td className="text-center align-middle">
                      <Badge bg="primary" className="px-3 py-2">
                        <Zap size={14} className="me-1" />
                        {student.points}
                      </Badge>
                    </td>
                    <td className="text-center align-middle">{student.avgWPM}</td>
                    <td className="text-center align-middle">{student.accuracy}%</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {leaderboardRows.length === 0 && isStudentWithAuth && !loadingBoard && (
              <p className="text-center text-muted small mb-0 py-3">
                {t('reader.leaderboardEmpty', 'No rankings yet — be the first to earn points!')}
              </p>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 bg-light">
          <small className="text-muted w-100 text-center">
            {t('reader.leaderboardFooter', 'Points update when you practice in Reader (STT mode).')}
          </small>
        </Modal.Footer>
      </Modal>
    </>
  );
};

Gamification.defaultProps = {
  user: null,
  sessionPoints: 0,
  pointsBreakdown: null,
  myRank: null,
};

export default Gamification;
