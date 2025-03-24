import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Layout,
  Typography,
  Card,
  Button,
  Input,
  Tag,
  Row,
  Col,
  Tabs,
  List,
  Avatar,
  Space,
  Divider,
  Tooltip,
  Modal,
  Form,
  Select
} from 'antd'
import {
  LikeOutlined,
  MessageOutlined,
  EyeOutlined,
  FireOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  TagOutlined,
  UserOutlined,
  PlusOutlined
} from '@ant-design/icons'
import { getCommunityPosts, createPost } from '../../redux_actions'
import CommunityPost from './CommunityPost'
import avatarqy from '../../images/avatar/qy.jpg'
import avatarkz from '../../images/avatar/kaizhi.jpeg'
import avatarboon from '../../images/avatar/boon.png'

const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs
const { Search } = Input
const { Option } = Select

const ReactCommunity = ({ posts, getCommunityPosts, createPost, user }) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [activeTab, setActiveTab] = useState('trending')

  const popularTags = [
    'Bitcoin', 'Ethereum', 'Technical Analysis', 'Fundamental Analysis',
    'DeFi', 'NFTs', 'Altcoins', 'Trading Bots', 'Risk Management'
  ]

  useEffect(() => {
    getCommunityPosts()
  }, [getCommunityPosts])

  const showCreatePostModal = () => {
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
  }

  const handlePostSubmit = (values) => {
    createPost({
      title: values.title,
      content: values.content,
      tags: values.tags,
      author: user?.username || 'anonymous_user',
      authorAvatar: user?.avatar
    })
    setIsModalVisible(false)
    form.resetFields()
  }

  const getTimeAgo = (dateString) => {
    const now = new Date()
    const past = new Date(dateString)
    const diffInSeconds = Math.floor((now - past) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    return `${Math.floor(diffInSeconds / 86400)} days ago`
  }

  return (
    <Layout style={{ padding: '0 24px 24px', minHeight: 'calc(100vh - 64px - 70px)' }}>
      <Title level={2} style={{ marginTop: 20 }}><MessageOutlined /> Community Discussions</Title>
      <Text type="secondary" style={{ marginBottom: 30, display: 'block' }}>
        Share trading strategies, discuss market trends, and learn from other traders
      </Text>

      <Row gutter={24} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={24} md={16}>
          <Search
            placeholder="Search discussions..."
            size="large"
            style={{ marginBottom: 20 }}
          />

          <Card>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              tabBarExtraContent={
                <Link to="/community/create">
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                  >
                    New Post
                  </Button>
                </Link>
              }
            >
              <TabPane
                tab={<span><FireOutlined /> Trending</span>}
                key="trending"
              >
                <List
                  itemLayout="vertical"
                  size="large"
                  pagination={{
                    pageSize: 5
                  }}
                  dataSource={posts}
                  renderItem={post => (
                    <CommunityPost post={post} />
                  )}
                />
              </TabPane>
              <TabPane
                tab={<span><ClockCircleOutlined /> Recent</span>}
                key="recent"
              >
                <List
                  itemLayout="vertical"
                  size="large"
                  pagination={{
                    pageSize: 5
                  }}
                  dataSource={[...posts].sort((a, b) => new Date(b.date) - new Date(a.date))}
                  renderItem={post => (
                    <List.Item
                      key={post.id}
                      actions={[
                        <Tooltip key="views" title="Views">
                          <Space>
                            <EyeOutlined />
                            {post.views}
                          </Space>
                        </Tooltip>,
                        <Tooltip key="likes" title="Likes">
                          <Space>
                            <LikeOutlined />
                            {post.likes}
                          </Space>
                        </Tooltip>,
                        <Tooltip key="comments" title="Comments">
                          <Space>
                            <MessageOutlined />
                            {post.comments}
                          </Space>
                        </Tooltip>,
                        <Tooltip key="posted" title="Posted">
                          <Space>
                            <ClockCircleOutlined />
                            {getTimeAgo(post.date)}
                          </Space>
                        </Tooltip>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar src={post.authorAvatar} icon={<UserOutlined/>} />}
                        title={
                          <Link to={`/community/post/${post.id}`}>
                            {post.title}
                          </Link>
                        }
                        description={
                          <Space>
                            <UserOutlined />
                            <Text>{post.author}</Text>
                          </Space>
                        }
                      />
                      <Paragraph ellipsis={{ rows: 2 }}>
                        {post.content}
                      </Paragraph>
                      <div>
                        {post.tags.map(tag => (
                          <Tag color="blue" key={tag} style={{ marginBottom: 8 }}>
                            {tag}
                          </Tag>
                        ))}
                      </div>
                    </List.Item>
                  )}
                />
              </TabPane>
              <TabPane
                tab={<span><TrophyOutlined /> Top Contributors</span>}
                key="topContributors"
              >
                <List
                  itemLayout="vertical"
                  size="large"
                  pagination={{
                    pageSize: 5
                  }}
                  dataSource={[...posts].sort((a, b) => b.likes - a.likes)}
                  renderItem={post => (
                    <List.Item
                      key={post.id}
                      actions={[
                        <Tooltip key="views" title="Views">
                          <Space>
                            <EyeOutlined />
                            {post.views}
                          </Space>
                        </Tooltip>,
                        <Tooltip key="likes" title="Likes">
                          <Space>
                            <LikeOutlined />
                            {post.likes}
                          </Space>
                        </Tooltip>,
                        <Tooltip key="comments" title="Comments">
                          <Space>
                            <MessageOutlined />
                            {post.comments}
                          </Space>
                        </Tooltip>,
                        <Tooltip key="posted" title="Posted">
                          <Space>
                            <ClockCircleOutlined />
                            {getTimeAgo(post.date)}
                          </Space>
                        </Tooltip>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar src={post.authorAvatar} icon={<UserOutlined />} />}
                        title={
                          <Link to={`/community/post/${post.id}`}>
                            {post.title}
                          </Link>
                        }
                        description={
                          <Space>
                            <UserOutlined />
                            <Text>{post.author}</Text>
                          </Space>
                        }
                      />
                      <Paragraph ellipsis={{ rows: 2 }}>
                        {post.content}
                      </Paragraph>
                      <div>
                        {post.tags.map(tag => (
                          <Tag color="blue" key={tag} style={{ marginBottom: 8 }}>
                            {tag}
                          </Tag>
                        ))}
                      </div>
                    </List.Item>
                  )}
                />
              </TabPane>
            </Tabs>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={8}>
          <Card title="Popular Tags" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {popularTags.map(tag => (
                <Tag color="blue" key={tag} style={{ margin: '4px 0' }}>
                  {tag}
                </Tag>
              ))}
            </div>
          </Card>

          <Card title="Community Guidelines" style={{ marginBottom: 20 }}>
            <ul style={{ paddingLeft: 20 }}>
              <li>Be respectful and constructive in discussions</li>
              <li>No financial advice - share strategies, not recommendations</li>
              <li>Support claims with data when possible</li>
              <li>No spam or excessive self-promotion</li>
              <li>Use appropriate tags for better discoverability</li>
            </ul>
          </Card>

          <Card title="Top Contributors">
            <List
              itemLayout="horizontal"
              dataSource={[
                {
                  name: 'CurryLaksa',
                  avatar: avatarqy,
                  contributions: 127,
                  reputation: 4583
                },
                {
                  name: 'Kaizhiiii',
                  avatar: avatarkz,
                  contributions: 89,
                  reputation: 3250
                },
                {
                  name: 'AhBoon',
                  avatar: avatarboon,
                  contributions: 64,
                  reputation: 2198
                }
              ]}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={item.name}
                    description={
                      <div>
                        <Tag color="gold">{item.reputation} Rep</Tag>
                        <Tag color="purple">{item.contributions} Posts</Tag>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title="Create New Post"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handlePostSubmit}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input placeholder="Enter an interesting title for your post" />
          </Form.Item>

          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: 'Please enter post content' }]}
          >
            <Input.TextArea
              rows={6}
              placeholder="Share your trading strategy, question, or insights..."
            />
          </Form.Item>

          <Form.Item
            name="tags"
            label="Tags"
            rules={[{ required: true, message: 'Please select at least one tag' }]}
          >
            <Select
              mode="multiple"
              placeholder="Select tags"
              style={{ width: '100%' }}
            >
              {popularTags.map(tag => (
                <Option key={tag} value={tag}>{tag}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Post
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleCancel}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  )
}

const mapStateToProps = (state) => ({
  posts: state.community.posts,
  user: state.user
})

const mapDispatchToProps = {
  getCommunityPosts,
  createPost
}

export default connect(mapStateToProps, mapDispatchToProps)(ReactCommunity)
