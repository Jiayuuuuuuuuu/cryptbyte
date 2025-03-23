import React, { useState } from 'react'
import { Typography, Card, Button, Modal, Divider, Tag, Space, Row, Col } from 'antd'
import { TrophyOutlined, DownloadOutlined, ShareAltOutlined, PrinterOutlined, CheckCircleOutlined } from '@ant-design/icons'
import logoImage from '../../images/logo/logo.png'

const { Title, Paragraph, Text } = Typography

const CourseCertificate = ({ course, user }) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const completionDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const certificateId = `CRYP-${course.id}-${user.id}-${Date.now().toString().slice(-6)}`

  return (
    <div className="certificate-section">
      <Card
        style={{ marginTop: 24, textAlign: 'center', borderColor: '#1890ff' }}
        actions={[
          <Button key="view-certificate" type="primary" icon={<TrophyOutlined />} onClick={showModal}>
            View Certificate
          </Button>
        ]}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <TrophyOutlined style={{ fontSize: 48, color: '#faad14' }} />
          <Title level={4}>Congratulations!</Title>
          <Paragraph>
            You&apos;ve successfully completed <Text strong>{course.title}</Text>
          </Paragraph>
          <Tag color="success" icon={<CheckCircleOutlined />}>Course Completed</Tag>
        </Space>
      </Card>

      <Modal
        title={null}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        centered
        bodyStyle={{ padding: 0 }}
      >
        <div className="certificate" style={{ padding: 40, border: '10px solid #001529', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 20, right: 20 }}>
            <img src={logoImage} alt="Company Logo" style={{ height: 60 }} />
          </div>

          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <Title level={2} style={{ color: '#001529' }}>Certificate of Completion</Title>
            <Divider style={{ borderColor: '#1890ff' }} />
          </div>

          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <Paragraph>This certifies that</Paragraph>
            <Title level={3} style={{ margin: '10px 0' }}>{user.name}</Title>
            <Paragraph>has successfully completed the course</Paragraph>
            <Title level={2} style={{ margin: '20px 0', color: '#1890ff' }}>{course.title}</Title>
            <Paragraph>on {completionDate}</Paragraph>
          </div>

          <Row style={{ marginTop: 60 }}>
            <Col span={12} style={{ borderTop: '1px solid #001529', paddingTop: 10, textAlign: 'center' }}>
              <Text>Course Instructor</Text>
            </Col>
            <Col span={12} style={{ borderTop: '1px solid #001529', paddingTop: 10, textAlign: 'center' }}>
              <Text>Platform Director</Text>
            </Col>
          </Row>

          <div style={{ marginTop: 40, textAlign: 'center' }}>
            <Text type="secondary">Certificate ID: {certificateId}</Text>
            <div style={{ marginTop: 10 }}>
              <Text type="secondary">Verify this certificate at: cryptobyte.com/verify</Text>
            </div>
          </div>
        </div>

        <div style={{ padding: 16, backgroundColor: '#f0f2f5', display: 'flex', justifyContent: 'center' }}>
          <Space>
            <Button type="primary" icon={<DownloadOutlined />}>
              Download PDF
            </Button>
            <Button icon={<ShareAltOutlined />}>
              Share
            </Button>
            <Button icon={<PrinterOutlined />}>
              Print
            </Button>
          </Space>
        </div>
      </Modal>
    </div>
  )
}

export default CourseCertificate
