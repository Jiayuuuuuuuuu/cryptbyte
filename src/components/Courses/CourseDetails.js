import React from 'react'
import { Typography, Progress, List, Tag, Button, Divider, Alert } from 'antd'
import { CheckCircleOutlined, ClockCircleOutlined, BookOutlined } from '@ant-design/icons'
import CourseCertificate from './CourseCertificate'

const { Title, Paragraph, Text } = Typography

const CourseDetail = ({ course, onModuleSelect, user }) => {
  // Calculate completion percentage
  const completedModules = course.modules.filter(module => module.completed).length
  const completionPercentage = Math.round((completedModules / course.modules.length) * 100)
  const isCompleted = completionPercentage === 100

  return (
    <div className="course-detail">
      <Title level={3}>{course.title}</Title>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Tag color={course.level.toLowerCase() === 'beginner' ? 'green' : course.level.toLowerCase() === 'intermediate' ? 'blue' : 'red'}>
          {course.level}
        </Tag>
        <Divider type="vertical" />
        <ClockCircleOutlined style={{ marginRight: 8 }} />
        <Text>{course.duration}</Text>
        <Divider type="vertical" />
        <BookOutlined style={{ marginRight: 8 }} />
        <Text>{course.modules.length} modules</Text>
      </div>

      <Paragraph>{course.description}</Paragraph>

      <div style={{ marginTop: 24, marginBottom: 24 }}>
        <Title level={4}>Your Progress</Title>
        <Progress
          percent={completionPercentage}
          status={isCompleted ? 'success' : 'active'}
          format={percent => `${completedModules}/${course.modules.length}`}
        />

        {isCompleted && (
          <Alert
            message="Course Completed!"
            description="Congratulations! You have completed all modules in this course."
            type="success"
            showIcon
            style={{ marginTop: 16 }}
          />
        )}
      </div>

      {isCompleted && <CourseCertificate course={course} user={user} />}

      <Title level={4} style={{ marginTop: 24 }}>Course Modules</Title>
      <List
        itemLayout="horizontal"
        dataSource={course.modules}
        renderItem={(module) => (
          <List.Item
            actions={[
              module.completed
                ? <Button type="text" icon={<CheckCircleOutlined />} className="completed-button">Completed</Button>
                : <Button type="primary" onClick={() => onModuleSelect(module)}>Start Module</Button>
            ]}
          >
            <List.Item.Meta
              title={`${module.id}. ${module.title}`}
              description={module.description || 'Learn essential concepts and practical applications'}
            />
          </List.Item>
        )}
      />
    </div>
  )
}

export default CourseDetail
