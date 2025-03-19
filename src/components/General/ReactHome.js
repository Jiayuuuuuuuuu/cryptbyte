import React, { Component } from 'react'
import { Layout, Typography, Card, Row, Col, Button, Statistic, Divider, Collapse, List, Tag, Avatar } from 'antd'
import { Link } from 'react-router-dom'
import {
  RiseOutlined,
  FallOutlined,
  TrophyOutlined,
  RocketOutlined,
  ThunderboltOutlined,
  BulbOutlined,
  GlobalOutlined,
  LineChartOutlined,
  UserOutlined,
  BellOutlined,
  BookOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons'
import { contentStyle } from '../../styles'
import { connect } from 'react-redux'
import { setHeaderMenuItem } from '../../redux_actions'

const { Content } = Layout
const { Title, Paragraph, Text } = Typography
const { Panel } = Collapse

// Mock data for the hero section
const marketTrends = [
  { name: 'BTC', price: '$69,420', change: '+2.5%', sentiment: 'Bullish' },
  { name: 'ETH', price: '$3,950', change: '+1.8%', sentiment: 'Bullish' },
  { name: 'SOL', price: '$148.50', change: '-0.7%', sentiment: 'Neutral' }
]

// Mock data for features
const features = [
  {
    icon: <LineChartOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
    title: 'AI-Powered Sentiment Analysis',
    description: 'Real-time market sentiment analysis using advanced NLP to gauge market direction.'
  },
  {
    icon: <BellOutlined style={{ fontSize: 32, color: '#722ed1' }} />,
    title: 'Whale Transaction Alerts',
    description: 'Get instant notifications when large transactions occur that could impact market movements.'
  },
  {
    icon: <RocketOutlined style={{ fontSize: 32, color: '#13c2c2' }} />,
    title: 'Smart Trade Signals',
    description: 'Receive AI-generated trade signals with entry, exit, and risk management recommendations.'
  },
  {
    icon: <TrophyOutlined style={{ fontSize: 32, color: '#fa8c16' }} />,
    title: 'Gamified Learning',
    description: 'Earn tokens and climb the ranks as you learn and master trading strategies.'
  },
  {
    icon: <BookOutlined style={{ fontSize: 32, color: '#eb2f96' }} />,
    title: 'Learning Courses',
    description: 'Comprehensive courses from beginner to advanced trading techniques and strategies.'
  },
  {
    icon: <GlobalOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
    title: 'Global Market Coverage',
    description: 'Analysis and signals for crypto, forex, and other markets around the clock.'
  }
]

// Mock data for recent signals
const recentSignals = [
  {
    pair: 'BTC/USD',
    direction: 'BUY',
    price: '$69,420',
    target: '$72,000',
    stop: '$68,000',
    confidence: 85,
    timestamp: '2 hours ago'
  },
  {
    pair: 'ETH/USD',
    direction: 'SELL',
    price: '$3,950',
    target: '$3,800',
    stop: '$4,050',
    confidence: 75,
    timestamp: '4 hours ago'
  }
]

// Mock data for recent whale alerts
const whaleAlerts = [
  {
    asset: 'BTC',
    amount: '500 BTC',
    value: '$34.7M',
    type: 'Transfer',
    from: 'Unknown',
    to: 'Exchange',
    timestamp: '1 hour ago'
  },
  {
    asset: 'ETH',
    amount: '12,000 ETH',
    value: '$47.4M',
    type: 'Withdrawal',
    from: 'Exchange',
    to: 'Unknown Wallet',
    timestamp: '3 hours ago'
  }
]

// FAQ data
const faqs = [
  {
    question: 'How does the AI sentiment analysis work?',
    answer: 'Our AI sentiment analysis uses natural language processing to analyze thousands of news articles, social media posts, and market data points in real-time. It then provides a sentiment score indicating whether the market is bullish, bearish, or neutral for specific assets.'
  },
  {
    question: 'What are whale transaction alerts?',
    answer: 'Whale transaction alerts notify you when large holders (whales) make significant moves in the market. These transactions can often impact prices, so staying informed helps you make better trading decisions.'
  },
  {
    question: 'How accurate are the trade signals?',
    answer: 'Our trade signals are generated using multiple AI models and have shown a historical accuracy of 68-75% in backtesting. Each signal includes a confidence score to help you gauge its potential reliability.'
  },
  {
    question: 'How does the gamification system work?',
    answer: 'As you learn and practice trading strategies, you earn tokens for completing courses, making successful trades, and maintaining streaks. These tokens unlock higher tier benefits and features on the platform.'
  },
  {
    question: 'Do I need prior trading experience to use this platform?',
    answer: 'Not at all! Our platform is designed for traders of all levels. Beginners can start with our introductory courses and practice with simulated trading, while experienced traders can dive into advanced strategies and real-time signals.'
  },
  {
    question: 'How often are the courses updated?',
    answer: 'We regularly update our courses to reflect the latest market conditions and trading strategies. Our team of experienced traders and data scientists ensures that all content remains relevant and effective.'
  }
]

class ReactHome extends Component {
  componentDidMount () {
    this.props.setHeaderMenuItem('home')
  }

  render () {
    return (
      <Layout style={{ padding: '0' }}>
        <Content style={contentStyle}>
          {/* Hero Section */}
          <div style={{
            background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
            padding: '40px 24px',
            borderRadius: '8px',
            marginBottom: '32px',
            color: 'white'
          }}>
            <Row gutter={[24, 24]} align="middle">
              <Col xs={24} md={16}>
                <Title level={1} style={{ color: 'white', marginBottom: '8px' }}>
                  AI-Powered Trading Strategies
                </Title>
                <Title level={3} style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'normal', marginTop: 0 }}>
                  Learn, practice, and master trading with cutting-edge AI analysis
                </Title>
                <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
                  Leverage sentiment analysis, whale transaction alerts, and smart trade signals to make informed decisions.
                  Earn tokens as you learn and climb the ranks!
                </Paragraph>
                <div style={{ marginTop: '24px' }}>
                  <Button type="primary" size="large" style={{ marginRight: '16px', background: '#faad14', borderColor: '#faad14' }}>
                    Get Started
                  </Button>
                  <Button size="large" ghost>
                    Learn More
                  </Button>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <Card style={{ background: 'rgba(255, 255, 255, 0.1)', borderColor: 'transparent' }}>
                  <Title level={4} style={{ color: 'white', textAlign: 'center', marginBottom: '16px' }}>
                    Current Market Trends
                  </Title>
                  <List
                    dataSource={marketTrends}
                    renderItem={item => (
                      <List.Item style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', color: 'white' }}>
                          <Text strong style={{ color: 'white' }}>{item.name}</Text>
                          <Text style={{ color: 'white' }}>{item.price}</Text>
                          <Text style={{ color: item.change.includes('+') ? '#52c41a' : '#f5222d' }}>
                            {item.change}
                          </Text>
                          <Tag color={item.sentiment === 'Bullish' ? 'green' : item.sentiment === 'Bearish' ? 'red' : 'blue'}>
                            {item.sentiment}
                          </Tag>
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </div>

          {/* Stats Section */}
          <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
            <Col xs={24} sm={12} md={6}>
              <Card bordered={false}>
                <Statistic
                  title="AI Accuracy"
                  value={73}
                  suffix="%"
                  prefix={<BulbOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card bordered={false}>
                <Statistic
                  title="Active Users"
                  value={5843}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card bordered={false}>
                <Statistic
                  title="Whale Alerts Today"
                  value={28}
                  prefix={<BellOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card bordered={false}>
                <Statistic
                  title="Courses Available"
                  value={42}
                  prefix={<BookOutlined />}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Features Section */}
          <Title level={2} style={{ textAlign: 'center', marginBottom: '32px' }}>
            Our Platform Features
          </Title>
          <Row gutter={[24, 24]} style={{ marginBottom: '48px' }}>
            {features.map((feature, index) => (
              <Col key={index} xs={24} sm={12} md={8}>
                <Card
                  hoverable
                  style={{ height: '100%', borderRadius: '8px' }}
                  bodyStyle={{ padding: '24px' }}
                >
                  <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    {feature.icon}
                  </div>
                  <Title level={4} style={{ textAlign: 'center' }}>
                    {feature.title}
                  </Title>
                  <Paragraph style={{ textAlign: 'center' }}>
                    {feature.description}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Recent Signals & Whale Alerts */}
          <Row gutter={24} style={{ marginBottom: '48px' }}>
            <Col xs={24} md={12}>
              <Card
                title={<span><RocketOutlined /> Recent Trade Signals</span>}
                extra={<Link to="/signals">View All</Link>}
                style={{ height: '100%', borderRadius: '8px' }}
              >
                <List
                  itemLayout="horizontal"
                  dataSource={recentSignals}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            style={{
                              backgroundColor: item.direction === 'BUY' ? '#52c41a' : '#f5222d',
                              verticalAlign: 'middle'
                            }}
                            icon={item.direction === 'BUY' ? <RiseOutlined /> : <FallOutlined />}
                          />
                        }
                        title={
                          <span>
                            {item.pair} <Tag color={item.direction === 'BUY' ? 'green' : 'red'}>{item.direction}</Tag>
                            <span style={{ float: 'right', fontSize: '12px', color: '#8c8c8c' }}>{item.timestamp}</span>
                          </span>
                        }
                        description={
                          <span>
                            Price: {item.price} | Target: {item.target} | Stop: {item.stop} |
                            <span style={{ marginLeft: '5px' }}>
                              Confidence:
                              <Tag color={item.confidence >= 80 ? 'green' : 'orange'} style={{ marginLeft: '5px' }}>
                                {item.confidence}%
                              </Tag>
                            </span>
                          </span>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card
                title={<span><BellOutlined /> Whale Transaction Alerts</span>}
                extra={<Link to="/whale-alerts">View All</Link>}
                style={{ height: '100%', borderRadius: '8px' }}
              >
                <List
                  itemLayout="horizontal"
                  dataSource={whaleAlerts}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            style={{
                              backgroundColor: '#722ed1',
                              verticalAlign: 'middle'
                            }}
                            icon={<ThunderboltOutlined />}
                          />
                        }
                        title={
                          <span>
                            {item.asset} {item.type} - {item.value}
                            <span style={{ float: 'right', fontSize: '12px', color: '#8c8c8c' }}>{item.timestamp}</span>
                          </span>
                        }
                        description={
                          <span>
                            Amount: {item.amount} | From: {item.from} | To: {item.to}
                          </span>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>

          {/* Gamification Teaser */}
          <Card
            style={{
              marginBottom: '48px',
              backgroundImage: 'linear-gradient(to right, rgba(250, 173, 20, 0.05), rgba(250, 173, 20, 0.2))',
              borderRadius: '8px'
            }}
          >
            <Row gutter={24} align="middle">
              <Col xs={24} md={16}>
                <Title level={3}>Learn Trading Through Gamification</Title>
                <Paragraph>
                  Complete courses, execute successful trades, and maintain daily streaks to earn tokens.
                  Unlock premium features and climb the ranks from Bronze to Premium tier.
                </Paragraph>
                <Button type="primary" style={{ background: '#fa8c16', borderColor: '#fa8c16' }}>
                  Explore Rewards System
                </Button>
              </Col>
              <Col xs={24} md={8} style={{ textAlign: 'center' }}>
                <TrophyOutlined style={{ fontSize: 100, color: '#fa8c16' }} />
              </Col>
            </Row>
          </Card>

          {/* FAQ Section */}
          <Title level={2} style={{ marginBottom: '24px' }}>
            <QuestionCircleOutlined /> Frequently Asked Questions
          </Title>
          <Collapse defaultActiveKey={['0']} style={{ marginBottom: '48px' }}>
            {faqs.map((faq, index) => (
              <Panel header={faq.question} key={index}>
                <Paragraph>{faq.answer}</Paragraph>
              </Panel>
            ))}
          </Collapse>

          {/* Call to Action */}
          <div style={{
            background: 'linear-gradient(135deg, #237804 0%, #389e0d 100%)',
            padding: '32px 24px',
            borderRadius: '8px',
            textAlign: 'center',
            color: 'white',
            marginBottom: '32px'
          }}>
            <Title level={2} style={{ color: 'white', marginBottom: '16px' }}>
              Ready to Start Your Trading Journey?
            </Title>
            <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px', marginBottom: '24px' }}>
              Join thousands of traders using our AI-powered platform to make smarter decisions.
            </Paragraph>
            <Button type="primary" size="large" style={{ background: 'white', borderColor: 'white', color: '#389e0d' }}>
              Sign Up Now
            </Button>
          </div>
        </Content>
      </Layout>
    )
  }
}

const mapActionsToProps = {
  setHeaderMenuItem
}

export default connect(null, mapActionsToProps)(ReactHome)
