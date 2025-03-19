import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Layout, Row, Col, Card, Button, Typography, Statistic, Progress, Tag, Select, Divider, Alert, Collapse, Timeline, List } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined, TrophyOutlined, InfoCircleOutlined, BarChartOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { setHeaderMenuItem, addTokens } from '../../redux_actions'
import LearningCourses from './LearningCourses'

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
      showExplanation: false
    }
  }

  componentDidMount () {
    // Set the current menu item when component mounts
    this.props.setHeaderMenuItem('game')

    // Safely set the first scenario for the selected coin
    if (
      historicalData &&
      historicalData[this.state.currentCoin] &&
      historicalData[this.state.currentCoin].length > 0
    ) {
      this.selectScenario(historicalData[this.state.currentCoin][0])
    }
  }

  selectCoin = (coin) => {
    this.setState(
      {
        currentCoin: coin,
        currentScenario: null,
        userPrediction: null,
        showResult: false
      },
      () => {
        if (historicalData[coin] && historicalData[coin].length > 0) {
          this.selectScenario(historicalData[coin][0])
        }
      }
    )
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

    this.props.completeScenario(currentScenario.id, isCorrect)

    if (isCorrect) {
      const baseTokens =
        currentScenario.difficulty === 'easy'
          ? 10
          : currentScenario.difficulty === 'medium'
            ? 20
            : 30
  
      const streakBonus =
        this.props.game.currentStreak >= 5 ? 15 : this.props.game.currentStreak >= 3 ? 10 : 0
  
      const tokensAwarded = baseTokens + streakBonus
      this.props.addTokens(tokensAwarded)
    
      // Update stats
    this.setState((prevState) => {
      const updatedStats = {
        totalAttempted: prevState.totalAttempted + 1,
        completedScenarios: [...prevState.completedScenarios, currentScenario.id]
      }

      if (isCorrect) {
        updatedStats.totalCorrect = prevState.totalCorrect + 1
        updatedStats.currentStreak = prevState.currentStreak + 1

        // Award tokens based on difficulty and streak
        const baseTokens =
          currentScenario.difficulty === 'easy'
            ? 10
            : currentScenario.difficulty === 'medium'
              ? 20
              : 30

        const streakBonus =
          prevState.currentStreak >= 5 ? 15 : prevState.currentStreak >= 3 ? 10 : 0

        const tokensAwarded = baseTokens + streakBonus
        // Use a try-catch to handle potential errors with addTokens
        try {
          this.props.addTokens(tokensAwarded)
        } catch (error) {
          console.error('Error adding tokens:', error)
        }
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
      showExplanation
    } = this.state

    // Make sure user is available from props, with a fallback
    const userTokens = this.props.user?.tokens || 0
    const winRate = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0

    const availableCoins = Object.keys(historicalData)

    return (
      <Layout className="layout">
        <Content style={{ padding: '0 50px', marginTop: 20 }}>
          <div
            className="site-layout-content"
            style={{ background: '#fff', padding: 24, minHeight: 280 }}
          >
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Card bordered={false}>
                  <Title level={2}>Prediction Game</Title>
                  <Paragraph>
                    Test your trading skills by predicting whether the price will go up or down based on
                    historical data. Learn from your predictions and improve your trading strategies.
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
                        valueStyle={{
                          color: winRate >= 60 ? '#3f8600' : winRate >= 40 ? '#faad14' : '#cf1322'
                        }}
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
                    <Text>{userTokens}</Text>
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
                    {availableCoins.map((coin) => (
                      <Option key={coin} value={coin}>
                        {coin}/USD
                      </Option>
                    ))}
                  </Select>

                  <List
                    itemLayout="horizontal"
                    dataSource={historicalData[currentCoin] || []}
                    renderItem={(item) => (
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
                              <Tag
                                color={
                                  item.difficulty === 'easy'
                                    ? 'green'
                                    : item.difficulty === 'medium'
                                      ? 'orange'
                                      : 'red'
                                }
                                style={{ marginLeft: 8 }}
                              >
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
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 16
                          }}
                        >
                          <Title level={3}>{currentScenario.title}</Title>
                          <Text>Starting Price: ${currentScenario.initialPrice}</Text>
                        </div>

                        <Card>
                          <div
                            style={{
                              height: '300px',
                              background: '#f0f2f5',
                              position: 'relative',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Text>[Chart Visualization Would Go Here]</Text>
                            <Text style={{ position: 'absolute', bottom: 10, right: 10 }}>
                            Timeframe: {currentScenario.timeFrame}
                            </Text>
                          </div>
                        </Card>

                        <div style={{ marginTop: 24, textAlign: 'center' }}>
                          {!showResult
                            ? (
                              <>
                                <Title level={4}>What&aposs your prediction?</Title>
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
                                        color:
                                      currentScenario.finalPrice > currentScenario.initialPrice
                                        ? '#3f8600'
                                        : '#cf1322'
                                      }}
                                      prefix={
                                        currentScenario.finalPrice > currentScenario.initialPrice
                                          ? (
                                            <ArrowUpOutlined />
                                          )
                                          : (
                                            <ArrowDownOutlined />
                                          )
                                      }
                                      suffix="USD"
                                    />
                                  </Col>
                                  <Col span={12}>
                                    <Statistic
                                      title="Price Change"
                                      value={(
                                        ((currentScenario.finalPrice - currentScenario.initialPrice) /
                                      currentScenario.initialPrice) *
                                    100
                                      ).toFixed(2)}
                                      precision={2}
                                      valueStyle={{
                                        color:
                                      currentScenario.finalPrice > currentScenario.initialPrice
                                        ? '#3f8600'
                                        : '#cf1322'
                                      }}
                                      prefix={
                                        currentScenario.finalPrice > currentScenario.initialPrice
                                          ? (
                                            <ArrowUpOutlined />
                                          )
                                          : (
                                            <ArrowDownOutlined />
                                          )
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
                                  <Button type="primary" onClick={this.resetGame}>
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

            {/* Learning Courses Section */}
            <LearningCourses userTokens={userTokens} />
          </div>
        </Content>
      </Layout>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user || { tokens: 0 }, // Provide a fallback object if user is undefined
    game: state.game
  }
}

const mapDispatchToProps = {
  setHeaderMenuItem,
  addTokens,
  completeScenario,
  updateGameStats,
  resetGameStats
}

export default connect(mapStateToProps, mapDispatchToProps)(GamePage)
