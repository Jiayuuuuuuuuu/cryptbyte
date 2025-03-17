import React, { useEffect, useState } from 'react'
import ReactSider from '../Navigation/ReactSider'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCoins, setSiderMenuItem } from '../../redux_actions'
import { Layout, Table, Typography, Button, Tag, Spin, Input, Space } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined, SearchOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import Highlighter from 'react-highlight-words'

const { Content } = Layout
const { Title, Paragraph } = Typography

const ReactCoinsList = () => {
  const dispatch = useDispatch()
  const coins = useSelector(state => state.coins.data)
  const [previousPrices, setPreviousPrices] = useState({})
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = React.useRef(null)

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

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters) => {
    clearFilters()
    setSearchText('')
  }

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  })

  const getPriceChangeIndicator = (coin) => {
    const previousPrice = previousPrices[coin.id] || coin.current_price
    if (coin.current_price > previousPrice) {
      return <span style={{ color: 'green' }}><ArrowUpOutlined /> {coin.current_price} USD</span>
    } else if (coin.current_price < previousPrice) {
      return <span style={{ color: 'red' }}><ArrowDownOutlined /> {coin.current_price} USD</span>
    }
    return <span>{coin.current_price} USD</span>
  }

  const contentStyle = { 
    padding: '24px', 
    margin: 0, 
    minHeight: 280,
    background: '#fff',
    borderRadius: '4px'
  }

  const tableStyle = { 
    boxShadow: '0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09)'
  }

  if (!coins || !coins.length) return (
    <React.Fragment>
      <ReactSider />
      <Layout style={{ padding: '1rem' }}>
        <Content style={contentStyle}>
          <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />
        </Content>
      </Layout>
    </React.Fragment>
  )

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      ...getColumnSearchProps('id')
    },
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
      ...getColumnSearchProps('symbol')
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
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
          {change >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {change?.toFixed(2)}%
        </span>
      ),
      sorter: (a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h
    },
    {
      title: 'View Details',
      dataIndex: 'id',
      key: 'id',
      render: id => (<Button type="primary"><Link to={`/coins/${id}`}>View</Link></Button>)
    }
  ]

  return (
    <React.Fragment>
      <ReactSider />
      <Layout style={{ padding: '1rem' }}>
        <Content style={contentStyle}>
          <Title level={2}>Coins List</Title>
          <Paragraph>
            This page lists cryptocurrencies available through the CoinGecko API.
            To view details of a given coin, click 'View' button.
            You can search and filter coins using the column filters.
            Data refreshes automatically every 30 seconds.
          </Paragraph>
          <Table
            style={tableStyle}
            bordered
            dataSource={coins}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </Content>
      </Layout>
    </React.Fragment>
  )
}

export default ReactCoinsList