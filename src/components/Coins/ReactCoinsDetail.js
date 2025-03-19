import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { fetchCoinDetails, setSiderMenuItem, fetchCoinMarketDetails } from '../../redux_actions'
import { Layout, Tag, Skeleton, Typography, Card, Alert, Tabs, Row, Col, Tooltip, Statistic, Space, Divider, Button } from 'antd'
import { contentStyle, titleStyle } from '../../styles'
import ReactCoinScores from './ReactCoinScores'
import { Line } from 'react-chartjs-2'
import { market_processed_table_keys, market_stat_keys } from '../../constants'
import ReactCoinCommunityStats from './ReactCoinCommunityStats'
import ReactCoinDeveloperStats from './ReactCoinDeveloperStats'
import ReactCoinMarketStats from './ReactCoinMarketStats'
import ReactCoinMarketDetailedStats from './ReactCoinMarketDetailedStats'
import ReactCoinDetailSummary from './ReactCoinDetailSummary'
import {
  RiseOutlined,
  InfoCircleOutlined,
  TeamOutlined,
  CodeOutlined,
  DollarOutlined,
  FileTextOutlined,
  BarChartOutlined,
  LineChartOutlined,
  FireOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeOutlined
} from '@ant-design/icons'

const { Content } = Layout
const { Title, Paragraph, Text } = Typography
const { TabPane } = Tabs

// Create chart components
const PriceChart = ({ data, loading, chartOptions, timeFrame }) => {
  if (loading) return <Skeleton active />

  return (
    <Line
      data={data}
      options={{
        ...chartOptions,
        plugins: {
          ...chartOptions.plugins,
          title: {
            ...chartOptions.plugins?.title,
            text: `Price History (${timeFrame})`
          },
          tooltip: {
            ...chartOptions.plugins?.tooltip,
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || ''
                if (label) {
                  label += ': '
                }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6
                  }).format(context.parsed.y)
                }
                return label
              }
            }
          }
        }
      }}
      height={300}
    />
  )
}

