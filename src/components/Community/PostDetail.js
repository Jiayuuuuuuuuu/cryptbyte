import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import {
  Layout,
  Typography,
  Card,
  Button,
  Input,
  Tag,
  Row,
  Col,
  Avatar,
  Space,
  Divider,
  Comment,
  Tooltip,
  Form,
  List,
  Statistic
} from 'antd'
import {
  LikeOutlined,
  MessageOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  UserOutlined,
  ArrowLeftOutlined,
  TrophyOutlined
} from '@ant-design/icons'
import { getPostDetails, addComment, likePost, unlikePost } from '../../redux_actions'
const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

const PostDetail = ({ currentPost, getPostDetails, addComment, likePost, unlikePost, user, likedPosts }) => {
  const { postId } = useParams()
  const [commentForm] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)

  const isPostLiked = likedPosts && likedPosts[postId]

  useEffect(() => {
    getPostDetails(postId)
  }, [getPostDetails, postId])

  const handleCommentSubmit = (values) => {
    setSubmitting(true)

    const comment = {
      author: user?.username || 'anonymous_user',
      authorAvatar: user?.avatar || '/api/placeholder/32/32',
      content: values.comment
    }

    addComment(postId, comment)
    commentForm.resetFields()
    setSubmitting(false)
  }

  const handleLikeToggle = () => {
    if (isPostLiked) {
      unlikePost(postId)
    } else {
      likePost(postId)
    }
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

  if (!currentPost) {
    return (
      <Layout style={{ padding: '0 24px 24px', minHeight: 'calc(100vh - 64px - 70px)' }}>
        <div style={{ textAlign: 'center', marginTop: 100 }}>
          <Title level={3}>Loading post...</Title>
        </div>
      </Layout>
    )
  }

  return (
    <Layout style={{ padding: '0 24px 24px', minHeight: 'calc(100vh - 64px - 70px)' }}>
      <Row justify="center">
        <Col xs={24} sm={24} md={16}>
          <Link to="/community">
            <Button
              icon={<ArrowLeftOutlined />}
              style={{ marginTop: 20, marginBottom: 10 }}
            >
              Back to Community
            </Button>
          </Link>

          <Card style={{ marginBottom: 20 }}>
            <Title level={2}>{currentPost.title}</Title>

            <Space style={{ marginBottom: 20 }}>
              <Avatar src={currentPost.authorAvatar} />
              <Text strong>{currentPost.author}</Text>
              <Tooltip title="Author reputation">
                <Tag color="gold" icon={<TrophyOutlined />}>
                  {currentPost.reputation} Rep
                </Tag>
              </Tooltip>
              <Tooltip title="Posted date">
                <Text type="secondary">
                  <ClockCircleOutlined /> {getTimeAgo(currentPost.date)}
                </Text>
              </Tooltip>
            </Space>

            <div style={{ marginBottom: 20 }}>
              {currentPost.tags.map(tag => (
                <Tag color="blue" key={tag} style={{ marginRight: 8, marginBottom: 8 }}>
                  {tag}
                </Tag>
              ))}
            </div>

            <Paragraph style={{ fontSize: '16px', whiteSpace: 'pre-line' }}>
              {currentPost.content}
            </Paragraph>

            <Divider />

            <Row>
              <Col span={8}>
                <Statistic
                  title="Views"
                  value={currentPost.views}
                  prefix={<EyeOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Likes"
                  value={currentPost.likes}
                  prefix={
                    <Tooltip title={isPostLiked ? 'Unlike' : 'Like'}>
                      <LikeOutlined
                        style={{
                          cursor: 'pointer',
                          color: isPostLiked ? '#1890ff' : 'inherit'
                        }}
                        onClick={handleLikeToggle}
                      />
                    </Tooltip>
                  }
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Comments"
                  value={currentPost.comments?.length || 0}
                  prefix={<MessageOutlined />}
                />
              </Col>
            </Row>
          </Card>

          <Card title={`Comments (${currentPost.comments?.length || 0})`}>
            <List
              itemLayout="horizontal"
              dataSource={currentPost.comments || []}
              renderItem={comment => (
                <Comment
                  author={comment.author}
                  avatar={<Avatar src={comment.authorAvatar} />}
                  content={comment.content}
                  datetime={
                    <Tooltip title={new Date(comment.date).toLocaleString()}>
                      <span>{getTimeAgo(comment.date)}</span>
                    </Tooltip>
                  }
                  actions={[
                    <Tooltip key="like" title="Like">
                      <Space>
                        <LikeOutlined />
                        <span>{comment.likes}</span>
                      </Space>
                    </Tooltip>
                  ]}
                />
              )}
            />

            <Divider />

            <Title level={4}>Add a Comment</Title>
            <Form
              form={commentForm}
              onFinish={handleCommentSubmit}
            >
              <Form.Item
                name="comment"
                rules={[{ required: true, message: 'Please write your comment' }]}
              >
                <TextArea
                  rows={4}
                  placeholder="Share your thoughts on this post..."
                />
              </Form.Item>
              <Form.Item>
                <Button
                  htmlType="submit"
                  type="primary"
                  loading={submitting}
                >
                  Post Comment
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={8} style={{ paddingLeft: 24 }}>
          <Card title="About the Author" style={{ marginTop: 70, marginBottom: 20 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space align="center">
                <Avatar size={64} src={currentPost.authorAvatar} />
                <div>
                  <Text strong style={{ fontSize: '18px' }}>{currentPost.author}</Text>
                  <br />
                  <Tag color="gold" icon={<TrophyOutlined />}>
                    {currentPost.reputation} Reputation
                  </Tag>
                </div>
              </Space>
              <Divider />
              <Statistic title="Total Posts" value={15} style={{ marginBottom: 12 }} />
              <Statistic title="Total Comments" value={47} style={{ marginBottom: 12 }} />
              <Statistic title="Member Since" value="Oct 2024" />
            </Space>
          </Card>

          <Card title="Related Posts">
            <List
              itemLayout="vertical"
              dataSource={[
                {
                  id: 'related-1',
                  title: 'RSI Strategy That Works in Bear Markets',
                  tags: ['Technical Analysis', 'RSI'],
                  author: 'trader_pro',
                  date: '2025-03-15T10:20:00Z',
                  comments: 8
                },
                {
                  id: 'related-2',
                  title: 'How I Use Volume Profile for Bitcoin Trading',
                  tags: ['Bitcoin', 'Volume Analysis'],
                  author: 'btc_master',
                  date: '2025-03-18T15:30:00Z',
                  comments: 11
                }
              ]}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Link to={`/community/post/${item.id}`}>
                        {item.title}
                      </Link>
                    }
                    description={
                      <>
                        <Space>
                          <Text type="secondary">
                            <UserOutlined /> {item.author}
                          </Text>
                          <Text type="secondary">
                            <MessageOutlined /> {item.comments}
                          </Text>
                        </Space>
                        <div style={{ marginTop: 8 }}>
                          {item.tags.map(tag => (
                            <Tag color="blue" key={tag} style={{ marginRight: 4 }}>
                              {tag}
                            </Tag>
                          ))}
                        </div>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </Layout>
  )
}

const mapStateToProps = (state) => ({
  currentPost: state.community.currentPost,
  user: state.user,
  likedPosts: state.community.likedPosts
})

const mapDispatchToProps = {
  getPostDetails,
  addComment,
  likePost,
  unlikePost
}

export default connect(mapStateToProps, mapDispatchToProps)(PostDetail)
