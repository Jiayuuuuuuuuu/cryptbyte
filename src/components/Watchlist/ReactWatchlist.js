import React from 'react'
import { useSelector } from 'react-redux'
import { Layout, Table, Typography, Button, Tag, Empty, Card, Space } from 'antd'
import { Link } from 'react-router-dom'
import { StarOutlined, PlusCircleOutlined } from '@ant-design/icons'

const { Content } = Layout
const { Title, Paragraph, Text } = Typography

const ReactWatchlist = () => {
  const watchlist = useSelector(state => state.watchlist?.watchlist ?? [])

  const columns = [
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
      title: 'View Details',
      dataIndex: 'id',
      key: 'id',
      render: id => (<Button type="primary"><Link to={`/coins/${id}`}>View</Link></Button>)
    }
  ]

  const EmptyWatchlistContent = () => (
    <Card style={{ textAlign: 'center', padding: '2rem', marginTop: '1rem' }}>
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
          <StarOutlined style={{ marginRight: '8px' }} />
          Click the star icon on any coin page to add it to your watchlist
        </Text>
      </Space>
    </Card>
  )

  return (
    <Layout style={{ padding: '1rem', minHeight: '80vh' }}>
      <Content>
        <Title level={2}>
          <StarOutlined style={{ marginRight: '12px', color: '#faad14' }} />
          My Watchlist
        </Title>
        {watchlist.length === 0
          ? <EmptyWatchlistContent />
          : <Table bordered dataSource={watchlist} columns={columns} rowKey="id" />
        }
      </Content>
    </Layout>
  )
}

export default ReactWatchlist
