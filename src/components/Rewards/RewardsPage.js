import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Layout,
  Row,
  Col,
  Card,
  Button,
  Typography,
  Timeline,
  Statistic,
  Divider,
  Badge,
  List,
  Tag,
  Alert,
  Tooltip,
  Progress,
  Table
} from 'antd'
import {
  TrophyOutlined,
  GiftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  RocketOutlined,
  LockOutlined,
  UnlockOutlined,
  StarOutlined,
  FireOutlined,
  ThunderboltOutlined
} from '@ant-design/icons'
import { setHeaderMenuItem } from '../../redux_actions'
import { addTokens, processLoginReward } from '../../redux/actions/userActions'

const { Content } = Layout
const { Title, Paragraph, Text } = Typography

// Mock rewards data
const dailyChallenges = [
  { id: 1, name: 'Daily Login', completed: true, tokens: 5, description: 'Log in to the platform' },
  { id: 2, name: 'First Trade', completed: false, tokens: 15, description: 'Complete your first trade of the day' },
  { id: 3, name: 'Market Analysis', completed: false, tokens: 20, description: 'Use AI analysis tools for 10+ minutes' },
  { id: 4, name: 'Profitable Trade', completed: false, tokens: 25, description: 'Make a trade with >2% profit' }
]

const weeklyTasks = [
  { id: 1, name: 'Trading Volume', progress: 60, target: 100, tokens: 100, description: 'Complete 100 trades this week' },
  { id: 2, name: 'Learning Progress', progress: 40, target: 100, tokens: 150, description: 'Complete 3 learning modules' },
  { id: 3, name: 'Winning Strategy', progress: 30, target: 100, tokens: 200, description: 'Maintain >60% win rate this week' }
]

const tierBenefits = {
  bronze: [
    'Basic technical analysis tools',
    'Community forum access',
    'Up to 5 simulated trades per day',
    'Basic educational content'
  ],
  silver: [
    'All Bronze benefits',
    'Advanced chart patterns',
    'Up to 15 simulated trades per day',
    'Social sentiment indicators',
    'Weekly market reports'
  ],
  gold: [
    'All Silver benefits',
    'AI trade suggestions',
    'Unlimited simulated trades',
    'Priority support',
    'Real-time alerts',
    'Custom indicators'
  ],
  premium: [
    'All Gold benefits',
    'Whale tracking API',
    'Institutional order flow data',
    'Zero platform fees',
    'Advanced AI strategy builder',
    'Personalized coaching'
  ]
}

class RewardsPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dailyRewardClaimed: false,
      streakDays: 10
    }
  }

  componentDidMount () {
    // Set the current menu item when component mounts
    this.props.setHeaderMenuItem('rewards')
  }

  claimDailyReward = () => {
    // Process login reward via Redux action
    const tokenReward = this.props.processLoginReward()

    this.setState({
      dailyRewardClaimed: true
    })
  }

  completeChallenge = (challenge) => {
    // In a real app, this would verify the challenge was actually completed
    this.props.addTokens(challenge.tokens)

    // Update the UI to show completion
    // This is just a mock - in a real app, you'd update the state in your Redux store
    const updatedChallenges = dailyChallenges.map(c =>
      c.id === challenge.id ? { ...c, completed: true } : c
    )

    // For demo purposes only - this won't persist between renders
    dailyChallenges.forEach((c, index) => {
      if (c.id === challenge.id) {
        dailyChallenges[index].completed = true
      }
    })

    this.forceUpdate()
  }

  // Get current tier based on tokens
  getCurrentTier () {
    const { tokens } = this.props.user
    if (tokens >= 5000) return 'premium'
    if (tokens >= 1500) return 'gold'
    if (tokens >= 500) return 'silver'
    return 'bronze'
  }

  // Get tier color
  getTierColor (tier) {
    const colors = {
      bronze: '#CD7F32',
      silver: '#C0C0C0',
      gold: '#FFD700',
      premium: '#7B68EE'
    }
    return colors[tier] || colors.bronze
  }

  render () {
    const { user } = this.props
    const currentTier = this.getCurrentTier()
    const currentTierColor = this.getTierColor(currentTier)

    // Calculate streak bonus
    const streakBonus = user.streak >= 10
      ? 50
      : user.streak >= 5
        ? 25
        : user.streak >= 3 ? 15 : 5

    // Next tier info
    const nextTierInfo = {
      bronze: { next: 'silver', tokens: 500 },
      silver: { next: 'gold', tokens: 1500 },
      gold: { next: 'premium', tokens: 5000 },
      premium: { next: null, tokens: null }
    }

    const nextTier = nextTierInfo[currentTier].next
    const tokensForNextTier = nextTierInfo[currentTier].tokens
    const tokensNeeded = nextTier ? tokensForNextTier - user.tokens : 0
    const progressToNextTier = nextTier ? (user.tokens / tokensForNextTier) * 100 : 100

    return (
      <Layout className="layout">
        <Content style={{ padding: '0 50px', marginTop: 20 }}>
          <div className="site-layout-content" style={{ background: '#fff', padding: 24, minHeight: 280 }}>
            {/* Top Section - Tokens & Streak */}
            <Row gutter={[24, 24]}>
              <Col xs={24} md={16}>
                <Card bordered={false}>
                  <Row gutter={24}>
                    <Col xs={24} sm={12}>
                      <Statistic
                        title="Your Tokens"
                        value={user.tokens}
                        prefix={<TrophyOutlined />}
                        valueStyle={{ color: '#1890ff' }}
                      />
                      <Button
                        type="primary"
                        icon={<GiftOutlined />}
                        style={{ marginTop: 16 }}
                        onClick={this.claimDailyReward}
                        disabled={this.state.dailyRewardClaimed}
                      >
                        {this.state.dailyRewardClaimed ? 'Daily Reward Claimed' : 'Claim Daily Reward'}
                      </Button>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Card title="Login Streak" size="small">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <FireOutlined style={{ fontSize: 24, color: '#ff4d4f', marginRight: 8 }} />
                          <span style={{ fontSize: 24 }}>{user.streak} days</span>
                        </div>
                        <Text type="secondary">Current streak bonus: +{streakBonus} tokens</Text>
                        <Progress
                          percent={user.streak % 5 * 20}
                          format={() => `${5 - (user.streak % 5)} days to next bonus`}
                          strokeColor="#ff4d4f"
                        />
                        <Alert
                          message="Keep your streak going!"
                          description="Log in daily to increase your token rewards and unlock special achievements."
                          type="info"
                          showIcon
                          style={{ marginTop: 16 }}
                        />
                      </Card>
                    </Col>
                  </Row>
                </Card>
              </Col>

              <Col xs={24} md={8}>
                <Card
                  title={
                    <span>
                      <Tag color={currentTierColor} style={{ fontSize: '16px', padding: '4px 8px' }}>
                        {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)} Tier
                      </Tag>
                    </span>
                  }
                  bordered={false}
                >
                  {nextTier
                    ? (
                      <>
                        <Paragraph>
                          <Text strong>Next Tier: </Text>
                          <Tag color={this.getTierColor(nextTier)}>
                            {nextTier.charAt(0).toUpperCase() + nextTier.slice(1)}
                          </Tag>
                          <Text> - {tokensNeeded} more tokens needed</Text>
                        </Paragraph>
                        <Progress
                          percent={progressToNextTier}
                          strokeColor={this.getTierColor(nextTier)}
                        />
                      </>
                    )
                    : (
                      <Alert
                        message="Maximum Tier Reached"
                        description="You've reached the Premium tier! Enjoy all exclusive benefits."
                        type="success"
                        showIcon
                      />
                    )}
                </Card>
              </Col>
            </Row>

            {/* Daily Challenges Section */}
            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
              <Col xs={24} md={12}>
                <Card
                  title={
                    <span>
                      <ThunderboltOutlined /> Daily Challenges
                    </span>
                  }
                  bordered={false}
                >
                  <List
                    itemLayout="horizontal"
                    dataSource={dailyChallenges}
                    renderItem={item => (
                      <List.Item
                        actions={[
                          item.completed
                            ? (
                              <Tag color="green">Completed</Tag>
                            )
                            : (
                              <Button
                                type="primary"
                                size="small"
                                onClick={() => this.completeChallenge(item)}
                              >
                              Complete
                              </Button>
                            )
                        ]}
                      >
                        <List.Item.Meta
                          avatar={item.completed
                            ? <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />
                            : <ClockCircleOutlined style={{ color: '#faad14', fontSize: 20 }} />
                          }
                          title={<span>{item.name} <Tag color="blue">+{item.tokens} tokens</Tag></span>}
                          description={item.description}
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>

              <Col xs={24} md={12}>
                <Card
                  title={
                    <span>
                      <RocketOutlined /> Weekly Tasks
                    </span>
                  }
                  bordered={false}
                >
                  <List
                    itemLayout="horizontal"
                    dataSource={weeklyTasks}
                    renderItem={item => (
                      <List.Item>
                        <List.Item.Meta
                          title={<span>{item.name} <Tag color="purple">+{item.tokens} tokens</Tag></span>}
                          description={
                            <>
                              <Text>{item.description}</Text>
                              <Progress
                                percent={item.progress}
                                format={() => `${item.progress}%`}
                              />
                            </>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>

            {/* Tier Benefits Section */}
            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
              <Col span={24}>
                <Card
                  title={
                    <span>
                      <StarOutlined /> Tier Benefits
                    </span>
                  }
                  bordered={false}
                >
                  <Row gutter={16}>
                    {Object.keys(tierBenefits).map(tier => {
                      const isUnlocked = (tier === 'bronze') ||
                                         (tier === 'silver' && user.tokens >= 500) ||
                                         (tier === 'gold' && user.tokens >= 1500) ||
                                         (tier === 'premium' && user.tokens >= 5000)

                      return (
                        <Col xs={24} sm={12} md={6} key={tier}>
                          <Card
                            title={
                              <Tag color={this.getTierColor(tier)} style={{ fontSize: '14px', padding: '2px 6px' }}>
                                {tier.charAt(0).toUpperCase() + tier.slice(1)}
                              </Tag>
                            }
                            bordered={false}
                            style={{
                              background: isUnlocked ? '#f6ffed' : '#f5f5f5',
                              opacity: isUnlocked ? 1 : 0.7
                            }}
                          >
                            {isUnlocked
                              ? (
                                <Badge.Ribbon text="Unlocked" color="green">
                                  <List
                                    size="small"
                                    dataSource={tierBenefits[tier]}
                                    renderItem={item => (
                                      <List.Item>
                                        <Text>{item}</Text>
                                      </List.Item>
                                    )}
                                  />
                                </Badge.Ribbon>
                              )
                              : (
                                <>
                                  <div style={{ textAlign: 'center', marginBottom: 16 }}>
                                    <LockOutlined style={{ fontSize: 24 }} />
                                    <div>
                                      <Text type="secondary">
                                        {tier === 'silver'
                                          ? '500 tokens required'
                                          : tier === 'gold'
                                            ? '1,500 tokens required'
                                            : '5,000 tokens required'}
                                      </Text>
                                    </div>
                                  </div>
                                  <List
                                    size="small"
                                    dataSource={tierBenefits[tier]}
                                    renderItem={item => (
                                      <List.Item>
                                        <Text type="secondary">{item}</Text>
                                      </List.Item>
                                    )}
                                  />
                                </>
                              )}
                          </Card>
                        </Col>
                      )
                    })}
                  </Row>
                </Card>
              </Col>
            </Row>

            {/* Leaderboard Preview */}
            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
              <Col span={24}>
                <Card
                  title={
                    <span>
                      <TrophyOutlined /> Weekly Leaderboard Preview
                    </span>
                  }
                  extra={<a href="#">View Full Leaderboard</a>}
                  bordered={false}
                >
                  <Table
                    dataSource={[
                      { key: '1', rank: 1, name: 'TraderElite', tokens: 2450, winRate: '78%', badge: 'Gold' },
                      { key: '2', rank: 2, name: 'CryptoKing', tokens: 2120, winRate: '72%', badge: 'Gold' },
                      { key: '3', rank: 3, name: 'MoonTrader', tokens: 1840, winRate: '68%', badge: 'Gold' },
                      { key: '4', rank: 4, name: 'Trader123', tokens: 780, winRate: '64%', badge: 'Silver' },
                      { key: '5', rank: 5, name: 'BitMaster', tokens: 680, winRate: '61%', badge: 'Silver' }
                    ]}
                    columns={[
                      {
                        title: 'Rank',
                        dataIndex: 'rank',
                        key: 'rank',
                        render: rank => {
                          const color = rank === 1
                            ? 'gold'
                            : rank === 2
                              ? 'silver'
                              : rank === 3 ? '#cd7f32' : ''
                          return (
                            <span style={{ color, fontWeight: 'bold' }}>{rank}</span>
                          )
                        }
                      },
                      {
                        title: 'Trader',
                        dataIndex: 'name',
                        key: 'name',
                        render: (name, record) => (
                          <span style={{ fontWeight: name === 'Trader123' ? 'bold' : 'normal' }}>
                            {name}
                            {name === 'Trader123' && <Tag color="blue" style={{ marginLeft: 8 }}>You</Tag>}
                          </span>
                        )
                      },
                      {
                        title: 'Tokens',
                        dataIndex: 'tokens',
                        key: 'tokens'
                      },
                      {
                        title: 'Win Rate',
                        dataIndex: 'winRate',
                        key: 'winRate'
                      },
                      {
                        title: 'Tier',
                        dataIndex: 'badge',
                        key: 'badge',
                        render: badge => {
                          const color = badge === 'Gold'
                            ? '#FFD700'
                            : badge === 'Silver'
                              ? '#C0C0C0'
                              : badge === 'Bronze' ? '#CD7F32' : '#7B68EE'
                          return (
                            <Tag color={color}>{badge}</Tag>
                          )
                        }
                      }
                    ]}
                    pagination={false}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        </Content>
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
  addTokens,
  processLoginReward
}

export default connect(mapStateToProps, mapActionsToProps)(RewardsPage)
