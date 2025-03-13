import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchCoins, setSiderMenuItem } from '../../redux_actions'
import { Layout, Table, Typography, Button, Tag, Input, Spin } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { contentStyle, tableStyle } from '../../styles'

const { Content } = Layout
const { Title, Paragraph } = Typography

const ReactCoinsList = () => {
  const dispatch = useDispatch()
  const coins = useSelector(state => state.coins.data)
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    dispatch(fetchCoins())
    dispatch(setSiderMenuItem('coin-list'))

    const interval = setInterval(() => {
      dispatch(fetchCoins()) // Auto-fetch every 30 seconds
    }, 30000)

    return () => clearInterval(interval) // Cleanup interval on unmount
  }, [dispatch])

  const handleSearch = (selectedKeys, confirm) => {
    confirm()
    setSearchText(selectedKeys[0])
  }

  const handleReset = clearFilters => {
    clearFilters()
    setSearchText('')
  }

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    render: text => (
      <Tag color="purple">{text}</Tag>
    )
  })

  if (!coins.length) return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />

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
      render: item => <Tag color="purple">{item}</Tag>
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
      <Content style={contentStyle}>
        <Title level={2}>Coins List</Title>
        <Paragraph>
          This page lists cryptocurrencies available through the CoinGecko API. To view details of a given coin, click &apos;View&apos; button.
          You can also filter by Id, Symbol or Name to drill down and find a coin.
        </Paragraph>

        <Table
          style={tableStyle}
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
