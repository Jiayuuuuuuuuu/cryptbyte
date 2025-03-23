import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Layout,
  Row,
  Col,
  Card,
  Statistic,
  Progress,
  Tag,
  List,
  Typography,
  Button,
  Divider,
  Tabs,
  Table,
  Badge
} from 'antd'
import {
  FallOutlined,
  DollarOutlined,
  LineChartOutlined,
  HistoryOutlined,
  LockOutlined,
  UnlockOutlined,
  UpCircleOutlined,
  UserOutlined,
  BookOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  RiseOutlined
} from '@ant-design/icons'
import { setHeaderMenuItem } from '../../redux_actions'

const { Content } = Layout
const { Title, Paragraph, Text } = Typography
const { TabPane } = Tabs

const tierData = {
  bronze: {
    name: 'Bronze',
    color: '#CD7F32',
    requiredTokens: 0,
    benefits: ['Basic analysis access', 'Daily trading simulations', 'Community access']
  },
  silver: {
    name: 'Silver',
    color: '#C0C0C0',
    requiredTokens: 500,
    benefits: ['Advanced chart patterns', 'Extended trading history', 'Weekly market insights']
  },
  gold: {
    name: 'Gold',
    color: '#FFD700',
    requiredTokens: 1500,
    benefits: ['AI trade predictions', 'Premium indicators', 'Priority support']
  },
  premium: {
    name: 'Premium',
    color: '#7B68EE',
    requiredTokens: 5000,
    benefits: ['Whale tracking alerts', 'API access', 'Custom strategy builder', 'Zero platform fees']
  }
}

class ProfilePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      recentActivities: [
        { id: 1, type: 'login', tokens: 5, date: '2025-03-18 09:30:22', description: 'Daily login reward' },
        { id: 2, type: 'trade', tokens: 15, date: '2025-03-18 10:15:47', description: 'Successful Complete the first chapter' },
        { id: 3, type: 'lesson', tokens: 20, date: '2025-03-17 16:22:05', description: 'Completed Advanced Technical Analysis' },
        { id: 4, type: 'streak', tokens: 50, date: '2025-03-16 09:05:33', description: '10-day login streak bonus' }
      ],
      learningStats: {
        completionRate: 64,
        totalModules: 37,
        averageScore: 82.8,
        highestScore: 95.5,
        lowestScore: 74.2,
        averageStudyTime: '3.2 hours'
      },
      achievements: [
        { name: 'First Trade', completed: true, reward: 50 },
        { name: 'Win Streak (5)', completed: true, reward: 100 },
        { name: '100 Total Trades', completed: false, reward: 200 },
        { name: 'Trading Master', completed: false, reward: 500 },
        { name: 'Whale Watcher', completed: false, reward: 300 }
      ]
    }
  }

  componentDidMount () {
    this.props.setHeaderMenuItem('profile')
  }

  getCurrentTier () {
    const { tokens } = this.props.user
    if (tokens >= tierData.premium.requiredTokens) return 'premium'
    if (tokens >= tierData.gold.requiredTokens) return 'gold'
    if (tokens >= tierData.silver.requiredTokens) return 'silver'
    return 'bronze'
  }

  getNextTierProgress () {
    const { tokens } = this.props.user
    const currentTier = this.getCurrentTier()

    if (currentTier === 'premium') {
      return 100 // Already at max tier
    }

    let nextTier
    let progress

    if (currentTier === 'bronze') {
      nextTier = 'silver'
      progress = ((tokens / tierData.silver.requiredTokens) * 100).toFixed(2)
    } else if (currentTier === 'silver') {
      nextTier = 'gold'
      progress = (((tokens - tierData.silver.requiredTokens) /
                 (tierData.gold.requiredTokens - tierData.silver.requiredTokens)) * 100).toFixed(2)
    } else if (currentTier === 'gold') {
      nextTier = 'premium'
      progress = (((tokens - tierData.gold.requiredTokens) /
                 (tierData.premium.requiredTokens - tierData.gold.requiredTokens)) * 100).toFixed(2)
    }

    return {
      nextTier,
      progress: Math.min(Math.max(progress, 0), 100)
    }
  }

  render () {
    const { user } = this.props
    const currentTier = this.getCurrentTier()
    const nextTierInfo = this.getNextTierProgress()

    const columns = [
      {
        title: 'Date & Time',
        dataIndex: 'date',
        key: 'date'
      },
      {
        title: 'Module',
        dataIndex: 'module',
        key: 'module'
      },
      {
        title: 'Step Completed',
        dataIndex: 'step',
        key: 'step',
        render: step => (
          <Tag color={step === 'Assessment' ? 'green' : 'blue'}>
            {step}
          </Tag>
        )
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: status => (
          <Tag color={status === 'Completed' ? 'green' : 'orange'}>
            {status}
          </Tag>
        )
      },
      {
        title: 'Score',
        dataIndex: 'score',
        key: 'score',
        render: score => score ? `${score}%` : '-'
      },
      {
        title: 'Tokens',
        dataIndex: 'tokens',
        key: 'tokens',
        render: tokens => (
          <span>
            <TrophyOutlined style={{ color: '#FFD700' }} /> {tokens}
          </span>
        )
      }
    ]

    const learningHistoryData = [
      {
        key: '1',
        date: '2025-03-18 10:15:47',
        module: 'Technical Analysis Fundamentals',
        step: 'Assessment',
        status: 'Completed',
        score: 85,
        tokens: 20
      },
      {
        key: '2',
        date: '2025-03-17 14:22:31',
        module: 'Technical Analysis Fundamentals',
        step: 'Practical Exercise',
        status: 'Completed',
        score: null,
        tokens: 15
      },
      {
        key: '3',
        date: '2025-03-16 09:45:12',
        module: 'Technical Analysis Fundamentals',
        step: 'Reading Material',
        status: 'Completed',
        score: null,
        tokens: 10
      },
      {
        key: '4',
        date: '2025-03-15 11:30:05',
        module: 'Technical Analysis Fundamentals',
        step: 'Video Lesson',
        status: 'Completed',
        score: null,
        tokens: 10
      },
      {
        key: '5',
        date: '2025-03-12 16:22:18',
        module: 'Introduction to Crypto Trading',
        step: 'Assessment',
        status: 'Completed',
        score: 92,
        tokens: 25
      }
    ]

    return (
      <Layout className='layout'>
        <Content style={{ padding: '0 50px', marginTop: 20 }}>
          <div className='site-layout-content' style={{ background: '#fff', padding: 24, minHeight: 280 }}>
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Card bordered={false}>
                  <Row gutter={24} align='middle'>
                    <Col xs={24} md={6}>
                      <div style={{ textAlign: 'center' }}>
                        <Badge>
                          <div style={{
                            width: 100,
                            height: 100,
                            borderRadius: '50%',
                            background: '#f0f2f5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            border: `4px solid ${tierData[currentTier].color}`
                          }}>
                            <UserOutlined style={{ fontSize: 48, color: '#555' }} />
                          </div>
                        </Badge>
                        <Title level={3} style={{ marginTop: 16, marginBottom: 0 }}>{user.name}</Title>
                        <Tag color={tierData[currentTier].color} style={{
                          fontSize: '16px',
                          padding: '5px 10px',
                          marginTop: 8
                        }}>
                          {tierData[currentTier].name} Trader
                        </Tag>
                      </div>
                    </Col>
                    <Col xs={24} md={18}>
                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={8}>
                          <Statistic
                            title='Total Tokens'
                            value={user.tokens}
                            prefix={<TrophyOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                          />
                        </Col>
                        <Col xs={24} sm={8}>
                          <Statistic
                            title='Learning Progress'
                            value={this.state.learningStats.completionRate + '%'}
                            prefix={<LineChartOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                          />
                        </Col>
                        <Col xs={24} sm={8}>
                          <Statistic
                            title='Learning Streak'
                            value={user.streak}
                            prefix={<HistoryOutlined />}
                          />
                        </Col>
                      </Row>
                      <Button
                        type="primary"
                        icon={<TrophyOutlined />}
                        size="large"
                        style={{ marginTop: 16 }}
                        onClick={() => this.props.history.push('/rewards')}
                      >
                        View Rewards
                      </Button>

                      {currentTier !== 'premium' && (
                        <div style={{ marginTop: 24 }}>
                          <Paragraph>
                            <Text strong>Next Tier: </Text>
                            <Tag color={tierData[nextTierInfo.nextTier].color}>
                              {tierData[nextTierInfo.nextTier].name}
                            </Tag>
                            <Text> {tierData[nextTierInfo.nextTier].requiredTokens - user.tokens} more tokens needed</Text>
                          </Paragraph>
                          <Progress
                            percent={nextTierInfo.progress}
                            strokeColor={tierData[nextTierInfo.nextTier].color}
                            size='small'
                          />
                        </div>
                      )}
                    </Col>
                  </Row>
                </Card>
              </Col>

              <Col xs={24} md={16}>
                <Tabs defaultActiveKey='1'>
                  <TabPane tab='Learning History' key='1'>
                    <Table
                      columns={columns}
                      dataSource={learningHistoryData}
                      pagination={{ pageSize: 5 }}
                    />
                  </TabPane>
                  <TabPane tab='Achievements' key='2'>
                    <List
                      itemLayout='horizontal'
                      dataSource={this.state.achievements}
                      renderItem={item => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={item.completed
                              ? <UnlockOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                              : <LockOutlined style={{ fontSize: 24, color: '#bfbfbf' }} />
                            }
                            title={<span>{item.name} <Tag color='blue'>{item.reward} tokens</Tag></span>}
                            description={item.completed
                              ? 'Achievement completed'
                              : 'Achievement locked - keep trading to unlock'
                            }
                          />
                        </List.Item>
                      )}
                    />
                  </TabPane>
                  <TabPane tab='Available Features' key='3'>
                    <List
                      itemLayout='horizontal'
                      dataSource={tierData[currentTier].benefits}
                      renderItem={item => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<UnlockOutlined style={{ fontSize: 24, color: '#52c41a' }} />}
                            title={item}
                          />
                        </List.Item>
                      )}
                    />

                    {currentTier !== 'premium' && (
                      <>
                        <Divider orientation='left'>Locked Features</Divider>
                        <List
                          itemLayout='horizontal'
                          dataSource={[
                            ...tierData[nextTierInfo.nextTier].benefits.filter(
                              item => !tierData[currentTier].benefits.includes(item)
                            )
                          ]}
                          renderItem={item => (
                            <List.Item>
                              <List.Item.Meta
                                avatar={<LockOutlined style={{ fontSize: 24, color: '#bfbfbf' }} />}
                                title={
                                  <span style={{ color: '#bfbfbf' }}>{item}</span>
                                }
                                description={`Unlock with ${tierData[nextTierInfo.nextTier].name} tier`}
                              />
                            </List.Item>
                          )}
                        />
                      </>
                    )}
                  </TabPane>
                </Tabs>
              </Col>

              <Col xs={24} md={8}>
                <Card title='Recent Activity' bordered={false}>
                  <List
                    itemLayout='horizontal'
                    dataSource={this.state.recentActivities}
                    renderItem={item => (
                      <List.Item>
                        <List.Item.Meta
                          title={
                            <span>
                              {item.description}{' '}
                              <Tag color='green'>+{item.tokens} tokens</Tag>
                            </span>
                          }
                          description={
                            <span>
                              <ClockCircleOutlined /> {item.date}
                            </span>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>

                <Card title='Learning Progress' bordered={false} style={{ marginTop: 24 }}>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Statistic
                        title='Courses Completed'
                        value='1/3'
                        valueStyle={{ color: '#52c41a' }}
                        prefix={<BookOutlined />}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title='Achievement Rate'
                        value='85%'
                        valueStyle={{ color: '#52c41a' }}
                        prefix={<TrophyOutlined />}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title='Study Time'
                        value='12.5 hours'
                        prefix={<ClockCircleOutlined />}
                      />
                    </Col>
                    <Col span={12}>
                      <div>
                        <div className="ant-statistic-title">Current Course</div>
                        <div className="ant-statistic-content" style={{ display: 'flex', alignItems: 'center' }}>
                          <span className="ant-statistic-content-prefix" style={{ marginRight: '8px' }}><RiseOutlined /></span>
                          <span className="ant-statistic-content-value">Technical Analysis</span>
                        </div>
                      </div>
                    </Col>
                  </Row>
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
    user: {
      name: 'Trader123',
      tokens: 780,
      joinDate: '2024-11-15',
      streak: 10
    }
  }
}

const mapActionsToProps = {
  setHeaderMenuItem
}

export default connect(mapStateToProps, mapActionsToProps)(ProfilePage)
