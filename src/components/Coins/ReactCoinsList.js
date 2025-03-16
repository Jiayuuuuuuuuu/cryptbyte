import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCoins, setSiderMenuItem, addToWatchlist, removeFromWatchlist } from '../../redux_actions'
import { Layout, Table, Typography, Button, Tag, Spin, message } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined, StarOutlined, StarFilled, MinusOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

const { Content } = Layout
const { Title, Paragraph } = Typography

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

  const columns = [
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
      render: symbol => symbol.toUpperCase()
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: name => <Tag color="purple">{name}</Tag>
    },
    {
      title: 'Price',
      key: 'price',
      render: (_, coin) => getPriceChangeIndicator(coin)
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
      }
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
        <Paragraph>
          This page lists cryptocurrencies available through the CoinGecko API.
          To view details of a given coin, click the &apos;View&apos; button.
          You can also filter by Symbol or Name to find a coin.
        </Paragraph>
        <Table
          bordered
          dataSource={coins}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Content>
    </Layout>
  )
}

export default ReactCoinsList
