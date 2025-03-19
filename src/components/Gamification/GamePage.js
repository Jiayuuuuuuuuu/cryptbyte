import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Layout,
  Row,
  Col,
  Card,
  Button,
  Typography,
  Statistic,
  Progress,
  Tag,
  Radio,
  Select,
  Divider,
  Alert,
  Tooltip,
  Collapse,
  Timeline,
  List,
  Modal
} from 'antd'
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  TrophyOutlined,
  InfoCircleOutlined,
  BarChartOutlined,
  BookOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LineChartOutlined,
  LockOutlined,
  UnlockOutlined,
  GiftOutlined
} from '@ant-design/icons'
import { setHeaderMenuItem } from '../../redux_actions'
import { addTokens } from '../../redux_actions/userActions'

const { Content } = Layout
const { Title, Paragraph, Text } = Typography
const { Panel } = Collapse
const { Option } = Select

// Mock historical data (in a real app, this would come from your API)
const historicalData = {
  BTC: [
    {
      id: 'btc-1',
      title: 'BTC/USD March 2025',
      initialPrice: 69850,
      timeFrame: '1 day',
      priceData: [
        { time: '00:00', price: 69850 },
        { time: '04:00', price: 69750 },
        { time: '08:00', price: 69920 },
        { time: '12:00', price: 70100 }
        // Partial data shown to user
      ],
      fullPriceData: [
        { time: '00:00', price: 69850 },
        { time: '04:00', price: 69750 },
        { time: '08:00', price: 69920 },
        { time: '12:00', price: 70100 },
        { time: '16:00', price: 70350 },
        { time: '20:00', price: 70580 },
        { time: '24:00', price: 70750 }
      ],
      finalPrice: 70750,
      result: 'up',
      difficulty: 'easy',
      patterns: ['bullish flag', 'higher lows'],
      keyIndicators: ['RSI oversold', 'MACD crossover']
    },
    {
      id: 'btc-2',
      title: 'BTC/USD Early March 2025',
      initialPrice: 72400,
      timeFrame: '1 day',
      priceData: [
        { time: '00:00', price: 72400 },
        { time: '04:00', price: 72100 },
        { time: '08:00', price: 71800 },
        { time: '12:00', price: 71650 }
      ],
      fullPriceData: [
        { time: '00:00', price: 72400 },
        { time: '04:00', price: 72100 },
        { time: '08:00', price: 71800 },
        { time: '12:00', price: 71650 },
        { time: '16:00', price: 71400 },
        { time: '20:00', price: 71250 },
        { time: '24:00', price: 71100 }
      ],
      finalPrice: 71100,
      result: 'down',
      difficulty: 'medium',
      patterns: ['descending triangle', 'lower highs'],
      keyIndicators: ['RSI overbought', 'Bearish divergence']
    }
  ],
  ETH: [
    {
      id: 'eth-1',
      title: 'ETH/USD March 2025',
      initialPrice: 3920,
      timeFrame: '1 day',
      priceData: [
        { time: '00:00', price: 3920 },
        { time: '04:00', price: 3890 },
        { time: '08:00', price: 3850 },
        { time: '12:00', price: 3860 }
      ],
      fullPriceData: [
        { time: '00:00', price: 3920 },
        { time: '04:00', price: 3890 },
        { time: '08:00', price: 3850 },
        { time: '12:00', price: 3860 },
        { time: '16:00', price: 3790 },
        { time: '20:00', price: 3760 },
        { time: '24:00', price: 3730 }
      ],
      finalPrice: 3730,
      result: 'down',
      difficulty: 'medium',
      patterns: ['double top', 'resistance level'],
      keyIndicators: ['Volume decline', 'Bearish momentum']
    }
  ],
  SOL: [
    {
      id: 'sol-1',
      title: 'SOL/USD March 2025',
      initialPrice: 148.5,
      timeFrame: '1 day',
      priceData: [
        { time: '00:00', price: 148.5 },
        { time: '04:00', price: 147.8 },
        { time: '08:00', price: 148.2 },
        { time: '12:00', price: 149.1 }
      ],
      fullPriceData: [
        { time: '00:00', price: 148.5 },
        { time: '04:00', price: 147.8 },
        { time: '08:00', price: 148.2 },
        { time: '12:00', price: 149.1 },
        { time: '16:00', price: 149.8 },
        { time: '20:00', price: 150.2 },
        { time: '24:00', price: 151.7 }
      ],
      finalPrice: 151.7,
      result: 'up',
      difficulty: 'hard',
      patterns: ['cup and handle', 'support level'],
      keyIndicators: ['Strong volume', 'Bullish divergence']
    }
  ]
}

