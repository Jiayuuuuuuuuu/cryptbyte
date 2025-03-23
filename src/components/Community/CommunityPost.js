import React from 'react'
import { Link } from 'react-router-dom'
import {
  Card,
  Typography,
  Avatar,
  Space,
  Tag,
  Tooltip,
  List
} from 'antd'
import {
  LikeOutlined,
  MessageOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  UserOutlined
} from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography

const CommunityPost = ({ post, showFull = false }) => {
  // Calculate time ago for display
  const getTimeAgo = (dateString) => {
    const now = new Date()
    const past = new Date(dateString)
    const diffInSeconds = Math.floor((now - past) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    return `${Math.floor(diffInSeconds / 86400)} days ago`
  }

  // Actions to display under the post
  const actions = [
    <Tooltip key="views"title="Views">
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
        {post.comments?.length || post.commentsCount || 0}
      </Space>
    </Tooltip>,
    <Tooltip key="posted" title="Posted">
      <Space>
        <ClockCircleOutlined />
        {getTimeAgo(post.date)}
      </Space>
    </Tooltip>
  ]

  return (
    <List.Item
      key={post.id}
      actions={actions}
    >
      <List.Item.Meta
        avatar={<Avatar src={post.authorAvatar} />}
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
      <Paragraph
        ellipsis={showFull ? false : { rows: 2 }}
        style={{ marginBottom: 16 }}
      >
        {post.content}
      </Paragraph>
      <div>
        {post.tags.map(tag => (
          <Tag color="blue" key={tag} style={{ marginBottom: 8, marginRight: 8 }}>
            {tag}
          </Tag>
        ))}
      </div>
    </List.Item>
  )
}

export default CommunityPost
