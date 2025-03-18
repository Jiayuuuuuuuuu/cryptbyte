import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchCoinDetails, setSiderMenuItem, fetchCoinMarketDetails } from '../../redux_actions'
import { Layout, Tag, Skeleton, Typography, Card, Alert, Tabs, Row, Col } from 'antd'
import { contentStyle, titleStyle } from '../../styles'
import ReactCoinScores from './ReactCoinScores'
import { Line } from 'react-chartjs-2'
import { market_processed_table_keys, market_stat_keys } from '../../constants'
import chartOptions from '../../ChartConfig'
import ReactSider from '../Navigation/ReactSider'
import ReactCoinCommunityStats from './ReactCoinCommunityStats'
import ReactCoinDeveloperStats from './ReactCoinDeveloperStats'
import ReactCoinMarketStats from './ReactCoinMarketStats'
import ReactCoinMarketDetailedStats from './ReactCoinMarketDetailedStats'
import ReactCoinDetailSummary from './ReactCoinDetailSummary'
import { RiseOutlined, InfoCircleOutlined, TeamOutlined, CodeOutlined, DollarOutlined, FileTextOutlined } from '@ant-design/icons'

const { Content } = Layout
const { Title, Paragraph, Text } = Typography
const { TabPane } = Tabs

class ReactCoinsDetail extends Component {
  componentDidMount () {
    const { coinId } = this.props.match.params
    this.props.fetchCoinDetails(coinId)
    this.props.fetchCoinMarketDetails(coinId)
    this.props.setSiderMenuItem('coin-detail')
  }

  // helper function to generate chart data from props
  getChartData = (loading, data, key, title, colour) => {
    return {
      labels: !loading ? data[key]?.map(item => new Date(item[0]).toLocaleString()) : [],
      datasets: [
        {
          label: title,
          data: !loading ? data[key]?.map(item => item[1]) : [],
          backgroundColor: colour,
          borderColor: colour,
          borderWidth: 2,
          pointRadius: 0,
          fill: false
        }
      ]
    }
  }

  // Simple analysis function for price trends
  analyzePriceTrend = (priceData) => {
    if (!priceData || !priceData.length) return null
    const prices = priceData.map(item => item[1])
    const firstPrice = prices[0]
    const lastPrice = prices[prices.length - 1]
    const change = ((lastPrice - firstPrice) / firstPrice) * 100
    const volatility = this.calculateVolatility(prices)
    let trend, recommendation, color
    if (change > 5) {
      trend = 'Strongly Bullish'
      recommendation = 'Consider buying with caution. The price is in an uptrend, but be aware of potential pullbacks.'
      color = 'green'
    } else if (change > 1) {
      trend = 'Moderately Bullish'
      recommendation = 'The price is showing positive momentum, though the uptrend is modest.'
      color = 'green'
    } else if (change >= -1) {
      trend = 'Neutral'
      recommendation = 'The price is moving sideways, which could be a consolidation period.'
      color = 'orange'
    } else if (change >= -5) {
      trend = 'Moderately Bearish'
      recommendation = 'The price is showing some weakness. Consider waiting for stabilization.'
      color = 'red'
    } else {
      trend = 'Strongly Bearish'
      recommendation = 'The price is in a downtrend. Consider waiting for reversal signals before entering.'
      color = 'red'
    }
    return {
      trend,
      change: change.toFixed(2),
      volatility: volatility.toFixed(2),
      recommendation,
      color
    }
  }

