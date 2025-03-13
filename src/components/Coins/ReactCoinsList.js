import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCoins, setSiderMenuItem } from '../../redux_actions'
import { Layout, Table, Typography, Button, Tag, Spin } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

const { Content } = Layout
const { Title, Paragraph } = Typography

const ReactCoinsList = () => {
  const dispatch = useDispatch()
  const coins = useSelector(state => state.coins.data)
  const [previousPrices, setPreviousPrices] = useState({})

  useEffect(() => {
    dispatch(fetchCoins())
    dispatch(setSiderMenuItem('coin-list'))

    const interval = setInterval(() => {
      dispatch(fetchCoins())
    }, 30000)

    return () => clearInterval(interval)
  }, [dispatch])

  useEffect(() => {
    // Store previous prices for trend tracking
    const prices = {}
    coins.forEach(coin => {
      prices[coin.id] = coin.current_price
    })
    setPreviousPrices(prices)
  }, [coins])

  const getPriceChangeIndicator = (coin) => {
    const previousPrice = previousPrices[coin.id] || coin.current_price
    if (coin.current_price > previousPrice) {
      return <span style={{ color: 'green' }}><ArrowUpOutlined /> {coin.current_price} USD</span>
    } else if (coin.current_price < previousPrice) {
      return <span style={{ color: 'red' }}><ArrowDownOutlined /> {coin.current_price} USD</span>
    }
    return <span>{coin.current_price} USD</span>
  }

  if (!coins.length) return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol'
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
      render: change => (
        <span style={{ color: change >= 0 ? 'green' : 'red' }}>
          {change >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {change.toFixed(2)}%
        </span>
      )
    },
    {
      title: 'View Details',
      dataIndex: 'id',
      key: 'id',
      render: id => (<Button type="primary"><Link to={`/coins/${id}`}>View</Link></Button>)
    }
  ]

  return (
    <Layout style={{ padding: '1rem' }}>
      <Content>
        <Title level={2}>Coins List</Title>
        <Paragraph>
          This page lists cryptocurrencies available through the CoinGecko API.
          To view details of a given coin, click &apos;View&apos; button.
          You can also filter by Id, Symbol or Name to drill down and find a coin.
        </Paragraph>
        <Table
          bordered
          dataSource={coins}
          columns={columns}
          rowKey="id"
        />
      </Content>
    </Layout>
  )
}

export default ReactCoinsList
