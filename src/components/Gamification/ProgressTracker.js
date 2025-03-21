import React from 'react'
import {
  Card,
  Typography,
  Progress,
  Row,
  Col,
  Statistic,
  Divider,
  Tag,
  Space
} from 'antd'
import {
  TrophyOutlined,
  FireOutlined,
  StarOutlined,
  RiseOutlined
} from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography

const ProgressTracker = ({ stats, user }) => {
  // Calculate level based on tokens
  const determineLevel = (tokens) => {
    if (tokens < 500) return { level: 1, nextLevel: 500, progress: (tokens / 500) * 100 }
    if (tokens < 1000) return { level: 2, nextLevel: 1000, progress: ((tokens - 500) / 500) * 100 }
    if (tokens < 2000) return { level: 3, nextLevel: 2000, progress: ((tokens - 1000) / 1000) * 100 }
    if (tokens < 3500) return { level: 4, nextLevel: 3500, progress: ((tokens - 2000) / 1500) * 100 }
    if (tokens < 5000) return { level: 5, nextLevel: 5000, progress: ((tokens - 3500) / 1500) * 100 }
    return { level: 6, nextLevel: null, progress: 100 }
  }

  const userLevel = determineLevel(user.tokens)

  // Badge colors based on tier
  const tierColors = {
    bronze: '#cd7f32',
    silver: '#c0c0c0',
    gold: '#ffd700',
    premium: '#9370db'
  }

  // Tier benefits
  const tierBenefits = {
    bronze: ['Basic challenges', 'Daily rewards', 'Limited trading tools'],
    silver: ['All bronze benefits', 'Advanced challenges', 'Market analysis tools'],
    gold: ['All silver benefits', 'Premium challenges', 'Strategy builder tools'],
    premium: ['All gold benefits', 'Expert challenges', 'AI trading assistant']
  }

  return (
    <Card title="Your Progress Tracker" bordered={false}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card bordered={false}>
            <Title level={4}>Trader Level {userLevel.level}</Title>
            <Paragraph>
              {userLevel.nextLevel
                ? (
                  <Text>
                    {user.tokens} / {userLevel.nextLevel} tokens to next level
                  </Text>
                )
                : (
                  <Text>Maximum level reached!</Text>
                )}
            </Paragraph>
            <Progress
              percent={userLevel.progress}
              status={userLevel.nextLevel ? 'active' : 'success'}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068'
              }}
            />

            <Divider style={{ margin: '16px 0' }} />

            <Space direction="horizontal" style={{ marginBottom: 16 }}>
              <Tag color={tierColors[user.tier]} style={{ padding: '0 12px', height: 24 }}>
                <Text strong style={{ color: user.tier === 'silver' ? '#333' : 'white' }}>
                  {user.tier.toUpperCase()} TIER
                </Text>
              </Tag>
              <Text type="secondary">Member since {user.joinDate}</Text>
            </Space>

            <Title level={5}>Tier Benefits:</Title>
            <ul style={{ paddingLeft: 20 }}>
              {tierBenefits[user.tier].map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card bordered={false}>
            <Title level={4}>Challenge Performance</Title>

            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Accuracy Rate"
                  value={stats.totalChallenges > 0 ? Math.round((stats.correctPredictions / stats.totalChallenges) * 100) : 0}
                  suffix="%"
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<RiseOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Best Streak"
                  value={stats.maxStreak}
                  valueStyle={{ color: '#ff4d4f' }}
                  prefix={<FireOutlined />}
                />
              </Col>
            </Row>

            <Divider style={{ margin: '16px 0' }} />

            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Total Challenges"
                  value={stats.totalChallenges}
                  prefix={<StarOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Account Tokens"
                  value={user.tokens}
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<TrophyOutlined />}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Card>
  )
}

export default ProgressTracker