const ReactCoinsDetail = (props) => {
  const {
    match,
    fetchCoinDetails,
    fetchCoinMarketDetails,
    setSiderMenuItem,
    data,
    chart_data
  } = props

  const [timeFrame, setTimeFrame] = useState('7d')
  const [selectedChartType, setSelectedChartType] = useState('price')

  useEffect(() => {
    const { coinId } = match.params
    fetchCoinDetails(coinId)
    fetchCoinMarketDetails(coinId)
    setSiderMenuItem('coin-detail')
  }, [match.params, fetchCoinDetails, fetchCoinMarketDetails, setSiderMenuItem])

  // Helper function to format chart data with appropriate date filtering
  const getChartData = (loading, data, key, title, colour, timeFrame) => {
    if (loading || !data || !data[key]) {
      return {
        labels: [],
        datasets: [{
          label: title,
          data: [],
          backgroundColor: colour,
          borderColor: colour,
          borderWidth: 2,
          pointRadius: 0,
          fill: false
        }]
      }
    }

    // Filter data based on timeFrame
    const now = new Date()
    const filterDate = new Date()

    switch (timeFrame) {
    case '24h':
      filterDate.setDate(now.getDate() - 1)
      break
    case '7d':
      filterDate.setDate(now.getDate() - 7)
      break
    case '30d':
      filterDate.setDate(now.getDate() - 30)
      break
    case '90d':
      filterDate.setDate(now.getDate() - 90)
      break
    case '1y':
      filterDate.setFullYear(now.getFullYear() - 1)
      break
    default:
      filterDate.setDate(now.getDate() - 7)
    }

    const filteredData = data[key].filter(item => new Date(item[0]) >= filterDate)

    return {
      labels: filteredData.map(item => {
        const date = new Date(item[0])
        // Format based on timeframe
        if (timeFrame === '24h') {
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        } else if (timeFrame === '7d') {
          return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
        } else {
          return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
        }
      }),
      datasets: [{
        label: title,
        data: filteredData.map(item => item[1]),
        backgroundColor: colour,
        borderColor: colour,
        borderWidth: 2,
        pointRadius: timeFrame === '24h' ? 2 : 0,
        pointHoverRadius: 5,
        fill: false,
        tension: 0.1 // Slightly smooth the line
      }]
    }
  }

  // Enhanced price trend analysis
  const analyzePriceTrend = (priceData) => {
    if (!priceData || !priceData.length) return null

    const prices = priceData.map(item => item[1])
    const firstPrice = prices[0]
    const lastPrice = prices[prices.length - 1]
    const change = ((lastPrice - firstPrice) / firstPrice) * 100
    const volatility = calculateVolatility(prices)

    // Calculate moving averages for technical indicators
    const ma7 = calculateMovingAverage(prices, 7)
    const ma20 = calculateMovingAverage(prices, 20)

    // Enhanced trend identification using moving averages
    let trend, recommendation, color, strength

    if (change > 10) {
      trend = 'Strongly Bullish'
      strength = 'High'
      recommendation = 'Consider taking partial profits. The strong uptrend might experience a pullback soon.'
      color = 'green'
    } else if (change > 5) {
      trend = 'Bullish'
      strength = 'Medium'
      recommendation = 'Consider buying with caution. The price is in an uptrend, but be aware of potential pullbacks.'
      color = 'green'
    } else if (change > 1) {
      trend = 'Moderately Bullish'
      strength = 'Low'
      recommendation = 'The price is showing positive momentum, though the uptrend is modest.'
      color = 'green'
    } else if (change >= -1) {
      trend = 'Neutral'
      strength = 'N/A'
      recommendation = 'The price is moving sideways, which could be a consolidation period.'
      color = 'orange'
    } else if (change >= -5) {
      trend = 'Moderately Bearish'
      strength = 'Low'
      recommendation = 'The price is showing some weakness. Consider waiting for stabilization.'
      color = 'red'
    } else if (change >= -10) {
      trend = 'Bearish'
      strength = 'Medium'
      recommendation = 'The price is in a downtrend. Consider waiting for reversal signals before entering.'
      color = 'red'
    } else {
      trend = 'Strongly Bearish'
      strength = 'High'
      recommendation = 'The market is showing significant weakness. Look for strong reversal patterns before considering entry.'
      color = 'red'
    }

    // Technical signals
    const signals = []
    if (ma7 > ma20) {
      signals.push('Golden Cross (Short-term MA above Long-term MA): Bullish')
    } else if (ma7 < ma20) {
      signals.push('Death Cross (Short-term MA below Long-term MA): Bearish')
    }

    // Calculate resistance and support
    const supportLevel = Math.min(...prices.slice(-20)) * 0.98
    const resistanceLevel = Math.max(...prices.slice(-20)) * 1.02

    return {
      trend,
      strength,
      change: change.toFixed(2),
      volatility: volatility.toFixed(2),
      recommendation,
      color,
      signals,
      supportLevel: supportLevel.toFixed(2),
      resistanceLevel: resistanceLevel.toFixed(2),
      movingAverages: {
        ma7: ma7.toFixed(2),
        ma20: ma20.toFixed(2)
      }
    }
  }

  const calculateVolatility = (prices) => {
    if (!prices || prices.length < 2) return 0

    let sum = 0
    const changes = []

    for (let i = 1; i < prices.length; i++) {
      const percentChange = ((prices[i] - prices[i - 1]) / prices[i - 1]) * 100
      changes.push(percentChange)
      sum += percentChange
    }

    const mean = sum / changes.length
    let variance = 0

    for (let i = 0; i < changes.length; i++) {
      variance += Math.pow(changes[i] - mean, 2)
    }

    return Math.sqrt(variance / changes.length)
  }

  const calculateMovingAverage = (data, period) => {
    if (!data || data.length < period) return 0

    let sum = 0
    for (let i = data.length - period; i < data.length; i++) {
      sum += data[i]
    }

    return sum / period
  }

  // Create enhanced chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 15,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        padding: 10,
        displayColors: false
      }
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45
        },
        grid: {
          display: false
        }
      },
      y: {
        ticks: {
          callback: function (value) {
            return '$' + value.toLocaleString()
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    }
  }

  const loading = !(Object.keys(data).length > 0)
  const coinMarketKeys = Object.keys(chart_data)
  const pricesLoading = !coinMarketKeys.includes('prices')
  const marketCapsLoading = !coinMarketKeys.includes('market_caps')
  const totalVolumesLoading = !coinMarketKeys.includes('total_volumes')

  // Generate chart data for Chart.js with timeFrame
  const chartPricesData = getChartData(
    pricesLoading,
    chart_data,
    'prices',
    'Price (USD)',
    'rgba(55, 144, 255, 0.7)',
    timeFrame
  )

  const chartMarketCapsData = getChartData(
    marketCapsLoading,
    chart_data,
    'market_caps',
    'Market Cap (USD)',
    'rgba(114, 17, 198, 0.7)',
    timeFrame
  )

  const chartTotalVolumesData = getChartData(
    totalVolumesLoading,
    chart_data,
    'total_volumes',
    'Trading Volume (USD)',
    'rgba(26, 201, 166, 0.7)',
    timeFrame
  )

  // Get price analysis
  const priceAnalysis = !pricesLoading && chart_data.prices
    ? analyzePriceTrend(chart_data.prices)
    : null

  // Mock trading signal logic - would be expanded in a real app
  const getTradingSignals = (priceAnalysis) => {
    if (!priceAnalysis) return []

    const signals = []
    if (parseFloat(priceAnalysis.change) > 5 && priceAnalysis.volatility < 3) {
      signals.push({
        name: 'Momentum Buy',
        type: 'buy',
        strength: 'Medium',
        description: 'Strong uptrend with relatively low volatility'
      })
    }

    if (parseFloat(priceAnalysis.change) < -5) {
      signals.push({
        name: 'Oversold Bounce',
        type: 'watch',
        strength: 'Low',
        description: 'Price dropped significantly, watch for reversal signals'
      })
    }

    if (parseFloat(priceAnalysis.volatility) > 5) {
      signals.push({
        name: 'Volatility Warning',
        type: 'caution',
        strength: 'High',
        description: 'Increased volatility detected, consider reducing position size'
      })
    }

    return signals
  }

  const tradingSignals = priceAnalysis ? getTradingSignals(priceAnalysis) : []

  // Financial news with sentiment (mock data)
  const mockNews = [
    {
      title: `${data.name} Shows Strong Momentum in DeFi Applications`,
      date: '2025-03-17',
      source: 'CryptoDaily',
      sentiment: 'positive'
    },
    {
      title: `New Partnership Announced for ${data.name}`,
      date: '2025-03-15',
      source: 'BlockchainInsider',
      sentiment: 'positive'
    },
    {
      title: `${data.name} Technical Analysis: Support and Resistance Levels`,
      date: '2025-03-14',
      source: 'TradingView',
      sentiment: 'neutral'
    },
    {
      title: `Market Concerns: ${data.name} Facing Regulatory Scrutiny`,
      date: '2025-03-12',
      source: 'CoinDesk',
      sentiment: 'negative'
    }
  ]

  // Trading volume analysis
  const getVolumeAnalysis = () => {
    if (totalVolumesLoading || !chart_data.total_volumes) return null

    const volumes = chart_data.total_volumes.map(item => item[1])
    const avgVolume = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length
    const latestVolume = volumes[volumes.length - 1]
    const volumeChange = ((latestVolume - avgVolume) / avgVolume) * 100

    let volumeTrend, volumeDescription
    if (volumeChange > 50) {
      volumeTrend = 'Significantly Higher'
      volumeDescription = 'Unusual trading activity detected. Could indicate strong market interest or news impact.'
    } else if (volumeChange > 20) {
      volumeTrend = 'Higher than Average'
      volumeDescription = 'Increased trading activity compared to average. May indicate growing interest.'
    } else if (volumeChange >= -20) {
      volumeTrend = 'Normal Range'
      volumeDescription = 'Trading volume is within normal range.'
    } else {
      volumeTrend = 'Lower than Average'
      volumeDescription = 'Below average trading activity. May indicate decreasing market interest.'
    }

    return {
      trend: volumeTrend,
      change: volumeChange.toFixed(2),
      description: volumeDescription
    }
  }

  const volumeAnalysis = getVolumeAnalysis()

  const renderActiveChart = () => {
    switch (selectedChartType) {
    case 'price':
      return <PriceChart data={chartPricesData} loading={pricesLoading} chartOptions={chartOptions} timeFrame={timeFrame} />
    case 'market_cap':
      return <PriceChart data={chartMarketCapsData} loading={marketCapsLoading} chartOptions={chartOptions} timeFrame={timeFrame} />
    case 'volume':
      return <PriceChart data={chartTotalVolumesData} loading={totalVolumesLoading} chartOptions={chartOptions} timeFrame={timeFrame} />
    default:
      return <PriceChart data={chartPricesData} loading={pricesLoading} chartOptions={chartOptions} timeFrame={timeFrame} />
    }
  }

  const timeFrameOptions = [
    { label: '24h', value: '24h' },
    { label: '7d', value: '7d' },
    { label: '30d', value: '30d' },
    { label: '90d', value: '90d' },
    { label: '1y', value: '1y' }
  ]

  const chartTypeOptions = [
    { icon: <LineChartOutlined />, label: 'Price', value: 'price' },
    { icon: <BarChartOutlined />, label: 'Market Cap', value: 'market_cap' },
    { icon: <BarChartOutlined />, label: 'Volume', value: 'volume' }
  ]

  const finalColumns = [
    {
      title: 'currency',
      key: 'currency',
      dataIndex: 'currency',
      render: item => <Tag color="purple">{item}</Tag>
    },
    ...market_processed_table_keys.map(item => ({ title: item, key: item, dataIndex: item }))
  ]

  const {
    coingecko_rank,
    market_cap_rank,
    developer_score,
    community_score,
    liquidity_score,
    coingecko_score
  } = data

  const { community_data, developer_data } = data
  const { market_data, market_data_processed } = data
  const { last_updated, name, image, description } = data

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
    case 'positive': return 'green'
    case 'negative': return 'red'
    default: return 'orange'
    }
  }

  const getSignalTypeColor = (type) => {
    switch (type) {
    case 'buy': return 'green'
    case 'sell': return 'red'
    case 'watch': return 'blue'
    default: return 'orange'
    }
  }

  return (
    <Layout style={{ padding: '1rem' }}>
      <Content style={contentStyle}>
        {loading
          ? (
            <React.Fragment>
              <Skeleton active />
              <Skeleton active />
              <Skeleton active />
              <Skeleton active />
            </React.Fragment>
          )
          : (
            <React.Fragment>
              <ReactCoinDetailSummary
                name={name}
                last_updated={last_updated}
                image={image}
              />

              {/* Enhanced Chart Card with filters */}
              <Card className="chart-card" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <Title level={3} style={titleStyle}>
                    {selectedChartType === 'price'
                      ? 'Price Chart'
                      : selectedChartType === 'market_cap'
                        ? 'Market Cap Chart'
                        : 'Volume Chart'}
                  </Title>
                  <Space>
                    <Space size="small">
                      {chartTypeOptions.map(option => (
                        <Tooltip key={option.value} title={option.label}>
                          <Button
                            type={selectedChartType === option.value ? 'primary' : 'default'}
                            icon={option.icon}
                            onClick={() => setSelectedChartType(option.value)}
                            shape="circle"
                          />
                        </Tooltip>
                      ))}
                    </Space>
                    <Divider type="vertical" />
                    <Space size="small">
                      {timeFrameOptions.map(option => (
                        <Button
                          key={option.value}
                          type={timeFrame === option.value ? 'primary' : 'default'}
                          onClick={() => setTimeFrame(option.value)}
                          size="small"
                        >
                          {option.label}
                        </Button>
                      ))}
                    </Space>
                  </Space>
                </div>
                <div style={{ height: '350px' }}>
                  {renderActiveChart()}
                </div>
              </Card>

              {/* Enhanced Price Analysis Card */}
              {priceAnalysis && (
                <Card style={{ marginBottom: '24px' }}>
                  <Title level={3} style={titleStyle}>
                    <RiseOutlined style={{ marginRight: '8px' }} />
                  Price Analysis & Trading Signals
                  </Title>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                      <Alert
                        message={
                          <Space>
                            <span>{`${timeFrame} Trend: ${priceAnalysis.trend}`}</span>
                            <Tag color={priceAnalysis.color}>
                              {priceAnalysis.strength} Strength
                            </Tag>
                          </Space>
                        }
                        description={priceAnalysis.recommendation}
                        type={priceAnalysis.color === 'red' ? 'error' : priceAnalysis.color === 'orange' ? 'warning' : 'success'}
                        showIcon
                        style={{ marginBottom: '16px' }}
                      />
                      <Row gutter={16}>
                        <Col span={12}>
                          <Statistic
                            title="Price Change"
                            value={priceAnalysis.change}
                            precision={2}
                            valueStyle={{ color: parseFloat(priceAnalysis.change) >= 0 ? 'green' : 'red' }}
                            prefix={parseFloat(priceAnalysis.change) >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                            suffix="%"
                          />
                        </Col>
                        <Col span={12}>
                          <Statistic
                            title="Volatility"
                            value={priceAnalysis.volatility}
                            precision={2}
                            valueStyle={{ color: parseFloat(priceAnalysis.volatility) > 5 ? 'orange' : 'inherit' }}
                            suffix="%"
                          />
                        </Col>
                      </Row>
                      <Divider />
                      <Title level={5}>Key Levels</Title>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Statistic
                            title="Support"
                            value={`$${priceAnalysis.supportLevel}`}
                            valueStyle={{ fontSize: '14px' }}
                          />
                        </Col>
                        <Col span={12}>
                          <Statistic
                            title="Resistance"
                            value={`$${priceAnalysis.resistanceLevel}`}
                            valueStyle={{ fontSize: '14px' }}
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col xs={24} md={12}>
                      <Card title="Trading Signals" size="small">
                        {tradingSignals.length > 0
                          ? (
                            tradingSignals.map((signal, index) => (
                              <div key={index} style={{ marginBottom: '8px' }}>
                                <Space>
                                  <Tag color={getSignalTypeColor(signal.type)}>{signal.type.toUpperCase()}</Tag>
                                  <Text strong>{signal.name}</Text>
                                  <Tag>{signal.strength} Strength</Tag>
                                </Space>
                                <Paragraph type="secondary" style={{ marginTop: '4px', marginBottom: '4px' }}>
                                  {signal.description}
                                </Paragraph>
                                {index < tradingSignals.length - 1 && <Divider style={{ margin: '8px 0' }} />}
                              </div>
                            ))
                          )
                          : (
                            <Text type="secondary">No active trading signals detected</Text>
                          )}
                      </Card>
                      {volumeAnalysis && (
                        <Card title="Volume Analysis" size="small" style={{ marginTop: '16px' }}>
                          <Space direction="vertical">
                            <div>
                              <Text strong>Volume Trend: </Text>
                              <Text>{volumeAnalysis.trend}</Text>
                              <Tag color={parseFloat(volumeAnalysis.change) > 20 ? 'green' : parseFloat(volumeAnalysis.change) < -20 ? 'red' : 'blue'} style={{ marginLeft: '8px' }}>
                                {volumeAnalysis.change}%
                              </Tag>
                            </div>
                            <Text type="secondary">{volumeAnalysis.description}</Text>
                          </Space>
                        </Card>
                      )}
                    </Col>
                  </Row>
                </Card>
              )}

              {/* Enhanced News Card */}
              <Card style={{ marginBottom: '24px' }}>
                <Title level={3} style={titleStyle}>
                  <FileTextOutlined style={{ marginRight: '8px' }} />
                Market News & Sentiment
                </Title>
                {mockNews.map((news, index) => (
                  <Card
                    key={index}
                    size="small"
                    style={{
                      marginBottom: '8px',
                      borderLeft: `3px solid ${getSentimentColor(news.sentiment)}`
                    }}
                    hoverable
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
                      <Button size="small" icon={<EyeOutlined />}>Read</Button>
                    </div>
                  </Card>
                ))}
                <Paragraph type="secondary" style={{ marginTop: '16px' }}>
                News and sentiment analysis would be integrated with a cryptocurrency news API in a production environment.
                </Paragraph>
              </Card>

              {/* Tabs for detailed information */}
              <Tabs defaultActiveKey="overview" style={{ marginBottom: '24px' }}>
                <TabPane
                  tab={<span><InfoCircleOutlined />Overview</span>}
                  key="overview"
                >
                  <Card>
                    <Title level={4}>About {name}</Title>
                    <div dangerouslySetInnerHTML={{ __html: description?.en || 'No description available.' }} />
                    <ReactCoinScores
                      coingecko_rank={coingecko_rank}
                      market_cap_rank={market_cap_rank}
                      developer_score={developer_score}
                      community_score={community_score}
                      liquidity_score={liquidity_score}
                      coingecko_score={coingecko_score}
                    />
                  </Card>
                </TabPane>
                <TabPane
                  tab={<span><DollarOutlined />Market Data</span>}
                  key="market"
                >
                  <ReactCoinMarketStats
                    market_data={market_data}
                    market_stat_keys={market_stat_keys}
                  />

                  <ReactCoinMarketDetailedStats
                    data={market_data_processed}
                    columns={finalColumns}
                  />
                  <Title level={4} style={titleStyle}>Market Cap History</Title>
                  <div style={{ height: '250px' }}>
                    <Line data={chartMarketCapsData} options={chartOptions} />
                  </div>
                  <Title level={4} style={titleStyle}>Volume History</Title>
                  <div style={{ height: '250px' }}>
                    <Line data={chartTotalVolumesData} options={chartOptions} />
                  </div>
                </TabPane>
                <TabPane
                  tab={<span><TeamOutlined />Community</span>}
                  key="community"
                >
                  <ReactCoinCommunityStats data={community_data} />
                </TabPane>
                <TabPane
                  tab={<span><CodeOutlined />Development</span>}
                  key="development"
                >
                  <ReactCoinDeveloperStats data={developer_data} />
                </TabPane>
              </Tabs>
            </React.Fragment>
          )}
      </Content>
    </Layout>
  )
}

const mapStateToProps = (state) => {
  return {
    data: state.coin_details,
    chart_data: state.coin_market_details[state.coin_details.id] || {}
  }
}

const mapActionsToProps = {
  fetchCoinDetails,
  fetchCoinMarketDetails,
  setSiderMenuItem
}

export default connect(mapStateToProps, mapActionsToProps)(ReactCoinsDetail)
