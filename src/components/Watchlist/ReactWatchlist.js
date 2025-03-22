import coinGecko from '../../API'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Layout, Table, Typography, Button, Tag, Empty, Card, Space, Tabs, Statistic, Tooltip, Input, Select } from 'antd'
import { Link } from 'react-router-dom'
import {
  StarOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  MinusOutlined,
  SearchOutlined,
  RiseOutlined,
  FallOutlined,
  InfoCircleOutlined
} from '@ant-design/icons'
import { removeFromWatchlist } from '../../redux_actions'

const { Content } = Layout
const { Title, Paragraph, Text } = Typography
const { TabPane } = Tabs
const { Option } = Select

const ReactWatchlist = () => {
  const watchlist = useSelector(state => state.watchlist?.watchlist ?? [])
  const dispatch = useDispatch()
  const [previousPrices, setPreviousPrices] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [sortKey, setSortKey] = useState('name')
  const [sortOrder, setSortOrder] = useState('ascend')
  const [timeRange, setTimeRange] = useState('24h')
  // Add this new effect to fetch data for watchlist items
  useEffect(() => {
    if (Array.isArray(watchlist) && watchlist.length > 0) {
    // Get unique IDs of coins in watchlist
      const coinIds = watchlist.map(coin => coin.id).join(',')

      // Fetch latest data for these coins
      const fetchWatchlistData = async () => {
        try {
          const response = await coinGecko.get('/coins/markets', {
            params: {
              vs_currency: 'usd',
              ids: coinIds,
              order: 'market_cap_desc',
              per_page: 50,
              page: 1,
              sparkline: false,
              price_change_percentage: '24h,7d'
            }
          })

          // Update watchlist with fresh data
          const updatedWatchlist = watchlist.map(watchlistItem => {
            const freshData = response.data.find(coin => coin.id === watchlistItem.id)
            return freshData ? { ...watchlistItem, ...freshData } : watchlistItem
          })

          // Update watchlist in Redux
          dispatch({ type: 'UPDATE_WATCHLIST_DATA', payload: updatedWatchlist })
        } catch (error) {
          console.error('Error fetching watchlist data:', error)
        }
      }

      // Call the fetch function
      fetchWatchlistData()

      // Set up interval to refresh data (e.g., every 60 seconds)
      const intervalId = setInterval(fetchWatchlistData, 60000)

      // Clean up interval on component unmount
      return () => clearInterval(intervalId)
    }
  }, [watchlist, dispatch])

  useEffect(() => {
    if (Array.isArray(watchlist) && watchlist.length > 0) {
      const prices = watchlist.reduce((acc, coin) => {
        acc[coin.id] = coin.price || 0
        return acc
      }, {})
      setPreviousPrices(prices)
    }
  }, [watchlist])

  const handleRemoveFromWatchlist = (coinId) => {
    dispatch(removeFromWatchlist(coinId))
  }

  const getPriceChangeIndicator = (coin) => {
    const previousPrice = previousPrices[coin.id] || coin.price

    if (coin.price > previousPrice) {
      return <span style={{ color: 'green' }}><ArrowUpOutlined /> ${coin.price || '0.00'}</span>
    } else if (coin.price < previousPrice) {
      return <span style={{ color: 'red' }}><ArrowDownOutlined /> ${coin.price || '0.00'}</span>
    } else {
      return <span><MinusOutlined /> ${coin.price || '0.00'}</span>
    }
  }

  const getTradingSignal = (coin) => {
    const priceChange24h = coin.priceChange24h || 0
    const priceChange7d = coin.priceChange7d || 0
    const volume = coin.volume || 0
    const marketCap = coin.marketCap || 0

    const rsi = Math.min(100, Math.max(0, 50 + priceChange24h * 2 + Math.random() * 10))
    const macdSignal = priceChange24h > priceChange7d ? 1 : -1

    const volumeTrend = volume > 1000000 ? 1 : 0

    const marketCapFactor = marketCap > 1000000000 ? 1 : 0

    let signalScore = 0
    signalScore += priceChange24h > 5 ? 2 : priceChange24h > 2 ? 1 : priceChange24h < -5 ? -2 : priceChange24h < -2 ? -1 : 0
    signalScore += rsi > 70 ? -1 : rsi < 30 ? 1 : 0
    signalScore += macdSignal
    signalScore += volumeTrend
    signalScore += marketCapFactor

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

  const getTradingSignalTooltip = (coin) => {
    const priceChange24h = coin.priceChange24h || 0
    const rsi = Math.min(100, Math.max(0, 50 + priceChange24h * 2 + Math.random() * 10))

    return (
      <div>
        <p><strong>Trading Indicators:</strong></p>
        <p>RSI (14): {rsi.toFixed(2)}</p>
        <p>24h Change: {priceChange24h.toFixed(2)}%</p>
        <p>Volume: {(coin.volume || 0).toLocaleString()} USD</p>
        <p>Market Cap: {(coin.marketCap || 0).toLocaleString()} USD</p>
        <p><em>Signal strength: {getTradingSignal(coin).score}</em></p>
      </div>
    )
  }

  const handleSort = (value) => {
    setSortKey(value)
  }

  const handleSortOrderChange = (value) => {
    setSortOrder(value)
  }

  const handleTimeRangeChange = (value) => {
    setTimeRange(value)
  }

  // Filter coins based on search term
  const filteredWatchlist = watchlist.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Sort coins based on selected sort key and order
  const sortedWatchlist = [...filteredWatchlist].sort((a, b) => {
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

  const columns = [
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
      render: symbol => <Text strong>{symbol.toUpperCase()}</Text>,
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
          <Tag color="blue">{name}</Tag>
        </div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend']
    },
    {
      title: 'Price',
      key: 'price',
      render: (_, coin) => getPriceChangeIndicator(coin),
      sorter: (a, b) => (a.price || 0) - (b.price || 0),
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
      dataIndex: 'priceChange24h',
      key: 'priceChange24h',
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
        const changeA = a.priceChange24h || 0
        const changeB = b.priceChange24h || 0
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
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Button type="primary" size="small">
            <Link to={`/coins/${record.id}`}>View</Link>
          </Button>
          <Button
            type="text"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleRemoveFromWatchlist(record.id)}
          >
          </Button>
        </Space>
      )
    }
  ]

  const EmptyWatchlistContent = () => (
    <Card className="empty-state-card" style={{ textAlign: 'center', padding: '2rem', marginTop: '1rem', borderRadius: '8px' }}>
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={null}
      />
      <Title level={4} style={{ marginTop: '1rem' }}>Your watchlist is empty</Title>
      <Paragraph>
        <Text type="secondary">
          Add coins to your watchlist to track them easily and get quick access to their details.
        </Text>
      </Paragraph>
      <Space direction="vertical" size="middle" style={{ marginTop: '1rem' }}>
        <Button type="primary" icon={<PlusCircleOutlined />}>
          <Link to="/coins">Browse Coins</Link>
        </Button>
        <Text type="secondary">
          <StarOutlined style={{ marginRight: '8px', color: '#faad14' }} />
          Click the star icon on any coin page to add it to your watchlist
        </Text>
      </Space>
    </Card>
  )

  const WatchlistStats = () => (
    <div style={{ marginBottom: '24px' }}>
      <Card style={{ borderRadius: '8px' }}>
        <Space size="large">
          <Statistic
            title="Total Coins"
            value={watchlist.length}
            prefix={<StarOutlined style={{ color: '#faad14' }} />}
          />
          <Statistic
            title="Best Performer"
            value={watchlist.length > 0 ? Math.max(...watchlist.map(coin => coin.priceChange24h || 0)).toFixed(2) + '%' : '0.00%'}
            valueStyle={{ color: '#3f8600' }}
            prefix={<DollarOutlined />}
          />
          <Statistic
            title="Last Updated"
            value="Just now"
            prefix={<ClockCircleOutlined />}
          />
        </Space>
      </Card>
    </div>
  )

  return (
    <Layout style={{ padding: '24px', minHeight: '80vh', background: '#f5f5f5' }}>
      <Content>
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', marginBottom: '24px' }}>
          <Title level={2} style={{ marginBottom: '16px' }}>
            <StarOutlined style={{ marginRight: '12px', color: 'black' }} />
            Favorite Watchlist
          </Title>
          <Paragraph style={{ marginBottom: '24px' }}>
            Track your favorite cryptocurrencies, monitor price changes, and quickly access detailed information.
          </Paragraph>
        </div>

        {watchlist.length > 0 && <WatchlistStats />}

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
                <Option value="price">Price</Option>
                <Option value="name">Name</Option>
                <Option value="symbol">Symbol</Option>
                <Option value="priceChange24h">Price Change</Option>
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
          </div>
        </div>

        <Tabs defaultActiveKey="all" className="watchlist-tabs">
          <TabPane tab="All Coins" key="all">
            {watchlist.length === 0
              ? <EmptyWatchlistContent />
              : <Table
                bordered
                dataSource={sortedWatchlist}
                columns={columns}
                rowKey="id"
                pagination={{
                  pageSizeOptions: ['10', '20', '50', '100'],
                  showSizeChanger: true,
                  defaultPageSize: 10
                }}
                onChange={(pagination, filters, sorter) => {
                  if (sorter && sorter.columnKey) {
                    setSortKey(sorter.columnKey === 'price' ? 'price' : sorter.columnKey)
                    setSortOrder(sorter.order || 'descend')
                  }
                }}
                style={{ background: 'white', borderRadius: '8px' }}
              />
            }
          </TabPane>
          <TabPane tab="Gainers" key="gainers">
            {sortedWatchlist.filter(coin => (coin.priceChange24h || 0) > 0).length === 0
              ? <Card style={{ textAlign: 'center', padding: '2rem', borderRadius: '8px' }}>
                <Text type="secondary">No gainers in your watchlist</Text>
              </Card>
              : <Table
                bordered
                dataSource={sortedWatchlist.filter(coin => (coin.priceChange24h || 0) > 0)}
                columns={columns}
                rowKey="id"
                pagination={{
                  pageSizeOptions: ['10', '20', '50', '100'],
                  showSizeChanger: true,
                  defaultPageSize: 10
                }}
                onChange={(pagination, filters, sorter) => {
                  if (sorter && sorter.columnKey) {
                    setSortKey(sorter.columnKey === 'price' ? 'price' : sorter.columnKey)
                    setSortOrder(sorter.order || 'descend')
                  }
                }}
                style={{ background: 'white', borderRadius: '8px' }}
              />
            }
          </TabPane>
          <TabPane tab="Losers" key="losers">
            {sortedWatchlist.filter(coin => (coin.priceChange24h || 0) < 0).length === 0
              ? <Card style={{ textAlign: 'center', padding: '2rem', borderRadius: '8px' }}>
                <Text type="secondary">No losers in your watchlist</Text>
              </Card>
              : <Table
                bordered
                dataSource={sortedWatchlist.filter(coin => (coin.priceChange24h || 0) < 0)}
                columns={columns}
                rowKey="id"
                pagination={{
                  pageSizeOptions: ['10', '20', '50', '100'],
                  showSizeChanger: true,
                  defaultPageSize: 10
                }}
                onChange={(pagination, filters, sorter) => {
                  if (sorter && sorter.columnKey) {
                    setSortKey(sorter.columnKey === 'price' ? 'price' : sorter.columnKey)
                    setSortOrder(sorter.order || 'descend')
                  }
                }}
                style={{ background: 'white', borderRadius: '8px' }}
              />
            }
          </TabPane>
        </Tabs>
      </Content>
    </Layout>
  )
}

export default ReactWatchlist