  calculateVolatility = (prices) => {
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

  render () {
    const finalColumns = [
      {
        title: 'currency',
        key: 'currency',
        dataIndex: 'currency',
        render: item => <Tag color="purple">{item}</Tag>
      }, ...market_processed_table_keys.map(item => ({ title: item, key: item, dataIndex: item }))
    ]

    const { coingecko_rank } = this.props.data
    const { market_cap_rank } = this.props.data
    const { developer_score } = this.props.data
    const { community_score } = this.props.data
    const { liquidity_score } = this.props.data
    const { coingecko_score } = this.props.data

    const { community_data, developer_data } = this.props.data

    const { market_data, market_data_processed } = this.props.data
    const { last_updated, name, image, description } = this.props.data

    const loading = !(Object.keys(this.props.data).length > 0)
    const coinMarketKeys = Object.keys(this.props.chart_data)
    const pricesLoading = !coinMarketKeys.includes('prices')
    const marketCapsLoading = !coinMarketKeys.includes('market_caps')
    const totalVolumesLoading = !coinMarketKeys.includes('total_volumes')

    // Generate chart data for Chart.js
    const { chart_data } = this.props
    const chartPricesData = this.getChartData(pricesLoading,
      chart_data,
      'prices',
      'Price (USD)',
      'rgba(55, 144, 255, 0.7)')
    const chartMarketCapsData = this.getChartData(marketCapsLoading,
      chart_data,
      'market_caps',
      'Market Cap (USD)',
      'rgba(114, 17, 198, 0.7)')
    const chartTotalVolumesData = this.getChartData(totalVolumesLoading,
      chart_data,
      'total_volumes',
      'Trading Volume (USD)',
      'rgba(26, 201, 166, 0.7)')
    // Get price analysis
    const priceAnalysis = !pricesLoading && chart_data.prices
      ? this.analyzePriceTrend(chart_data.prices)
      : null

    // Mock news data (in a real app, you would fetch this from a news API)
    const mockNews = [
      {
        title: `${name} Shows Strong Momentum in DeFi Applications`,
        date: '2025-03-17',
        source: 'CryptoDaily'
      },
      {
        title: `New Partnership Announced for ${name}`,
        date: '2025-03-15',
        source: 'BlockchainInsider'
      },
      {
        title: `${name} Technical Analysis: Support and Resistance Levels`,
        date: '2025-03-14',
        source: 'TradingView'
      }
    ]

    return (
      <React.Fragment>
        <ReactSider/>
        <Layout style={{ padding: '1rem' }}>
          <Content style={contentStyle}>
            {
              loading
                ? <React.Fragment>
                  <Skeleton active/>
                  <Skeleton active/>
                  <Skeleton active/>
                  <Skeleton active/>
                </React.Fragment>
                : <React.Fragment>

                  <ReactCoinDetailSummary
                    name={ name }
                    last_updated = { last_updated }
                    image={ image }/>
                  {/* Price Chart Card - Now at the top */}
                  <Card style={{ marginBottom: '24px' }}>
                    <Title level={3} style={titleStyle}>Price Chart (7 Days)</Title>
                    {pricesLoading
                      ? (<Skeleton active />)
                      : (
                        <Line data={chartPricesData} options={chartOptions} height={300} />
                      )}
                  </Card>
                  {/* Price Analysis Card - New Feature */}
                  {priceAnalysis && (
                    <Card style={{ marginBottom: '24px' }}>
                      <Title level={3} style={titleStyle}>
                        <RiseOutlined style={{ marginRight: '8px' }} />
                        Price Analysis
                      </Title>
                      <Alert
                        message={`7-Day Trend: ${priceAnalysis.trend}`}
                        description={priceAnalysis.recommendation}
                        type={priceAnalysis.color === 'red' ? 'error' : priceAnalysis.color === 'orange' ? 'warning' : 'success'}
                        showIcon
                        style={{ marginBottom: '16px' }}
                      />
                      <Row gutter={16}>
                        <Col span={12}>
                          <Card size="small" title="Price Change (7d)">
                            <Text style={{ color: parseFloat(priceAnalysis.change) >= 0 ? 'green' : 'red', fontSize: '16px', fontWeight: 'bold' }}>
                              {priceAnalysis.change}%
                            </Text>
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card size="small" title="Volatility">
                            <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>
                              {priceAnalysis.volatility}%
                            </Text>
                          </Card>
                        </Col>
                      </Row>
                    </Card>
                  )}
                  {/* Recent News Card - New Feature */}
                  <Card style={{ marginBottom: '24px' }}>
                    <Title level={3} style={titleStyle}>
                      <FileTextOutlined style={{ marginRight: '8px' }} />
                      Recent News
                    </Title>
                    {mockNews.map((news, index) => (
                      <Card key={index} size="small" style={{ marginBottom: '8px' }} hoverable>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Text strong>{news.title}</Text>
                          <Text type="secondary">{news.date}</Text>
                        </div>
                        <Text type="secondary">Source: {news.source}</Text>
                      </Card>
                    ))}
                    <Paragraph type="secondary" style={{ marginTop: '16px' }}>
                      Note: In a production app, news would be fetched from a cryptocurrency news API.
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
                          coingecko_score={coingecko_score}/>
                      </Card>
                    </TabPane>
                    <TabPane
                      tab={<span><DollarOutlined />Market Data</span>}
                      key="market"
                    >
                      <ReactCoinMarketStats
                        market_data={market_data}
                        market_stat_keys={market_stat_keys}/>

                      <ReactCoinMarketDetailedStats
                        data={market_data_processed}
                        columns={finalColumns}/>
                      <Title level={4} style={titleStyle}>Market Cap History</Title>
                      <Line data={chartMarketCapsData} options={chartOptions} height={250} />
                      <Title level={4} style={titleStyle}>Volume History</Title>
                      <Line data={chartTotalVolumesData} options={chartOptions} height={250} />
                    </TabPane>
                    <TabPane
                      tab={<span><TeamOutlined />Community</span>}
                      key="community"
                    >
                      <ReactCoinCommunityStats data={community_data}/>
                    </TabPane>
                    <TabPane
                      tab={<span><CodeOutlined />Development</span>}
                      key="development"
                    >
                      <ReactCoinDeveloperStats data={developer_data}/>
                    </TabPane>
                  </Tabs>
                </React.Fragment>
            }
          </Content>
        </Layout>
      </React.Fragment>
    )
  }
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
