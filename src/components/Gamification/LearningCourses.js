import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Row,
  Col,
  Card,
  Button,
  Typography,
  Progress,
  Tag,
  Divider,
  Alert,
  List,
  Modal
} from 'antd'
import {
  BookOutlined,
  CheckCircleOutlined,
  LockOutlined
} from '@ant-design/icons'
import { addTokens } from '../../redux_actions'

const { Title, Paragraph, Text } = Typography

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

class LearningCourses extends Component {
  constructor (props) {
    super(props)
    this.state = {
      learningModalVisible: false,
      selectedCourse: null
    }
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

  startLesson = (courseId, lessonId) => {
    // In a real app, this would navigate to the lesson content
    console.log(`Starting lesson ${lessonId} in course ${courseId}`)
    // You could also dispatch an action to mark the lesson as started
  }

  render () {
    const { learningModalVisible, selectedCourse } = this.state

    return (
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

        <Modal
          title={selectedCourse ? selectedCourse.title : ''}
          open={learningModalVisible}
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
                        onClick={() => this.startLesson(selectedCourse.id, item.id)}
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
      </Row>
    )
  }
}

const mapDispatchToProps = {
  addTokens
}

export default connect(null, mapDispatchToProps)(LearningCourses)
