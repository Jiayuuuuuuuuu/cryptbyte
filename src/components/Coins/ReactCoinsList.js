import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCoins, setSiderMenuItem, addToWatchlist, removeFromWatchlist } from '../../redux_actions'
import { Layout, Table, Typography, Button, Tag, Spin, message, Input, Select } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined, StarOutlined, StarFilled, MinusOutlined, SearchOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

const { Content } = Layout
const { Title, Paragraph } = Typography
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

  useEffect(() => {
    fetchCoinData()
    dispatch(setSiderMenuItem('coin-list'))

    const interval = setInterval(() => {
      fetchCoinData()
    }, 30000)

    return () => clearInterval(interval)
  }, [dispatch])

  const fetchCoinData = () => {
    dispatch(fetchCoins()).catch(err => {
      console.error('Error fetching coin data:', err)
      message.error('Failed to fetch coin data. Please try again later.')
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

  if (error) {
    return (
      <Layout style={{ padding: '1rem' }}>
        <Content>
          <div style={{ textAlign: 'center', margin: '50px 0' }}>
            <Title level={3} style={{ color: 'red' }}>Error loading coin data</Title>
            <Paragraph>There was a problem fetching cryptocurrency data.</Paragraph>
            <Button type="primary" onClick={fetchCoinData}>Try Again</Button>
          </div>
        </Content>
      </Layout>
    )
  }

  if (loading || !Array.isArray(coins) || !coins.length) {
    return (
      <Layout style={{ padding: '1rem' }}>
        <Content>
          <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />
          <Paragraph style={{ textAlign: 'center', marginTop: '20px' }}>Loading cryptocurrency data...</Paragraph>
        </Content>
      </Layout>
    )
  }

  // Filter coins based on search term
  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Sort coins based on selected sort key and order
  const sortedCoins = [...filteredCoins].sort((a, b) => {
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
      render: name => <Tag color="purple">{name}</Tag>,
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
      title: '24h Change',
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
      title: 'View Details',
      dataIndex: 'id',
      key: 'id',
      render: (id) => (
        <Button type="primary">
          <Link to={`/coins/${id}`}>View</Link>
        </Button>
      )
    }
  ]

  return (
    <Layout style={{ padding: '1rem' }}>
      <Content>
        <Title level={2}>Coins List</Title>

        <div style={{ display: 'flex', marginBottom: '1rem', gap: '16px' }}>
          <Input
            placeholder="Search coins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '300px' }}
            prefix={<SearchOutlined />}
            allowClear
          />

          <div style={{ display: 'flex', gap: '8px' }}>
            <div>
              <span style={{ marginRight: '8px' }}>Sort by:</span>
              <Select
                defaultValue="current_price"
                style={{ width: 150 }}
                onChange={handleSort}
                value={sortKey}
              >
                <Option value="current_price">Price</Option>
                <Option value="name">Name</Option>
                <Option value="symbol">Symbol</Option>
                <Option value="price_change_percentage_24h">24h Change</Option>
              </Select>
            </div>

            <div>
              <span style={{ marginRight: '8px' }}>Order:</span>
              <Select
                defaultValue="descend"
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

        <Table
          bordered
          dataSource={sortedCoins}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          onChange={(pagination, filters, sorter) => {
            if (sorter && sorter.columnKey) {
              setSortKey(sorter.columnKey === 'price' ? 'current_price' : sorter.columnKey)
              setSortOrder(sorter.order || 'descend')
            }
          }}
        />
      </Content>
    </Layout>
  )
}

export default ReactCoinsList