// Learning courses data
const learningCourses = [
  {
    id: 1,
    title: 'Technical Analysis Basics',
    description: 'Learn foundational concepts of technical analysis',
    lessons: [
      { id: 1, title: 'Support and Resistance', completed: true, tokens: 20 },
      { id: 2, title: 'Trend Lines', completed: true, tokens: 20 },
      { id: 3, title: 'Chart Patterns', completed: false, tokens: 25 },
      { id: 4, title: 'Candlestick Patterns', completed: false, tokens: 25 }
    ],
    level: 'Beginner',
    progress: 50,
    tokens: 100
  },
  {
    id: 2,
    title: 'Technical Indicators',
    description: 'Master key technical indicators for better trade decisions',
    lessons: [
      { id: 1, title: 'Moving Averages', completed: true, tokens: 20 },
      { id: 2, title: 'RSI & MACD', completed: false, tokens: 25 },
      { id: 3, title: 'Bollinger Bands', completed: false, tokens: 25 },
      { id: 4, title: 'Volume Analysis', completed: false, tokens: 30 }
    ],
    level: 'Intermediate',
    progress: 25,
    tokens: 150
  },
  {
    id: 3,
    title: 'Advanced Trading Strategies',
    description: 'Learn professional trading strategies and risk management',
    lessons: [
      { id: 1, title: 'Fibonacci Retracements', completed: false, tokens: 30 },
      { id: 2, title: 'Elliott Wave Theory', completed: false, tokens: 35 },
      { id: 3, title: 'Risk Management', completed: false, tokens: 40 },
      { id: 4, title: 'Portfolio Optimization', completed: false, tokens: 45 }
    ],
    level: 'Advanced',
    progress: 0,
    tokens: 200
  }
]

class GamePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentCoin: 'BTC',
      currentScenario: null,
      userPrediction: null,
      showResult: false,
      completedScenarios: [],
      currentStreak: 0,
      totalCorrect: 0,
      totalAttempted: 0,
      showExplanation: false,
      learningModalVisible: false,
      selectedCourse: null
    }
  }

  componentDidMount () {
    // Set the current menu item when component mounts
    this.props.setHeaderMenuItem('game')

    // Set the first scenario for the selected coin
    this.selectScenario(historicalData[this.state.currentCoin][0])
  }

  selectCoin = (coin) => {
    this.setState({
      currentCoin: coin,
      currentScenario: null,
      userPrediction: null,
      showResult: false
    }, () => {
      if (historicalData[coin] && historicalData[coin].length > 0) {
        this.selectScenario(historicalData[coin][0])
      }
    })
  }

  selectScenario = (scenario) => {
    this.setState({
      currentScenario: scenario,
      userPrediction: null,
      showResult: false
    })
  }

  makeGuess = (prediction) => {
    this.setState({
      userPrediction: prediction,
      showResult: true
    })

    // Check if the prediction is correct
    const { currentScenario } = this.state
    const isCorrect = prediction === currentScenario.result

    // Update stats
    this.setState(prevState => {
      const updatedStats = {
        totalAttempted: prevState.totalAttempted + 1,
        completedScenarios: [...prevState.completedScenarios, currentScenario.id]
      }

      if (isCorrect) {
        updatedStats.totalCorrect = prevState.totalCorrect + 1
        updatedStats.currentStreak = prevState.currentStreak + 1

        // Award tokens based on difficulty and streak
        const baseTokens = currentScenario.difficulty === 'easy'
          ? 10
          : currentScenario.difficulty === 'medium' ? 20 : 30

        const streakBonus = prevState.currentStreak >= 5
          ? 15
          : prevState.currentStreak >= 3 ? 10 : 0

        const tokensAwarded = baseTokens + streakBonus
        this.props.addTokens(tokensAwarded)
      } else {
        updatedStats.currentStreak = 0
      }

      return updatedStats
    })
  }

  resetGame = () => {
    this.setState({
      userPrediction: null,
      showResult: false
    })
  }

  showCourseDetails = (course) => {
    this.setState({
      selectedCourse: course,
      learningModalVisible: true
    })
  }

  closeModal = () => {
    this.setState({
      learningModalVisible: false
    })
  }

  render () {
    const {
      currentCoin,
      currentScenario,
      userPrediction,
      showResult,
      completedScenarios,
      currentStreak,
      totalCorrect,
      totalAttempted,
      showExplanation,
      learningModalVisible,
      selectedCourse
    } = this.state

    const { user } = this.props
    const winRate = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0

    const availableCoins = Object.keys(historicalData)

    return (
      <Layout className="layout">
        <Content style={{ padding: '0 50px', marginTop: 20 }}>
          <div className="site-layout-content" style={{ background: '#fff', padding: 24, minHeight: 280 }}>
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Card bordered={false}>
                  <Title level={2}>Prediction Game</Title>
                  <Paragraph>
                    Test your trading skills by predicting whether the price will go up or down based on historical data.
                    Learn from your predictions and improve your trading strategies.
                  </Paragraph>
                </Card>
              </Col>
            </Row>

            <Row gutter={[24, 24]} style={{ marginTop: 16 }}>
              {/* Game Stats */}
              <Col xs={24} md={8}>
                <Card title="Your Game Stats" bordered={false}>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Statistic
                        title="Win Rate"
                        value={winRate}
                        suffix="%"
                        valueStyle={{ color: winRate >= 60 ? '#3f8600' : winRate >= 40 ? '#faad14' : '#cf1322' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Current Streak"
                        value={currentStreak}
                        prefix={<TrophyOutlined />}
                        valueStyle={{ color: currentStreak >= 3 ? '#3f8600' : '#1890ff' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Total Correct"
                        value={totalCorrect}
                        prefix={<CheckCircleOutlined />}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Total Attempts"
                        value={totalAttempted}
                        prefix={<BarChartOutlined />}
                      />
                    </Col>
                  </Row>

                  <Divider />

                  <Paragraph>
                    <Text strong>Tokens earned from predictions: </Text>
                    <Text>{user.tokens}</Text>
                  </Paragraph>

                  <Alert
                    message="Streak Bonus Active!"
                    description={`Maintain your streak for bonus tokens. Current bonus: ${
                      currentStreak >= 5 ? '15' : currentStreak >= 3 ? '10' : '0'
                    } tokens per correct prediction.`}
                    type="info"
                    showIcon
                    style={{ marginTop: 16, display: currentStreak >= 3 ? 'block' : 'none' }}
                  />
                </Card>

                <Card title="Available Scenarios" style={{ marginTop: 16 }} bordered={false}>
                  <Select
                    style={{ width: '100%', marginBottom: 16 }}
                    placeholder="Select Coin"
                    value={currentCoin}
                    onChange={this.selectCoin}
                  >
                    {availableCoins.map(coin => (
                      <Option key={coin} value={coin}>{coin}/USD</Option>
                    ))}
                  </Select>

                  <List
                    itemLayout="horizontal"
                    dataSource={historicalData[currentCoin] || []}
                    renderItem={item => (
                      <List.Item
                        actions={[
                          <Button
                            key={`play-button-${item.id}`}
                            type={currentScenario && currentScenario.id === item.id ? 'primary' : 'default'}
                            size="small"
                            onClick={() => this.selectScenario(item)}
                          >
                            {completedScenarios.includes(item.id) ? 'Replay' : 'Play'}
                          </Button>
                        ]}
                      >
                        <List.Item.Meta
                          title={
                            <span>
                              {item.title}
                              <Tag color={
                                item.difficulty === 'easy'
                                  ? 'green'
                                  : item.difficulty === 'medium' ? 'orange' : 'red'
                              } style={{ marginLeft: 8 }}>
                                {item.difficulty}
                              </Tag>
                            </span>
                          }
                          description={`Timeframe: ${item.timeFrame}`}
                        />
                        {completedScenarios.includes(item.id) && (
                          <Tag color={item.result === 'up' ? 'green' : 'red'}>
                            {item.result === 'up' ? 'Went Up' : 'Went Down'}
                          </Tag>
                        )}
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>

              {/* Game Area */}
              <Col xs={24} md={16}>
                <Card bordered={false}>
                  {currentScenario
                    ? (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                          <Title level={3}>{currentScenario.title}</Title>
                          <Text>Starting Price: ${currentScenario.initialPrice}</Text>
                        </div>

                        <Card>
                          <div style={{ height: '300px', background: '#f0f2f5', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Text>
                            [Chart Visualization Would Go Here]
                            </Text>
                            <Text style={{ position: 'absolute', bottom: 10, right: 10 }}>
                            Timeframe: {currentScenario.timeFrame}
                            </Text>
                          </div>
                        </Card>

                        <div style={{ marginTop: 24, textAlign: 'center' }}>
                          {!showResult
                            ? (
                              <>
                                <Title level={4}>What&apos;s your prediction?</Title>
                                <div style={{ marginTop: 16 }}>
                                  <Button
                                    type="primary"
                                    size="large"
                                    icon={<ArrowUpOutlined />}
                                    style={{ marginRight: 16, backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                                    onClick={() => this.makeGuess('up')}
                                  >
                                Price Will Go Up
                                  </Button>
                                  <Button
                                    type="primary"
                                    size="large"
                                    danger
                                    icon={<ArrowDownOutlined />}
                                    onClick={() => this.makeGuess('down')}
                                  >
                                Price Will Go Down
                                  </Button>
                                </div>
                              </>
                            )
                            : (
                              <div>
                                <Alert
                                  message={
                                    userPrediction === currentScenario.result
                                      ? 'Correct Prediction!'
                                      : 'Incorrect Prediction'
                                  }
                                  description={
                                    userPrediction === currentScenario.result
                                      ? `Congratulations! You predicted correctly that the price would go ${currentScenario.result}.`
                                      : `The price actually went ${currentScenario.result}, not ${userPrediction}.`
                                  }
                                  type={userPrediction === currentScenario.result ? 'success' : 'error'}
                                  showIcon
                                  style={{ marginBottom: 16 }}
                                />

                                <Row gutter={16}>
                                  <Col span={12}>
                                    <Statistic
                                      title="Final Price"
                                      value={currentScenario.finalPrice}
                                      precision={2}
                                      valueStyle={{
                                        color: currentScenario.finalPrice > currentScenario.initialPrice
                                          ? '#3f8600'
                                          : '#cf1322'
                                      }}
                                      prefix={
                                        currentScenario.finalPrice > currentScenario.initialPrice
                                          ? <ArrowUpOutlined />
                                          : <ArrowDownOutlined />
                                      }
                                      suffix="USD"
                                    />
                                  </Col>
                                  <Col span={12}>
                                    <Statistic
                                      title="Price Change"
                                      value={((currentScenario.finalPrice - currentScenario.initialPrice) /
                                         currentScenario.initialPrice * 100).toFixed(2)}
                                      precision={2}
                                      valueStyle={{
                                        color: currentScenario.finalPrice > currentScenario.initialPrice
                                          ? '#3f8600'
                                          : '#cf1322'
                                      }}
                                      prefix={
                                        currentScenario.finalPrice > currentScenario.initialPrice
                                          ? <ArrowUpOutlined />
                                          : <ArrowDownOutlined />
                                      }
                                      suffix="%"
                                    />
                                  </Col>
                                </Row>

                                <div style={{ marginTop: 24 }}>
                                  <Button
                                    onClick={() => this.setState({ showExplanation: !showExplanation })}
                                    icon={<InfoCircleOutlined />}
                                    style={{ marginRight: 16 }}
                                  >
                                    {showExplanation ? 'Hide' : 'Show'} Analysis
                                  </Button>
                                  <Button
                                    type="primary"
                                    onClick={this.resetGame}
                                  >
                                Try Another Scenario
                                  </Button>
                                </div>

                                {showExplanation && (
                                  <div style={{ marginTop: 16, textAlign: 'left' }}>
                                    <Collapse defaultActiveKey={['1']}>
                                      <Panel header="Chart Patterns" key="1">
                                        <ul>
                                          {currentScenario.patterns.map((pattern, index) => (
                                            <li key={index}>{pattern}</li>
                                          ))}
                                        </ul>
                                      </Panel>
                                      <Panel header="Key Indicators" key="2">
                                        <ul>
                                          {currentScenario.keyIndicators.map((indicator, index) => (
                                            <li key={index}>{indicator}</li>
                                          ))}
                                        </ul>
                                      </Panel>
                                      <Panel header="Full Price Movement" key="3">
                                        <Timeline>
                                          {currentScenario.fullPriceData.map((data, index) => (
                                            <Timeline.Item key={index}>
                                              {data.time}: ${data.price}
                                            </Timeline.Item>
                                          ))}
                                        </Timeline>
                                      </Panel>
                                    </Collapse>
                                  </div>
                                )}
                              </div>
                            )}
                        </div>
                      </>
                    )
                    : (
                      <div style={{ textAlign: 'center', padding: 48 }}>
                        <Title level={4}>Select a scenario to start playing</Title>
                      </div>
                    )}
                </Card>
              </Col>
            </Row>

            {/* Learning Section */}
            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
              <Col span={24}>
                <Card
                  title={
                    <span>
                      <BookOutlined /> Learning Resources
                    </span>
                  }
                  bordered={false}
                >
                  <Paragraph>
                    Improve your prediction skills with these learning resources and courses.
                    Complete courses to earn tokens and upgrade your trading techniques.
                  </Paragraph>

                  <Row gutter={16}>
                    {learningCourses.map(course => (
                      <Col xs={24} sm={12} md={8} key={course.id}>
                        <Card
                          hoverable
                          style={{ marginBottom: 16 }}
                          actions={[
                            <Button
                              key={`view-course-${course.id}`}
                              type="default"
                              onClick={() => this.showCourseDetails(course)}
                            >
                              View Course
                            </Button>
                          ]}
                        >
                          <Card.Meta
                            title={
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>{course.title}</span>
                                <Tag color="blue">{course.level}</Tag>
                              </div>
                            }
                            description={course.description}
                          />
                          <div style={{ marginTop: 16 }}>
                            <Text>Progress: </Text>
                            <Progress percent={course.progress} size="small" />
                          </div>
                          <div style={{ marginTop: 8 }}>
                            <Text>Rewards: </Text>
                            <Tag color="gold">{course.tokens} tokens</Tag>
                          </div>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card>
              </Col>
            </Row>
          </div>
        </Content>

        <Modal
          title={selectedCourse ? selectedCourse.title : ''}
          visible={learningModalVisible}
          onCancel={this.closeModal}
          footer={[
            <Button key="back" onClick={this.closeModal}>
              Close
            </Button>,
            <Button key="submit" type="primary" onClick={this.closeModal}>
              Start Learning
            </Button>
          ]}
          width={720}
        >
          {selectedCourse && (
            <>
              <Paragraph>{selectedCourse.description}</Paragraph>
              <Divider />
              <Title level={4}>Course Content</Title>
              <List
                itemLayout="horizontal"
                dataSource={selectedCourse.lessons}
                renderItem={item => (
                  <List.Item
                    actions={[
                      <Button
                        key={`lesson-button-${item.id}`}
                        type="primary"
                        size="small"
                        disabled={!item.completed}
                      >
                        {item.completed ? 'Review' : 'Start'}
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={item.completed
                        ? <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />
                        : <LockOutlined style={{ color: '#bfbfbf', fontSize: 20 }} />
                      }
                      title={
                        <span style={{ color: item.completed ? 'inherit' : '#bfbfbf' }}>
                          {item.title}
                          <Tag color="blue" style={{ marginLeft: 8 }}>+{item.tokens} tokens</Tag>
                        </span>
                      }
                    />
                  </List.Item>
                )}
              />
              <Divider />
              <Alert
                message="Course Completion Reward"
                description={`Complete all lessons to earn ${selectedCourse.tokens} tokens and unlock advanced trading strategies.`}
                type="info"
                showIcon
              />
            </>
          )}
        </Modal>
      </Layout>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    // Mock user data - in a real app, this would come from your Redux store
    user: {
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
