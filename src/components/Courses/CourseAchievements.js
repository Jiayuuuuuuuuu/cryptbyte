import React from 'react'
import { Card, Typography, Row, Col, Progress, Tag, Divider, List, Avatar } from 'antd'
import { TrophyOutlined, BookOutlined, RiseOutlined, SafetyOutlined } from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography

const CourseAchievements = ({ courses, userTier, courseDetails }) => {
  // Calculate overall progress
  const totalModules = courses.reduce((total, course) => total + course.modules, 0)
  const completedCourses = courses.filter(course => {
    // Get the course details for this course
    const details = courseDetails && courseDetails.id === course.id ? courseDetails : null

    // If we have details and all modules are completed, count it as completed
    if (details && details.modules && details.modules.length > 0) {
      const totalModules = details.modules.length
      const completedModules = details.modules.filter(module => module.completed).length
      return completedModules === totalModules
    }

    // Otherwise, use your existing logic for previously completed courses
    return course.id === 1 // Keep this as a fallback for courses we know are completed
  }).length

  const achievements = [
    {
      id: 1,
      title: 'First Steps',
      description: 'Complete your first course module',
      icon: <BookOutlined />,
      completed: true,
      reward: '+10 tokens'
    },
    {
      id: 2,
      title: 'Knowledge Seeker',
      description: 'Complete an entire beginner course',
      icon: <RiseOutlined />,
      completed: true,
      reward: '+50 tokens'
    },
    {
      id: 3,
      title: 'Trading Apprentice',
      description: 'Complete all beginner courses',
      icon: <SafetyOutlined />,
      completed: false,
      reward: '+100 tokens'
    },
    {
      id: 4,
      title: 'Technical Analyst',
      description: 'Complete an intermediate course',
      icon: <TrophyOutlined />,
      completed: false,
      reward: '+150 tokens'
    }
  ]

  return (
    <Card title={<Title level={4}><TrophyOutlined /> Learning Achievements</Title>}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Title level={3}>Your Learning Journey</Title>
            <Progress
              type="circle"
              percent={Math.round((completedCourses / courses.length) * 100)}
              format={percent => `${completedCourses}/${courses.length}`}
              width={120}
            />
            <Paragraph style={{ marginTop: 16 }}>
              <Text strong>Courses Completed</Text>
            </Paragraph>
          </div>
        </Col>

        <Divider />

        <Col span={24}>
          <Title level={4}>Achievements</Title>
          <List
            itemLayout="horizontal"
            dataSource={achievements}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      style={{
                        backgroundColor: item.completed ? '#52c41a' : '#d9d9d9',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                      icon={item.icon}
                    />
                  }
                  title={<span>{item.title} {item.completed && <Tag color="success">Completed</Tag>}</span>}
                  description={item.description}
                />
                <Text type="secondary">{item.reward}</Text>
              </List.Item>
            )}
          />
        </Col>

        <Divider />

        <Col span={24}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4}>Current Tier:</Title>
            <Tag color={
              userTier === 'bronze'
                ? 'orange'
                : userTier === 'silver'
                  ? 'geekblue'
                  : userTier === 'gold' ? 'gold' : 'purple'
            } style={{ fontSize: 16, padding: '4px 12px' }}>
              {userTier.charAt(0).toUpperCase() + userTier.slice(1)}
            </Tag>
          </div>
          <Paragraph>
            Complete more courses to unlock advanced content and earn more rewards!
          </Paragraph>
        </Col>
      </Row>
    </Card>
  )
}

export default CourseAchievements
