import React, { useState, useEffect } from 'react'
import { Layout, Typography, Card, Tag, Space, Button, Divider, Row, Col, Statistic, Avatar, Breadcrumb } from 'antd'
import {
  HomeOutlined,
  FileTextOutlined,
  TagOutlined,
  CalendarOutlined,
  LinkOutlined,
  ArrowLeftOutlined,
  LikeOutlined,
  DislikeOutlined,
  ShareAltOutlined
} from '@ant-design/icons'
import { contentStyle, titleStyle } from '../../styles'

const { Content } = Layout
const { Title, Text, Paragraph } = Typography

const WordCloud = () => {
  // This is a simple word cloud component
  const words = [
    { text: 'Bitcoin', value: 64 },
    { text: 'DeFi', value: 42 },
    { text: 'Momentum', value: 38 },
    { text: 'Applications', value: 32 },
    { text: 'Crypto', value: 28 },
    { text: 'Blockchain', value: 26 },
    { text: 'Liquidity', value: 24 },
    { text: 'Trading', value: 22 },
    { text: 'Protocol', value: 18 },
    { text: 'Market', value: 16 },
    { text: 'Finance', value: 16 },
    { text: 'Decentralized', value: 14 },
    { text: 'Investment', value: 12 },
    { text: 'Technology', value: 10 }
  ]

  return (
    <div className="bg-gray-100 p-6 rounded-lg">
      <div className="flex flex-wrap justify-center">
        {words.map((word, index) => (
          <div
            key={index}
            className="m-2 transition-all duration-300 hover:scale-110"
            style={{
              fontSize: `${Math.max(12, Math.min(word.value / 4, 32))}px`,
              color: `hsl(${(word.value * 3) % 360}, 70%, 45%)`,
              cursor: 'pointer'
            }}
          >
            {word.text}
          </div>
        ))}
      </div>
    </div>
  )
}

