import React, { useState } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import {
  Layout,
  Typography,
  Card,
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  message
} from 'antd'
import { TagOutlined, FileTextOutlined, UserOutlined } from '@ant-design/icons'
import { createPost } from '../../redux_actions'

const { Title, Text } = Typography
const { Option } = Select
const { TextArea } = Input

const CreatePost = ({ createPost, user }) => {
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)
  const history = useHistory()

  // Popular tags for selection
  const popularTags = [
    'Bitcoin', 'Ethereum', 'Technical Analysis', 'Fundamental Analysis',
    'DeFi', 'NFTs', 'Altcoins', 'Trading Bots', 'Risk Management',
    'Market Trends', 'Swing Trading', 'Day Trading', 'Scalping', 'HODL'
  ]

  const handleSubmit = (values) => {
    setSubmitting(true)

    const newPost = {
      title: values.title,
      content: values.content,
      tags: values.tags,
      author: user?.username || 'anonymous_user',
      authorAvatar: user?.avatar || '/api/placeholder/40/40'
    }

    createPost(newPost)

    message.success('Post created successfully!')
    setSubmitting(false)

    history.push('/community')
  }

  const handleCancel = () => {
    history.push('/community')
  }

  return (
    <Layout style={{ padding: '0 24px 24px', minHeight: 'calc(100vh - 64px - 70px)' }}>
      <Row justify="center">
        <Col xs={24} sm={24} md={16} lg={12}>
          <Title level={2} style={{ marginTop: 20, textAlign: 'center' }}>
            Create New Post
          </Title>
          <Text type="secondary" style={{ marginBottom: 30, display: 'block', textAlign: 'center' }}>
            Share your trading strategies, insights, and questions with the community
          </Text>

          <Card>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{ tags: ['Technical Analysis'] }}
            >
              <Form.Item
                name="title"
                label="Title"
                rules={[
                  { required: true, message: 'Please enter a title' },
                  { max: 100, message: 'Title must be less than 100 characters' }
                ]}
              >
                <Input
                  prefix={<FileTextOutlined />}
                  placeholder="Enter an interesting title for your post"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="content"
                label="Content"
                rules={[
                  { required: true, message: 'Please enter post content' },
                  { min: 20, message: 'Content should be at least 20 characters' }
                ]}
              >
                <TextArea
                  rows={10}
                  placeholder="Share your trading strategy, question, or insights... Consider including specific examples, charts, or data to support your points."
                />
              </Form.Item>

              <Form.Item
                name="tags"
                label="Tags"
                rules={[
                  { required: true, message: 'Please select at least one tag' },
                  { max: 5, message: 'You can select up to 5 tags' }
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="Select relevant tags"
                  style={{ width: '100%' }}
                  prefix={<TagOutlined />}
                  maxTagCount={5}
                >
                  {popularTags.map(tag => (
                    <Option key={tag} value={tag}>{tag}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={submitting} style={{ marginRight: 8 }}>
                  Post
                </Button>
                <Button onClick={handleCancel}>
                  Cancel
                </Button>
              </Form.Item>
            </Form>
          </Card>

          <Card style={{ marginTop: 20 }}>
            <Title level={4}>Community Guidelines</Title>
            <ul>
              <li>Be respectful and constructive in your posts</li>
              <li>Share strategies and insights, not financial advice</li>
              <li>Support your claims with data and evidence when possible</li>
              <li>Use appropriate tags to help others find your content</li>
              <li>Engage with others&apos; posts and provide valuable feedback</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </Layout>
  )
}

const mapStateToProps = (state) => ({
  user: state.user
})

const mapDispatchToProps = {
  createPost
}

export default connect(mapStateToProps, mapDispatchToProps)(CreatePost)
