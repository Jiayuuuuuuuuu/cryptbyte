import React, { useState } from 'react'
import { Card, Typography, Space, Tag, Button, Row, Col } from 'antd'
import { FileTextOutlined, EyeOutlined } from '@ant-design/icons'
import ReactCryptoNewsDetail from './ReactCryptoNewsDetail'

const { Title, Text, Paragraph } = Typography

const ReactCoinsDetailNewsSection = ({ coinName }) => {
  const [selectedNews, setSelectedNews] = useState(null)
  const [showNewsDetail, setShowNewsDetail] = useState(false)

  // Updated mockNews to include content for each news item
  const mockNews = [
    {
      title: `${coinName} Shows Strong Momentum in DeFi Applications`,
      date: '2025-03-17',
      source: 'CryptoDaily',
      sentiment: 'positive',
      author: 'Sarah Johnson',
      readTime: '5 min read',
      tags: ['Bitcoin', 'DeFi', 'Blockchain', 'Finance'],
      url: '#',
      content: `
        <p>${coinName} is demonstrating remarkable strength in decentralized finance applications, according to recent market analyses. The leading cryptocurrency has seen a significant uptick in its integration with various DeFi protocols, expanding its utility beyond traditional store of value.</p>
        
        <p>Industry experts point to several key factors driving this trend:</p>
        
        <ul>
          <li>Increased institutional adoption of ${coinName}-based DeFi solutions</li>
          <li>Development of new wrapped ${coinName} tokens optimized for DeFi platforms</li>
          <li>Growing liquidity pools backed by ${coinName} reserves</li>
          <li>Enhanced cross-chain compatibility with Ethereum and other smart contract platforms</li>
        </ul>
        
        <p>"We're witnessing a paradigm shift in how ${coinName} interacts with the broader DeFi ecosystem," says blockchain researcher Michael Chen. "The original cryptocurrency is no longer sitting on the sidelines of the DeFi revolution."</p>
        
        <p>Data from DeFi Pulse shows that the total value locked (TVL) in ${coinName}-integrated protocols has increased by 47% in the first quarter of 2025, outpacing the general DeFi market growth of 32%.</p>
        
        <p>This trend is particularly noteworthy as it represents a convergence between the established security and network effects of ${coinName} with the innovative financial applications enabled by DeFi infrastructure.</p>
        
        <p>Market analysts suggest this development could strengthen ${coinName}'s position in the cryptocurrency ecosystem while simultaneously accelerating DeFi adoption among more conservative investors who have historically favored ${coinName} over newer altcoins.</p>
        
        <p>The momentum appears sustainable as multiple high-profile DeFi projects have announced expanded ${coinName} support in their upcoming roadmaps, potentially creating a virtuous cycle of adoption and integration.</p>
      `
    },
    {
      title: `New Partnership Announced for ${coinName}`,
      date: '2025-03-15',
      source: 'BlockchainInsider',
      sentiment: 'positive',
      author: 'James Wilson',
      readTime: '3 min read',
      tags: ['Partnership', 'Industry', 'Technology', 'Adoption'],
      url: '#',
      content: `
        <p>A major industry partnership involving ${coinName} was announced today, sending waves through the cryptocurrency ecosystem. The collaboration aims to expand ${coinName}'s use cases and accessibility.</p>
        
        <p>The partnership between ${coinName} and a leading financial services provider will focus on:</p>
        
        <ul>
          <li>Integration of ${coinName} into traditional banking applications</li>
          <li>Development of new payment solutions</li>
          <li>Expansion of institutional custody services</li>
          <li>Joint research initiatives on regulatory compliance</li>
        </ul>
        
        <p>This move represents a significant milestone in the mainstream adoption of ${coinName} and could potentially open new markets for the cryptocurrency.</p>
      `
    },
    {
      title: `${coinName} Technical Analysis: Support and Resistance Levels`,
      date: '2025-03-14',
      source: 'TradingView',
      sentiment: 'neutral',
      author: 'Alex Chen',
      readTime: '4 min read',
      tags: ['Technical Analysis', 'Trading', 'Market', 'Price Action'],
      url: '#',
      content: `
        <p>Our technical analysis of ${coinName} reveals important support and resistance levels that traders should watch in the coming weeks.</p>
        
        <p>Current key levels:</p>
        
        <ul>
          <li>Strong support at $42,500</li>
          <li>Secondary support at $40,800</li>
          <li>Immediate resistance at $45,700</li>
          <li>Major resistance at $48,200</li>
        </ul>
        
        <p>The 50-day moving average is currently intersecting with the 200-day moving average, potentially forming a golden cross if the upward momentum continues.</p>
        
        <p>Volume patterns indicate accumulation at current levels, which could provide a solid foundation for the next move. RSI remains in neutral territory at 56, suggesting room for additional upside before reaching overbought conditions.</p>
      `
    },
    {
      title: `Market Concerns: ${coinName} Facing Regulatory Scrutiny`,
      date: '2025-03-12',
      source: 'CoinDesk',
      sentiment: 'negative',
      author: 'Melissa Thompson',
      readTime: '6 min read',
      tags: ['Regulation', 'Government', 'Legal', 'Compliance'],
      url: '#',
      content: `
        <p>Regulatory bodies in several jurisdictions have announced new scrutiny of ${coinName} markets, raising concerns among investors. The developments come amid broader efforts to establish clearer frameworks for cryptocurrency operations.</p>
        
        <p>Key regulatory developments include:</p>
        
        <ul>
          <li>New reporting requirements for ${coinName} exchanges</li>
          <li>Proposed taxation changes affecting digital asset holdings</li>
          <li>Enhanced KYC/AML procedures for ${coinName} transactions</li>
          <li>Scrutiny of environmental impact of ${coinName} mining operations</li>
        </ul>
        
        <p>Industry representatives have expressed concerns that overly restrictive regulations could hamper innovation while acknowledging the need for reasonable consumer protections.</p>
        
        <p>"Finding the right balance is crucial," stated cryptocurrency advocate Jane Roberts. "We need regulation that protects consumers without stifling the technological potential of ${coinName} and blockchain technology."</p>
        
        <p>Market analysts are closely monitoring these developments, as regulatory clarity could actually benefit ${coinName} in the long term despite potential short-term volatility.</p>
      `
    }
  ]

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
    case 'positive': return 'green'
    case 'negative': return 'red'
    default: return 'orange'
    }
  }

  const handleViewNews = (news) => {
    setSelectedNews(news)
    setShowNewsDetail(true)
  }

  const handleGoBack = () => {
    setShowNewsDetail(false)
    setSelectedNews(null)
  }

  if (showNewsDetail) {
    return <ReactCryptoNewsDetail goBack={handleGoBack} newsItem={selectedNews} />
  }

  // Enhanced WordCloud component
  const WordCloud = ({ coinName }) => {
    // Expanded words list with more diverse sizing and categories
    const words = [
      { text: coinName, value: 90, category: 'primary' },
      { text: 'DeFi', value: 72, category: 'finance' },
      { text: 'Trading', value: 65, category: 'market' },
      { text: 'Market', value: 58, category: 'market' },
      { text: 'Analysis', value: 52, category: 'research' },
      { text: 'Blockchain', value: 48, category: 'technology' },
      { text: 'Investment', value: 45, category: 'finance' },
      { text: 'Crypto', value: 42, category: 'primary' },
      { text: 'Regulation', value: 38, category: 'legal' },
      { text: 'Partnership', value: 36, category: 'business' },
      { text: 'Technology', value: 34, category: 'technology' },
      { text: 'NFT', value: 32, category: 'technology' },
      { text: 'Wallet', value: 30, category: 'technology' },
      { text: 'Mining', value: 28, category: 'technology' },
      { text: 'Security', value: 26, category: 'technology' },
      { text: 'Staking', value: 24, category: 'finance' },
      { text: 'Volatility', value: 22, category: 'market' },
      { text: 'Adoption', value: 20, category: 'business' },
      { text: 'Liquidity', value: 18, category: 'finance' },
      { text: 'Decentralized', value: 16, category: 'technology' }
    ]

    // Color mapping based on category
    const getCategoryColor = (category) => {
      const colorMap = {
        primary: 'linear-gradient(135deg, #1890ff, #003eb3)',
        finance: 'linear-gradient(135deg, #52c41a, #006400)',
        market: 'linear-gradient(135deg, #722ed1, #391085)',
        research: 'linear-gradient(135deg, #faad14, #ad6800)',
        technology: 'linear-gradient(135deg, #13c2c2, #006d75)',
        legal: 'linear-gradient(135deg, #f5222d, #a8071a)',
        business: 'linear-gradient(135deg, #eb2f96, #780650)'
      }

      return colorMap[category] || 'linear-gradient(135deg, #1890ff, #003eb3)'
    }

    // Helper to create random positions that look organic but avoid overlaps
    const getRandomPosition = (index, total) => {
      // Use golden ratio to distribute points more evenly
      const phi = (1 + Math.sqrt(5)) / 2
      const theta = 2 * Math.PI * index / phi
      const radius = 45 * Math.sqrt(index / total)

      // Convert to cartesian coordinates (centered in container)
      const x = 50 + radius * Math.cos(theta)
      const y = 50 + radius * Math.sin(theta)

      return { x, y }
    }

    return (
      <Row justify="center" style={{ marginBottom: '32px' }}>
        <Col span={24}>
          <Card
            title="News Trends"
            headStyle={{ fontSize: '18px', fontWeight: 'bold' }}
            bodyStyle={{ padding: '24px' }}
            bordered={true}
            style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}
          >
            <div
              className="word-cloud-container"
              style={{
                position: 'relative',
                height: '360px',
                width: '100%',
                background: 'radial-gradient(circle, rgba(250,250,250,1) 0%, rgba(245,245,245,1) 100%)',
                borderRadius: '8px',
                overflow: 'hidden'
              }}
            >
              {words.map((word, index) => {
                const position = getRandomPosition(index, words.length)
                const size = Math.max(14, Math.min(word.value / 3, 40))

                return (
                  <span
                    key={index}
                    style={{
                      position: 'absolute',
                      left: `${position.x}%`,
                      top: `${position.y}%`,
                      transform: 'translate(-50%, -50%)',
                      fontSize: `${size}px`,
                      padding: '4px 8px',
                      background: getCategoryColor(word.category),
                      color: 'white',
                      fontWeight: word.value > 50 ? 'bold' : 'normal',
                      borderRadius: '4px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      zIndex: Math.floor(word.value / 10),
                      textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                      display: 'inline-block',
                      textAlign: 'center',
                      userSelect: 'none',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translate(-50%, -50%) scale(1.15)'
                      e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)'
                      e.target.style.WebkitTextFillColor = 'white'
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translate(-50%, -50%) scale(1)'
                      e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)'
                      e.target.style.WebkitTextFillColor = 'transparent'
                    }}
                  >
                    {word.text}
                  </span>
                )
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px', flexWrap: 'wrap' }}>
              {['primary', 'finance', 'market', 'research', 'technology', 'legal', 'business'].map(category => (
                <div key={category} style={{ display: 'flex', alignItems: 'center', margin: '0 8px 8px 0' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    background: getCategoryColor(category),
                    borderRadius: '2px',
                    marginRight: '4px'
                  }}></div>
                  <span style={{ fontSize: '12px', color: '#666' }}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    )
  }

  return (
    <>
      <WordCloud coinName={coinName} />

      <Card style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ marginBottom: '16px' }}>
          <FileTextOutlined style={{ marginRight: '8px' }} />
          Latest News
        </Title>

        {mockNews.map((news, index) => (
          <Card
            key={index}
            size="small"
            style={{
              marginBottom: '8px',
              borderLeft: `3px solid ${getSentimentColor(news.sentiment)}`,
              cursor: 'pointer'
            }}
            hoverable
            onClick={() => handleViewNews(news)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <Space>
                  <Text strong>{news.title}</Text>
                  <Tag color={getSentimentColor(news.sentiment)}>
                    {news.sentiment.charAt(0).toUpperCase() + news.sentiment.slice(1)}
                  </Tag>
                </Space>
                <div>
                  <Text type="secondary">Source: {news.source}</Text>
                  <Text type="secondary" style={{ marginLeft: '16px' }}>{news.date}</Text>
                </div>
              </div>
              <Button
                size="small"
                icon={<EyeOutlined />}
                onClick={(e) => {
                  e.stopPropagation()
                  handleViewNews(news)
                }}
              >
                Read
              </Button>
            </div>
          </Card>
        ))}

        <Paragraph type="secondary" style={{ marginTop: '16px' }}>
          News and sentiment analysis would be integrated with a cryptocurrency news API in a production environment.
        </Paragraph>
      </Card>
    </>
  )
}

export default ReactCoinsDetailNewsSection