const ReactCryptoNewsDetail = ({ goBack, newsItem = null }) => {
  // Default news item if none is provided
  const defaultNewsItem = {
    title: 'Bitcoin Shows Strong Momentum in DeFi Applications',
    date: '2025-03-17',
    source: 'CryptoDaily',
    sentiment: 'positive',
    author: 'Sarah Johnson',
    readTime: '5 min read',
    tags: ['Bitcoin', 'DeFi', 'Blockchain', 'Finance'],
    url: '#',
    content: `
      <p>Bitcoin is demonstrating remarkable strength in decentralized finance applications, according to recent market analyses. The leading cryptocurrency has seen a significant uptick in its integration with various DeFi protocols, expanding its utility beyond traditional store of value.</p>
      
      <p>Industry experts point to several key factors driving this trend:</p>
      
      <ul>
        <li>Increased institutional adoption of Bitcoin-based DeFi solutions</li>
        <li>Development of new wrapped Bitcoin tokens optimized for DeFi platforms</li>
        <li>Growing liquidity pools backed by Bitcoin reserves</li>
        <li>Enhanced cross-chain compatibility with Ethereum and other smart contract platforms</li>
      </ul>
      
      <p>"We're witnessing a paradigm shift in how Bitcoin interacts with the broader DeFi ecosystem," says blockchain researcher Michael Chen. "The original cryptocurrency is no longer sitting on the sidelines of the DeFi revolution."</p>
      
      <p>Data from DeFi Pulse shows that the total value locked (TVL) in Bitcoin-integrated protocols has increased by 47% in the first quarter of 2025, outpacing the general DeFi market growth of 32%.</p>
      
      <p>This trend is particularly noteworthy as it represents a convergence between the established security and network effects of Bitcoin with the innovative financial applications enabled by DeFi infrastructure.</p>
      
      <p>Market analysts suggest this development could strengthen Bitcoin's position in the cryptocurrency ecosystem while simultaneously accelerating DeFi adoption among more conservative investors who have historically favored Bitcoin over newer altcoins.</p>
      
      <p>The momentum appears sustainable as multiple high-profile DeFi projects have announced expanded Bitcoin support in their upcoming roadmaps, potentially creating a virtuous cycle of adoption and integration.</p>
    `
  }

  // Use the provided news item or fall back to the default
  const [news, setNews] = useState(newsItem || defaultNewsItem)

  // Update the news state when the newsItem prop changes
  useEffect(() => {
    if (newsItem) {
      setNews(newsItem)
    }
  }, [newsItem])

  const [relatedNews, setRelatedNews] = useState([
    {
      title: 'New Partnership Announced for Bitcoin',
      date: '2025-03-15',
      source: 'BlockchainInsider',
      sentiment: 'positive'
    },
    {
      title: 'Bitcoin Technical Analysis: Support and Resistance Levels',
      date: '2025-03-14',
      source: 'TradingView',
      sentiment: 'neutral'
    }
  ])

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
    case 'positive': return 'green'
    case 'negative': return 'red'
    default: return 'orange'
    }
  }

  const [likeCount, setLikeCount] = useState(42)
  const [dislikeCount, setDislikeCount] = useState(7)
  const [userAction, setUserAction] = useState(null)

  const handleLike = () => {
    if (userAction === 'like') {
      setLikeCount(likeCount - 1)
      setUserAction(null)
    } else {
      setLikeCount(userAction === 'dislike' ? likeCount + 1 : likeCount + 1)
      setDislikeCount(userAction === 'dislike' ? dislikeCount - 1 : dislikeCount)
      setUserAction('like')
    }
  }

  const handleDislike = () => {
    if (userAction === 'dislike') {
      setDislikeCount(dislikeCount - 1)
      setUserAction(null)
    } else {
      setDislikeCount(userAction === 'like' ? dislikeCount + 1 : dislikeCount + 1)
      setLikeCount(userAction === 'like' ? likeCount - 1 : likeCount)
      setUserAction('dislike')
    }
  }

  return (
    <Layout style={{ padding: '1rem' }}>
      <Content style={contentStyle}>
        <Card>
          <Breadcrumb style={{ marginBottom: '16px' }}>
            <Breadcrumb.Item href="#"><HomeOutlined /> Home</Breadcrumb.Item>
            <Breadcrumb.Item href="#"><FileTextOutlined /> News</Breadcrumb.Item>
            <Breadcrumb.Item>Article</Breadcrumb.Item>
          </Breadcrumb>

          <Button
            icon={<ArrowLeftOutlined />}
            onClick={goBack}
            style={{ marginBottom: '16px' }}
          >
            Back to News List
          </Button>

          <Title level={2}>{news.title}</Title>

          <Space split={<Divider type="vertical" />} style={{ marginBottom: '24px' }}>
            <Space>
              <CalendarOutlined /> {news.date}
            </Space>
            <Space>
              <Avatar size="small" src="/api/placeholder/24/24" />
              {news.author}
            </Space>
            <Text>{news.readTime}</Text>
            <Tag color={getSentimentColor(news.sentiment)}>
              {news.sentiment.charAt(0).toUpperCase() + news.sentiment.slice(1)}
            </Tag>
          </Space>

          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              {news.content
                ? (
                  <div
                    className="news-content"
                    dangerouslySetInnerHTML={{ __html: news.content }}
                    style={{
                      fontSize: '16px',
                      lineHeight: '1.8',
                      color: 'rgba(0, 0, 0, 0.85)'
                    }}
                  />
                )
                : (
                  <p>No content available for this article.</p>
                )}

              <Divider />

              <Space style={{ marginBottom: '16px' }}>
                <Button
                  type={userAction === 'like' ? 'primary' : 'default'}
                  icon={<LikeOutlined />}
                  onClick={handleLike}
                >
                  {likeCount}
                </Button>
                <Button
                  type={userAction === 'dislike' ? 'primary' : 'default'}
                  icon={<DislikeOutlined />}
                  onClick={handleDislike}
                >
                  {dislikeCount}
                </Button>
                <Button icon={<ShareAltOutlined />}>Share</Button>
              </Space>

              <Space style={{ marginBottom: '24px' }}>
                {news.tags && news.tags.map((tag, index) => (
                  <Tag key={index} color="blue">{tag}</Tag>
                ))}
              </Space>

              <Card title="Source Information" size="small" style={{ marginBottom: '24px' }}>
                <Space>
                  <Text>Source: {news.source}</Text>
                  <Button type="link" icon={<LinkOutlined />} href={news.url}>
                    View Original Article
                  </Button>
                </Space>
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card title="Sentiment Analysis" style={{ marginBottom: '24px' }}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Statistic
                      title="Positive"
                      value={78}
                      suffix="%"
                      valueStyle={{ color: 'green' }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Negative"
                      value={12}
                      suffix="%"
                      valueStyle={{ color: 'red' }}
                    />
                  </Col>
                  <Col span={24}>
                    <Divider style={{ margin: '12px 0' }} />
                    <Text>Sentiment analysis based on NLP processing of article content and market reaction.</Text>
                  </Col>
                </Row>
              </Card>

              <Card title="Word Cloud Analysis" style={{ marginBottom: '24px' }}>
                <WordCloud />
              </Card>

              <Card title="Related News" style={{ marginBottom: '24px' }}>
                {relatedNews.map((item, index) => (
                  <Card
                    key={index}
                    size="small"
                    hoverable
                    style={{
                      marginBottom: '8px',
                      borderLeft: `3px solid ${getSentimentColor(item.sentiment)}`
                    }}
                  >
                    <Space direction="vertical" size={0}>
                      <Text strong>{item.title}</Text>
                      <Space size="small">
                        <Text type="secondary">{item.date}</Text>
                        <Text type="secondary">Source: {item.source}</Text>
                      </Space>
                    </Space>
                  </Card>
                ))}
              </Card>
            </Col>
          </Row>
        </Card>
      </Content>
    </Layout>
  )
}

export default ReactCryptoNewsDetail
