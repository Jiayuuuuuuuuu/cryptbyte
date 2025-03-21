import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import {
  Layout,
  Typography,
  Card,
  Button,
  Progress,
  Space,
  Row,
  Col,
  Statistic,
  Divider,
  Alert,
  Modal,
  Tag,
  List
} from 'antd'
import {
  LineChartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  TrophyOutlined,
  InfoCircleOutlined,
  RightOutlined,
  FireOutlined
} from '@ant-design/icons'
import { setHeaderMenuItem } from '../../redux_actions'
import { addTokens } from '../../redux_actions/userActions'
import TradingChallenge from './TradingChallenge'
import ProgressTracker from './ProgressTracker'

const { Content } = Layout
const { Title, Paragraph, Text } = Typography

const GamePage = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentChallenge, setCurrentChallenge] = useState(null)
  const [challengeCompleted, setChallengeCompleted] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [answer, setAnswer] = useState(null)
  const [correct, setCorrect] = useState(false)
  const [challengeHistory, setChallengeHistory] = useState([])
  const { user } = props

  // Track user progress and streaks
  const [stats, setStats] = useState({
    totalChallenges: 0,
    correctPredictions: 0,
    streak: 0,
    maxStreak: 0
  })

  useEffect(() => {
    // Set the current menu item when component mounts
    props.setHeaderMenuItem('gamification')
  }, [])

  const challenges = [
    {
      id: 1,
      title: 'Bitcoin Price Movement',
      description: 'Looking at the price action, will BTC go up or down in the next 4 hours?',
      difficulty: 'Easy',
      tokens: 15,
      timeFrame: '4h',
      image: 'https://via.placeholder.com/400x200',
      chartData: {
        labels: ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM'],
        prices: [45200, 45500, 45300, 45150, 45050, 44900]
      },
      correctAnswer: 'down',
      analysis: 'BTC formed a descending triangle pattern with lower highs, decreased trading volume, and failed to break above resistance at $45,500 three times. The pattern indicated bearish momentum was building. When price broke below support at $45,000, it triggered further selling.'
    },
    {
      id: 2,
      title: 'Ethereum Support Level',
      description: 'Based on the chart pattern, will ETH hold the support level or break down?',
      difficulty: 'Medium',
      tokens: 25,
      timeFrame: '1d',
      image: 'https://via.placeholder.com/400x200',
      chartData: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        prices: [3200, 3150, 3050, 2950, 2900, 2875]
      },
      correctAnswer: 'break',
      analysis: 'ETH was exhibiting bearish signals: increased selling volume, failure to form higher lows, and crossing below key moving averages. The price had already tested the support level three times, weakening it with each test. The broader market sentiment was also bearish.'
    },
    {
      id: 3,
      title: 'Altcoin Breakout',
      description: 'Is this altcoin likely to break above resistance after this consolidation?',
      difficulty: 'Hard',
      tokens: 40,
      timeFrame: '12h',
      image: 'https://via.placeholder.com/400x200',
      chartData: {
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6'],
        prices: [1.2, 1.35, 1.32, 1.36, 1.39, 1.41]
      },
      correctAnswer: 'up',
      analysis: 'The altcoin showed a clear accumulation pattern with higher lows forming a bullish ascending triangle. Trading volume was increasing during price rises and decreasing during pullbacks - a bullish signal. RSI was showing positive divergence, indicating strengthening momentum despite price consolidation.'
    }
  ]

  const startChallenge = (challenge) => {
    setCurrentChallenge(challenge)
    setIsModalVisible(true)
    setChallengeCompleted(false)
    setShowFeedback(false)
    setAnswer(null)
  }

  const submitAnswer = (prediction) => {
    setAnswer(prediction)
    const isCorrect = prediction === currentChallenge.correctAnswer
    setCorrect(isCorrect)

    // Update stats
    const newStats = { ...stats }
    newStats.totalChallenges++

    if (isCorrect) {
      // Award tokens
      props.addTokens(currentChallenge.tokens)

      // Update stats
      newStats.correctPredictions++
      newStats.streak++
      if (newStats.streak > newStats.maxStreak) {
        newStats.maxStreak = newStats.streak
      }
    } else {
      // Reset streak on wrong answer
      newStats.streak = 0
    }

    setStats(newStats)

    // Add to history
    setChallengeHistory([
      {
        id: currentChallenge.id,
        title: currentChallenge.title,
        result: isCorrect,
        tokens: isCorrect ? currentChallenge.tokens : 0,
        timestamp: new Date().toLocaleTimeString()
      },
      ...challengeHistory.slice(0, 4) // Keep last 5 challenges
    ])

    setShowFeedback(true)
    setChallengeCompleted(true)
  }

  const closeModal = () => {
    setIsModalVisible(false)
  }

  return (
    <Layout className="layout">
      <Content style={{ padding: '0 50px', marginTop: 20 }}>
        <div className="site-layout-content" style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          {/* Top Section - Intro and Stats */}
          <Row gutter={[24, 24]}>
            <Col xs={24} md={16}>
              <Card bordered={false}>
                <Title level={2}>Trading Prediction Challenge</Title>
                <Paragraph>
                  Test your market analysis skills and earn tokens! Study the charts, make predictions,
                  and learn from the outcomes. Each correct prediction earns you tokens to level up your account.
                </Paragraph>
                <Alert
                  message="24-Hour Challenge Refresh"
                  description="New trading challenges are available daily. Complete them all to maximize your token earnings!"
                  type="info"
                  showIcon
                  style={{ marginBottom: 20 }}
                />
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card title="Your Trading Stats" bordered={false}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic
                      title="Accuracy"
                      value={stats.totalChallenges > 0 ? Math.round((stats.correctPredictions / stats.totalChallenges) * 100) : 0}
                      suffix="%"
                      precision={0}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Current Streak"
                      value={stats.streak}
                      prefix={<FireOutlined style={{ color: '#ff4d4f' }} />}
                    />
                  </Col>
                </Row>
                <Divider style={{ margin: '12px 0' }} />
                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic
                      title="Completed"
                      value={stats.totalChallenges}
                      suffix={`/${challenges.length}`}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Earned Today"
                      value={challengeHistory.reduce((sum, c) => sum + c.tokens, 0)}
                      prefix={<TrophyOutlined style={{ color: '#1890ff' }} />}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>

          {/* Challenge Cards */}
          <Title level={3} style={{ marginTop: 40 }}>Available Challenges</Title>
          <Row gutter={[24, 24]}>
            {challenges.map(challenge => {
              const isCompleted = challengeHistory.some(h => h.id === challenge.id)
              return (
                <Col xs={24} sm={12} lg={8} key={challenge.id}>
                  <Card
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{challenge.title}</span>
                        <Tag color={challenge.difficulty === 'Easy' ? 'green' : challenge.difficulty === 'Medium' ? 'blue' : 'purple'}>
                          {challenge.difficulty}
                        </Tag>
                      </div>
                    }
                    cover={<img alt={challenge.title} src={challenge.image} style={{ height: 120, objectFit: 'cover' }} />}
                    actions={[
                      <Button
                        key="challenge-button"
                        type="primary"
                        onClick={() => startChallenge(challenge)}
                        disabled={isCompleted}
                        icon={isCompleted ? <InfoCircleOutlined /> : <LineChartOutlined />}
                      >
                        {isCompleted ? 'Completed' : 'Start Challenge'}
                      </Button>
                    ]}
                  >
                    <div style={{ height: 80 }}>
                      <Paragraph ellipsis={{ rows: 2 }}>{challenge.description}</Paragraph>
                      <Text type="secondary">Time Frame: {challenge.timeFrame}</Text>
                      <div style={{ marginTop: 10 }}>
                        <TrophyOutlined style={{ color: '#1890ff' }} /> <Text strong>{challenge.tokens} tokens</Text>
                      </div>
                    </div>
                    {isCompleted && (
                      <div style={{ marginTop: 10 }}>
                        <Tag color={challengeHistory.find(h => h.id === challenge.id)?.result ? 'success' : 'error'}>
                          {challengeHistory.find(h => h.id === challenge.id)?.result ? 'Correct!' : 'Incorrect'}
                        </Tag>
                      </div>
                    )}
                  </Card>
                </Col>
              )
            })}
          </Row>

          {/* Recent Activity */}
          <Row gutter={[24, 24]} style={{ marginTop: 40 }}>
            <Col span={24}>
              <Card title="Recent Activity" bordered={false}>
                {challengeHistory.length > 0
                  ? (
                    <List
                      itemLayout="horizontal"
                      dataSource={challengeHistory}
                      renderItem={item => (
                        <List.Item
                          actions={[
                            <Tag
                              key="result-tag"
                              color={item.result ? 'success' : 'error'}>
                              {item.result ? 'Correct' : 'Incorrect'}
                            </Tag>
                          ]}
                        >
                          <List.Item.Meta
                            title={item.title}
                            description={
                              <Space>
                                <Text type="secondary">{item.timestamp}</Text>
                                {item.result && <Text type="success">+{item.tokens} tokens</Text>}
                              </Space>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  )
                  : (
                    <Paragraph>Complete challenges to see your activity here.</Paragraph>
                  )}
              </Card>
            </Col>
          </Row>

          {/* Progress Tracker */}
          <Row gutter={[24, 24]} style={{ marginTop: 40 }}>
            <Col span={24}>
              <ProgressTracker stats={stats} user={user} />
            </Col>
          </Row>
        </div>
      </Content>

      {/* Challenge Modal */}
      <Modal
        title={currentChallenge?.title || 'Trading Challenge'}
        visible={isModalVisible}
        onCancel={closeModal}
        footer={null}
        width={800}
      >
        {currentChallenge && (
          <TradingChallenge
            challenge={currentChallenge}
            onSubmit={submitAnswer}
            answer={answer}
            correct={correct}
            showFeedback={showFeedback}
            completed={challengeCompleted}
            onClose={closeModal}
          />
        )}
      </Modal>
    </Layout>
  )
}

const mapStateToProps = (state) => {
  return {
    // Use the actual user state from Redux when available
    user: state.user || {
      name: 'Trader123',
      tokens: 780,
      joinDate: '2024-11-15',
      streak: 10
    }
  }
}

const mapActionsToProps = {
  setHeaderMenuItem,
  addTokens
}

export default connect(mapStateToProps, mapActionsToProps)(GamePage)
