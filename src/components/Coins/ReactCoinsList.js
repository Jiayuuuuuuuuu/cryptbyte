import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCoins, setSiderMenuItem, addToWatchlist, removeFromWatchlist } from '../../redux_actions'
import { Layout, Table, Typography, Button, Tag, Spin, message, Input, Select, Tooltip, Card, Statistic, Row, Col, Badge } from 'antd'
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  StarOutlined,
  StarFilled,
  MinusOutlined,
  SearchOutlined,
  RiseOutlined,
  FallOutlined,
  DashboardOutlined,
  ReloadOutlined,
  DollarOutlined,
  InfoCircleOutlined
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { contentStyle, tableStyle } from '../../styles'

const { Content } = Layout
const { Title, Paragraph, Text } = Typography
const { Option } = Select

const ReactCoinsList = () => {
  const dispatch = useDispatch()
  const coins = useSelector(state => state.coins.data)
  const loading = useSelector(state => state.coins.loading)
  const error = useSelector(state => state.coins.error)

  // Get the watchlist array from the nested state structure
  const watchlistState = useSelector(state => state.watchlist)
  // Ensure we have a valid array, even if empty
  const watchlist = (watchlistState && Array.isArray(watchlistState.watchlist))
    ? watchlistState.watchlist
    : []

  const [previousPrices, setPreviousPrices] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [sortKey, setSortKey] = useState('current_price')
  const [sortOrder, setSortOrder] = useState('descend')
  const [refreshLoading, setRefreshLoading] = useState(false)
  const [hoveredRow, setHoveredRow] = useState(null)
  const [timeRange, setTimeRange] = useState('24h')
  const [viewMode, setViewMode] = useState('table')

  useEffect(() => {
    fetchCoinData()

    const interval = setInterval(() => {
      fetchCoinData()
    }, 30000)

    return () => clearInterval(interval)
  }, [dispatch])

  const fetchCoinData = () => {
    setRefreshLoading(true)
    dispatch(fetchCoins()).catch(err => {
      console.error('Error fetching coin data:', err)
      message.error('Failed to fetch coin data. Please try again later.')
    }).finally(() => {
      setRefreshLoading(false)
    })
  }

  useEffect(() => {
    if (Array.isArray(coins) && coins.length > 0) {
      const prices = coins.reduce((acc, coin) => {
        acc[coin.id] = coin.current_price
        return acc
      }, {})
      setPreviousPrices(prices)
    }
  }, [coins])

  const isInWatchlist = (coinId) => {
    // First check if watchlist is a valid array
    if (!Array.isArray(watchlist)) {
      return false
    }
    return watchlist.some(coin => coin && typeof coin === 'object' && coin.id === coinId)
  }

  const handleWatchlistToggle = (coin) => {
    try {
      if (isInWatchlist(coin.id)) {
        // Remove from watchlist
        dispatch(removeFromWatchlist(coin.id))
        message.success(`${coin.name} removed from watchlist`)
      } else {
        // Add to watchlist
        dispatch(addToWatchlist({ ...coin })) // Create a clean copy of the coin object
        message.success(`${coin.name} added to watchlist`)
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error)
      message.error('Failed to update watchlist')
    }
  }

  const getPriceChangeIndicator = (coin) => {
    const previousPrice = previousPrices[coin.id] || coin.current_price

    if (coin.current_price > previousPrice) {
      return <span style={{ color: 'green' }}><ArrowUpOutlined /> {coin.current_price} USD</span>
    } else if (coin.current_price < previousPrice) {
      return <span style={{ color: 'red' }}><ArrowDownOutlined /> {coin.current_price} USD</span>
    } else {
      // Equal price case
      return <span><MinusOutlined /> {coin.current_price} USD</span>
    }
  }

  // Trading signal generator function
  const getTradingSignal = (coin) => {
    // Simple moving average crossover strategy for demonstration
    // In a real scenario, you'd implement more sophisticated algorithms or fetch from an API

    // Using price change percentages for different time periods to generate signals
    const priceChange24h = coin.price_change_percentage_24h || 0
    const priceChange7d = coin.price_change_percentage_7d_in_currency || 0 // You'd need to add this data field
    const volume = coin.total_volume || 0
    const marketCap = coin.market_cap || 0

    // Simulate some technical indicators
    const rsi = Math.min(100, Math.max(0, 50 + priceChange24h * 2 + Math.random() * 10))
    const macdSignal = priceChange24h > priceChange7d ? 1 : -1

    // Volume-based indicators
    const volumeTrend = volume > 1000000 ? 1 : 0

    // Market cap consideration
    const marketCapFactor = marketCap > 1000000000 ? 1 : 0

    // Combine factors for a final signal score
    let signalScore = 0
    signalScore += priceChange24h > 5 ? 2 : priceChange24h > 2 ? 1 : priceChange24h < -5 ? -2 : priceChange24h < -2 ? -1 : 0
    signalScore += rsi > 70 ? -1 : rsi < 30 ? 1 : 0
    signalScore += macdSignal
    signalScore += volumeTrend
    signalScore += marketCapFactor

    // Return signal based on score
    if (signalScore >= 3) {
      return { signal: 'STRONG BUY', color: 'green', icon: <RiseOutlined />, score: signalScore }
    } else if (signalScore === 2) {
      return { signal: 'BUY', color: 'lightgreen', icon: <ArrowUpOutlined />, score: signalScore }
    } else if (signalScore === 1) {
      return { signal: 'WEAK BUY', color: 'palegreen', icon: <ArrowUpOutlined />, score: signalScore }
    } else if (signalScore === 0) {
      return { signal: 'NEUTRAL', color: 'gray', icon: <MinusOutlined />, score: signalScore }
    } else if (signalScore === -1) {
      return { signal: 'WEAK SELL', color: 'pink', icon: <ArrowDownOutlined />, score: signalScore }
    } else if (signalScore === -2) {
      return { signal: 'SELL', color: 'lightcoral', icon: <ArrowDownOutlined />, score: signalScore }
    } else {
      return { signal: 'STRONG SELL', color: 'red', icon: <FallOutlined />, score: signalScore }
    }
  }

  // Generate trading signal tooltip content
  const getTradingSignalTooltip = (coin) => {
    const priceChange24h = coin.price_change_percentage_24h || 0
    const rsi = Math.min(100, Math.max(0, 50 + priceChange24h * 2 + Math.random() * 10))

    return (
      <div>
        <p><strong>Trading Indicators:</strong></p>
        <p>RSI (14): {rsi.toFixed(2)}</p>
        <p>24h Change: {priceChange24h.toFixed(2)}%</p>
        <p>Volume: {(coin.total_volume || 0).toLocaleString()} USD</p>
        <p>Market Cap: {(coin.market_cap || 0).toLocaleString()} USD</p>
        <p><em>Signal strength: {getTradingSignal(coin).score}</em></p>
      </div>
    )
  }

  if (error) {
    return (
      <React.Fragment>
        <Layout style={{ padding: '1rem' }}>
          <Content style={contentStyle}>
            <div style={{ textAlign: 'center', margin: '50px 0' }}>
              <Title level={3} style={{ color: 'red' }}>Error loading coin data</Title>
              <Paragraph>There was a problem fetching cryptocurrency data.</Paragraph>
              <Button type="primary" onClick={fetchCoinData}>Try Again</Button>
            </div>
          </Content>
        </Layout>
      </React.Fragment>
    )
  }

  if (loading || !Array.isArray(coins) || !coins.length) {
    return (
      <React.Fragment>
        <Layout style={{ padding: '1rem' }}>
          <Content style={contentStyle}>
            <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />
            <Paragraph style={{ textAlign: 'center', marginTop: '20px' }}>Loading cryptocurrency data...</Paragraph>
          </Content>
        </Layout>
      </React.Fragment>
    )
  }

  // Filter coins based on search term
  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Sort coins based on selected sort key and order
  const sortedCoins = [...filteredCoins].sort((a, b) => {
    // Special case for trading signals
    if (sortKey === 'trading_signal') {
      const signalA = getTradingSignal(a).score
      const signalB = getTradingSignal(b).score
      return sortOrder === 'ascend' ? signalA - signalB : signalB - signalA
    }

    const valueA = a[sortKey]
    const valueB = b[sortKey]

    if (valueA === null || valueA === undefined) return sortOrder === 'ascend' ? -1 : 1
    if (valueB === null || valueB === undefined) return sortOrder === 'ascend' ? 1 : -1

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortOrder === 'ascend'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA)
    }

    return sortOrder === 'ascend' ? valueA - valueB : valueB - valueA
  })

  const handleSort = (value) => {
    setSortKey(value)
  }

  const handleSortOrderChange = (value) => {
    setSortOrder(value)
  }

  const handleRefresh = () => {
    fetchCoinData()
    message.info('Refreshing cryptocurrency data...')
  }

  const handleTimeRangeChange = (value) => {
    setTimeRange(value)
  }

  const handleViewModeChange = (value) => {
    setViewMode(value)
  }

  const columns = [
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
      render: symbol => symbol.toUpperCase(),
      sorter: (a, b) => a.symbol.localeCompare(b.symbol),
      sortDirections: ['ascend', 'descend']
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {record.image && (
            <img
              src={record.image}
              alt={name}
              style={{ width: '20px', height: '20px', marginRight: '8px' }}
            />
          )}
          <Tag color="purple">{name}</Tag>
        </div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend']
    },
    {
      title: 'Price',
      key: 'price',
      render: (_, coin) => getPriceChangeIndicator(coin),
      sorter: (a, b) => a.current_price - b.current_price,
      sortDirections: ['ascend', 'descend'],
      defaultSortOrder: 'descend'
    },
    {
      title: () => (
        <div>
          {timeRange} Change
          <Tooltip title="Select time period">
            <Select
              size="small"
              defaultValue="24h"
              style={{ width: 60, marginLeft: 8 }}
              onChange={handleTimeRangeChange}
              value={timeRange}
              dropdownMatchSelectWidth={false}
            >
              <Option value="1h">1h</Option>
              <Option value="24h">24h</Option>
              <Option value="7d">7d</Option>
              <Option value="30d">30d</Option>
            </Select>
          </Tooltip>
        </div>
      ),
      dataIndex: 'price_change_percentage_24h',
      key: 'price_change_percentage_24h',
      render: change => {
        if (change === null || change === undefined) {
          return <span>N/A</span>
        }
        return (
          <span style={{ color: change >= 0 ? 'green' : 'red' }}>
            {change >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {change.toFixed(2)}%
          </span>
        )
      },
      sorter: (a, b) => {
        const changeA = a.price_change_percentage_24h || 0
        const changeB = b.price_change_percentage_24h || 0
        return changeA - changeB
      },
      sortDirections: ['ascend', 'descend']
    },
    {
      title: () => (
        <span>
          Trading Signal <Tooltip title="AI-generated trading signals based on price action, volume, and market trend analysis"><InfoCircleOutlined /></Tooltip>
        </span>
      ),
      key: 'trading_signal',
      render: (_, coin) => {
        const signal = getTradingSignal(coin)
        return (
          <Tooltip title={getTradingSignalTooltip(coin)} placement="right">
            <Tag color={signal.color} style={{ cursor: 'pointer' }}>
              {signal.icon} {signal.signal}
            </Tag>
          </Tooltip>
        )
      },
      sorter: (a, b) => {
        const signalA = getTradingSignal(a).score
        const signalB = getTradingSignal(b).score
        return signalA - signalB
      },
      sortDirections: ['ascend', 'descend']
    },
    {
      title: 'Favorite',
      key: 'favorite',
      render: (_, coin) => {
        const inWatchlist = isInWatchlist(coin.id)
        return (
          <Button
            type="text"
            icon={inWatchlist ? <StarFilled style={{ color: 'gold' }} /> : <StarOutlined />}
            onClick={() => handleWatchlistToggle(coin)}
            aria-label={inWatchlist ? `Remove ${coin.name} from favorites` : `Add ${coin.name} to favorites`}
          />
        )
      }
    },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'id',
      render: (id, coin) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button type="primary">
            <Link to={`/coins/${id}`}>View</Link>
          </Button>
          {hoveredRow === id && (
            <Tooltip title="Create trade based on signal">
              <Button type="default" style={{ backgroundColor: getTradingSignal(coin).color, borderColor: getTradingSignal(coin).color }}>
                <Link to={`/trade/${id}`}>Trade</Link>
              </Button>
            </Tooltip>
          )}
        </div>
      )
    }
  ]

  // Card view for coins
  const renderCardView = () => {
    return (
      <Row gutter={[16, 16]}>
        {sortedCoins.map(coin => {
          const signal = getTradingSignal(coin)
          return (
            <Col xs={24} sm={12} md={8} lg={6} key={coin.id}>
              <Badge.Ribbon text={signal.signal} color={signal.color}>
                <Card
                  hoverable
                  style={{ borderRadius: '8px' }}
                  actions={[
                    // Fixed key prop issues by adding unique keys to each element in the actions array
                    <Tooltip title={isInWatchlist(coin.id) ? 'Remove from watchlist' : 'Add to watchlist'} key="watchlist">
                      <Button
                        type="text"
                        icon={isInWatchlist(coin.id) ? <StarFilled style={{ color: 'gold' }} /> : <StarOutlined />}
                        onClick={() => handleWatchlistToggle(coin)}
                      />
                    </Tooltip>,
                    <Link to={`/coins/${coin.id}`} key="details">
                      <Button type="text" icon={<InfoCircleOutlined />} />
                    </Link>,
                    <Link to={`/trade/${coin.id}`} key="trade">
                      <Button type="text" icon={<DollarOutlined />} />
                    </Link>
                  ]}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {coin.image && (
                        <img
                          src={coin.image}
                          alt={coin.name}
                          style={{ width: '32px', height: '32px', marginRight: '12px' }}
                        />
                      )}
                      <div>
                        <Title level={4} style={{ margin: 0 }}>{coin.name}</Title>
                        <Text type="secondary">{coin.symbol.toUpperCase()}</Text>
                      </div>
                    </div>
                  </div>

                  <Statistic
                    title="Price"
                    value={coin.current_price}
                    precision={2}
                    prefix="$"
                    valueStyle={{ color: previousPrices[coin.id] < coin.current_price ? 'green' : previousPrices[coin.id] > coin.current_price ? 'red' : 'inherit' }}
                    suffix={previousPrices[coin.id] < coin.current_price ? <ArrowUpOutlined /> : previousPrices[coin.id] > coin.current_price ? <ArrowDownOutlined /> : null}
                  />

                  <Statistic
                    title={`${timeRange} Change`}
                    value={coin.price_change_percentage_24h || 0}
                    precision={2}
                    suffix="%"
                    valueStyle={{ color: (coin.price_change_percentage_24h || 0) >= 0 ? 'green' : 'red' }}
                    prefix={(coin.price_change_percentage_24h || 0) >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  />
                </Card>
              </Badge.Ribbon>
            </Col>
          )
        })}
      </Row>
    )
  }

  return (
    <React.Fragment>
      <Layout style={{ padding: '1rem' }}>
        <Content style={contentStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <Title level={2}>Cryptocurrency Trading Dashboard</Title>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={refreshLoading}
            >
              Refresh Data
            </Button>
          </div>

          <div style={{ display: 'flex', marginBottom: '1rem', gap: '16px', flexWrap: 'wrap' }}>
            <Input
              placeholder="Search coins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '300px' }}
              prefix={<SearchOutlined />}
              allowClear
            />

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <div>
                <span style={{ marginRight: '8px' }}>Sort by:</span>
                <Select
                  style={{ width: 150 }}
                  onChange={handleSort}
                  value={sortKey}
                >
                  <Option value="current_price">Price</Option>
                  <Option value="name">Name</Option>
                  <Option value="symbol">Symbol</Option>
                  <Option value="price_change_percentage_24h">Price Change</Option>
                  <Option value="trading_signal">Trading Signal</Option>
                </Select>
              </div>

              <div>
                <span style={{ marginRight: '8px' }}>Order:</span>
                <Select
                  style={{ width: 120 }}
                  onChange={handleSortOrderChange}
                  value={sortOrder}
                >
                  <Option value="ascend">Ascending</Option>
                  <Option value="descend">Descending</Option>
                </Select>
              </div>

              <div>
                <span style={{ marginRight: '8px' }}>View:</span>
                <Select
                  style={{ width: 120 }}
                  onChange={handleViewModeChange}
                  value={viewMode}
                >
                  <Option value="table">Table</Option>
                  <Option value="card">Cards</Option>
                </Select>
              </div>
            </div>
          </div>

          {/* Stats summary cards */}
          <Row gutter={16} style={{ marginBottom: '16px' }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Coins"
                  value={filteredCoins.length}
                  prefix={<DashboardOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Buy Signals"
                  value={filteredCoins.filter(coin => getTradingSignal(coin).score > 0).length}
                  valueStyle={{ color: 'green' }}
                  prefix={<RiseOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Sell Signals"
                  value={filteredCoins.filter(coin => getTradingSignal(coin).score < 0).length}
                  valueStyle={{ color: 'red' }}
                  prefix={<FallOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Watchlist"
                  value={watchlist.length}
                  valueStyle={{ color: 'gold' }}
                  prefix={<StarFilled />}
                />
              </Card>
            </Col>
          </Row>

          {viewMode === 'table'
            ? (
              <Table
                style={tableStyle}
                bordered
                dataSource={sortedCoins}
                columns={columns}
                rowKey="id"
                pagination={{
                  pageSizeOptions: ['10', '20', '50', '100'],
                  showSizeChanger: true,
                  defaultPageSize: 10
                }}
                onChange={(pagination, filters, sorter) => {
                  if (sorter && sorter.columnKey) {
                    setSortKey(sorter.columnKey === 'price' ? 'current_price' : sorter.columnKey)
                    setSortOrder(sorter.order || 'descend')
                  }
                }}
                onRow={(record) => ({
                  onMouseEnter: () => setHoveredRow(record.id),
                  onMouseLeave: () => setHoveredRow(null)
                })}
              />
            )
            : (
              renderCardView()
            )}
        </Content>
      </Layout>
    </React.Fragment>
  )
}

export default ReactCoinsList
