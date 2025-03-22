import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Layout, Typography, Row, Col, Card, Tag, Progress, Button, Divider, Tabs, Modal, List, Collapse } from 'antd'
import { BookOutlined, LockOutlined, CheckCircleOutlined, RightOutlined, TrophyOutlined, FieldTimeOutlined, TeamOutlined } from '@ant-design/icons'
import { fetchCourses, getCourseDetails, updateCourseProgress } from '../../redux_actions'
import ModuleContent from './ModuleContent'

const { Content } = Layout
const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs
const { Panel } = Collapse

const LearningCourses = ({ courses, courseDetails, fetchCourses, getCourseDetails, updateCourseProgress, userTier }) => {
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [courseModalVisible, setCourseModalVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('1')
  const [moduleModalVisible, setModuleModalVisible] = useState(false)
  const [activeModule, setActiveModule] = useState(null)

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  const handleCourseClick = (courseId) => {
    getCourseDetails(courseId)
    setSelectedCourse(courseId)
    setCourseModalVisible(true)
  }

  const handleModuleClick = (module) => {
    setActiveModule(module)
    setModuleModalVisible(true)
  }

  const handleCompleteModule = () => {
    if (activeModule && selectedCourse) {
      updateCourseProgress(selectedCourse, activeModule.id, true)
      setModuleModalVisible(false)
    }
  }

  const getLevelColor = (level) => {
    switch (level.toLowerCase()) {
    case 'beginner':
      return 'green'
    case 'intermediate':
      return 'blue'
    case 'advanced':
      return 'red'
    default:
      return 'default'
    }
  }

  const calculateProgress = (course) => {
    if (!courseDetails || courseDetails.id !== course.id) return 0
    const completedModules = courseDetails.modules.filter(module => module.completed).length
    return Math.round((completedModules / courseDetails.modules.length) * 100)
  }

  // Filter courses based on user tier
  const getFilteredCourses = () => {
    if (activeTab === '1') return courses
    if (activeTab === '2') return courses.filter(course => course.level.toLowerCase() === 'beginner')
    if (activeTab === '3') return courses.filter(course => course.level.toLowerCase() === 'intermediate')
    if (activeTab === '4') return courses.filter(course => course.level.toLowerCase() === 'advanced')
    return courses
  }

  const isCourseLocked = (course) => {
    // Tier-based access logic
    if (course.level.toLowerCase() === 'advanced' && userTier !== 'gold' && userTier !== 'premium') {
      return true
    }
    if (course.level.toLowerCase() === 'intermediate' && userTier === 'bronze') {
      return true
    }
    return !course.unlocked
  }

  return (
    <Content style={{ padding: '0 24px', marginTop: 16 }}>
      <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col>
            <Title level={2}><BookOutlined /> Crypto Trading Academy</Title>
            <Paragraph>
              Master cryptocurrency trading with our comprehensive courses designed for all skill levels.
              Track your progress, earn certificates, and boost your trading confidence.
            </Paragraph>
          </Col>
          <Col>
            <Card style={{ width: 200 }}>
              <Title level={4}>Your Progress</Title>
              <div>
                <Text>Completed Courses: </Text>
                <Tag color="green">2/8</Tag>
              </div>
              <div>
                <Text>Current Tier: </Text>
                <Tag color="blue">{userTier.charAt(0).toUpperCase() + userTier.slice(1)}</Tag>
              </div>
            </Card>
          </Col>
        </Row>

        <Divider />

        <Tabs defaultActiveKey="1" onChange={setActiveTab}>
          <TabPane tab="All Courses" key="1" />
          <TabPane tab="Beginner" key="2" />
          <TabPane tab="Intermediate" key="3" />
          <TabPane tab="Advanced" key="4" />
        </Tabs>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          {getFilteredCourses().map((course) => (
            <Col xs={24} sm={12} lg={8} key={course.id}>
              <Card
                hoverable
                onClick={() => !isCourseLocked(course) && handleCourseClick(course.id)}
                style={{ height: '100%' }}
                cover={
                  <div style={{
                    height: 160,
                    background: '#001529',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative'
                  }}>
                    <BookOutlined style={{ fontSize: 48, color: '#fff' }} />
                    {isCourseLocked(course) && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column'
                      }}>
                        <LockOutlined style={{ fontSize: 48, color: '#fff' }} />
                        <Text style={{ color: '#fff', marginTop: 8 }}>
                          {course.level.toLowerCase() === 'advanced' ? 'Gold tier required' : 'Silver tier required'}
                        </Text>
                      </div>
                    )}
                  </div>
                }
              >
                <Tag color={getLevelColor(course.level)}>{course.level}</Tag>
                <Title level={4}>{course.title}</Title>
                <Paragraph ellipsis={{ rows: 2 }}>{course.description}</Paragraph>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  <FieldTimeOutlined style={{ marginRight: 8 }} />
                  <Text>{course.duration}</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <BookOutlined style={{ marginRight: 8 }} />
                  <Text>{course.modules} modules</Text>
                </div>
                <Divider style={{ margin: '12px 0' }} />
                <Progress percent={calculateProgress(course)} status="active" />
              </Card>
            </Col>
          ))}
        </Row>

        {/* Course Details Modal */}
        <Modal
          title={courseDetails?.title || 'Course Details'}
          visible={courseModalVisible}
          onCancel={() => setCourseModalVisible(false)}
          footer={null}
          width={700}
        >
          {courseDetails && (
            <>
              <Paragraph>{courseDetails.description}</Paragraph>

              <div style={{ marginBottom: 16 }}>
                <Title level={4}>Course Progress</Title>
                <Progress
                  percent={calculateProgress(courseDetails)}
                  format={percent => `${percent}% Complete`}
                />
              </div>

              <Title level={4}>Modules</Title>
              <List
                itemLayout="horizontal"
                dataSource={courseDetails.modules}
                renderItem={module => (
                  <List.Item
                    actions={[
                      module.completed
                        ? <Tag icon={<CheckCircleOutlined />} color="success">Completed</Tag>
                        : <Button
                          type="primary"
                          size="small"
                          onClick={() => handleModuleClick(module)}
                        >
                          Start
                        </Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<div style={{ width: 24, textAlign: 'center' }}>{module.id}</div>}
                      title={module.title}
                      description={module.completed ? "You've completed this module" : 'Click to start learning'}
                    />
                  </List.Item>
                )}
              />
            </>
          )}
        </Modal>

        {/* Module Content Modal */}
        <Modal
          title={activeModule?.title || 'Module Content'}
          visible={moduleModalVisible}
          onCancel={() => setModuleModalVisible(false)}
          footer={null} // Remove the footer buttons since ModuleContent has its own
          width={800}
        >
          {activeModule && (
            <ModuleContent
              module={activeModule}
              onComplete={handleCompleteModule}
            />
          )}
        </Modal>
      </div>
    </Content>
  )
}

const mapStateToProps = (state) => ({
  courses: state.courses.list || [],
  courseDetails: state.courses.currentCourse,
  userTier: state.user.tier
})

const mapDispatchToProps = {
  fetchCourses,
  getCourseDetails,
  updateCourseProgress
}

export default connect(mapStateToProps, mapDispatchToProps)(LearningCourses)
