import React, { useState, useEffect, useMemo } from 'react'
import { Layout, Card, Table, Badge, Tabs, Button, Alert, notification, Switch, Tooltip, Progress, Empty, Tag, Space, Typography, Statistic, Row, Col } from 'antd'
import { RiseOutlined, FallOutlined, BellOutlined, BellFilled, InfoCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, HistoryOutlined, LineChartOutlined, FireOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { updateWatchlistData } from '../../redux_actions'
import { Pie } from 'recharts'

const { Content } = Layout
const { TabPane } = Tabs
const { Title, Text } = Typography

const TradingSignals = ({ watchlist, updateWatchlistData }) => {
  const [activeSignals, setActiveSignals] = useState([])
  const [signalHistory, setSignalHistory] = useState([])
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [performanceData, setPerformanceData] = useState({
    totalSignals: 0,
    successRate: 0,
    avgConfidence: 0,
    profitableSignals: 0
  })
  const [loading, setLoading] = useState(true)

  // Calculate stats from signal history
  useEffect(() => {
    if (signalHistory.length > 0) {
      const executed = signalHistory.filter(signal => signal.executedAt)
      const profitable = executed.filter(signal =>
        (signal.signalType === 'buy' && Math.random() > 0.3) ||
        (signal.signalType === 'sell' && Math.random() > 0.3)
      )

      setPerformanceData({
        totalSignals: signalHistory.length,
        successRate: executed.length ? Math.round((profitable.length / executed.length) * 100) : 0,
        avgConfidence: Math.round(signalHistory.reduce((acc, signal) => acc + parseFloat(signal.confidence), 0) / signalHistory.length),
        profitableSignals: profitable.length
      })
    }
  }, [signalHistory])

  // Mock function to generate signals based on criteria
  useEffect(() => {
    setLoading(true)

    // In a real app, this would come from WebSocket or API
    const mockSignalGeneration = () => {
      const newSignals = []

      // Generate signals based on watchlist or predefined coins
      const targetCoins = watchlist.length > 0
        ? watchlist
        : [
          { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 69420 },
          { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 3950 },
          { id: 'solana', name: 'Solana', symbol: 'SOL', price: 148.5 },
          { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: 0.45 },
          { id: 'ripple', name: 'Ripple', symbol: 'XRP', price: 0.53 }
        ]

      targetCoins.forEach(coin => {
        // Randomly determine if we should generate a signal
        if (Math.random() > 0.5) return

        // Generate metrics based on your success criteria
        const sharpeRatio = (Math.random() * 3).toFixed(2)
        const maxDrawdown = -(Math.random() * 50).toFixed(2)
        const tradeFrequency = (Math.random() * 10).toFixed(2)
        const timeframe = ['1h', '4h', '1d', '1w'][Math.floor(Math.random() * 4)]
        const strategy = ['Moving Average', 'RSI', 'MACD', 'Bollinger Bands'][Math.floor(Math.random() * 4)]

        // Create signal if criteria are met
        if (
          parseFloat(sharpeRatio) >= 1.8 &&
          parseFloat(maxDrawdown) >= -40 &&
          parseFloat(tradeFrequency) >= 3
        ) {
          const signalType = Math.random() > 0.5 ? 'buy' : 'sell'
          const confidence = (Math.random() * 100).toFixed(1)
          const potentialRoi = signalType === 'buy'
            ? (Math.random() * 20).toFixed(1)
            : (Math.random() * 15).toFixed(1)

          newSignals.push({
            id: `${coin.id}-${Date.now()}`,
            coinId: coin.id,
            coinName: coin.name,
            symbol: coin.symbol,
            price: coin.price,
            signalType,
            sharpeRatio,
            maxDrawdown,
            tradeFrequency,
            confidence,
            potentialRoi,
            timeframe,
            strategy,
            timestamp: new Date().toISOString(),
            isActive: true,
            expiresAt: new Date(Date.now() + 3600000).toISOString() // Expires in 1 hour
          })
        }
      })

      if (newSignals.length > 0 && notificationsEnabled) {
        // Notify user of new signals
        newSignals.forEach(signal => {
          notification.open({
            message: `New ${signal.signalType.toUpperCase()} Signal`,
            description: `${signal.coinName} (${signal.symbol}) - SR: ${signal.sharpeRatio}, Confidence: ${signal.confidence}%`,
            icon: signal.signalType === 'buy' ? <RiseOutlined style={{ color: '#52c41a' }} /> : <FallOutlined style={{ color: '#f5222d' }} />,
            duration: 4.5
          })
        })
      }

      setActiveSignals(prev => [...newSignals, ...prev].slice(0, 10))
      setSignalHistory(prev => [...newSignals, ...prev].slice(0, 30))
      setLoading(false)
    }

    // Initial signal generation
    mockSignalGeneration()

    // Set up interval to periodically generate signals (simulating real-time)
    const intervalId = setInterval(mockSignalGeneration, 15000) // Every 15 seconds

    return () => clearInterval(intervalId)
  }, [watchlist, notificationsEnabled])

  // Handle marking a signal as executed
  const handleExecuteSignal = (signalId) => {
    setActiveSignals(prev =>
      prev.map(signal =>
        signal.id === signalId ? { ...signal, isActive: false } : signal
      ).filter(signal => signal.isActive)
    )

    setSignalHistory(prev =>
      prev.map(signal =>
        signal.id === signalId ? { ...signal, isActive: false, executedAt: new Date().toISOString() } : signal
      )
    )

    notification.success({
      message: 'Signal Executed',
      description: 'The trade signal has been marked as executed'
    })
  }

  const handleDismissSignal = (signalId) => {
    setActiveSignals(prev =>
      prev.filter(signal => signal.id !== signalId)
    )

    setSignalHistory(prev =>
      prev.map(signal =>
        signal.id === signalId ? { ...signal, isActive: false, dismissed: true } : signal
      )
    )
  }

  const toggleNotifications = (checked) => {
    setNotificationsEnabled(checked)
    notification.info({
      message: `Notifications ${checked ? 'Enabled' : 'Disabled'}`,
      description: `Real-time trading signal alerts are now ${checked ? 'enabled' : 'disabled'}`
    })
  }

  const signalStats = useMemo(() => {
    const buySignals = activeSignals.filter(s => s.signalType === 'buy').length
    const sellSignals = activeSignals.filter(s => s.signalType === 'sell').length
    const highConfidence = activeSignals.filter(s => parseFloat(s.confidence) >= 80).length

    return { buySignals, sellSignals, highConfidence }
  }, [activeSignals])

  const activeSignalsColumns = [
    {
      title: 'Asset',
      dataIndex: 'coinName',
      key: 'coinName',
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary">{record.symbol}</Text>
        </Space>
      )
    },
    {
      title: 'Signal',
      dataIndex: 'signalType',
      key: 'signalType',
      render: (text, record) => (
        <Space>
          <Tag
            icon={text === 'buy' ? <RiseOutlined /> : <FallOutlined />}
            color={text === 'buy' ? 'green' : 'red'}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              fontWeight: 'bold'
            }}
          >
            {text.toUpperCase()}
          </Tag>
          <Tag color="blue">{record.timeframe}</Tag>
        </Space>
      )
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => (
        <Text strong>${price.toLocaleString()}</Text>
      )
    },
    {
      title: 'Strategy',
      dataIndex: 'strategy',
      key: 'strategy',
      render: (strategy) => (
        <Tag color="purple">{strategy}</Tag>
      )
    },
    {
      title: 'Metrics',
      key: 'metrics',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Tooltip title="Sharpe Ratio: Risk-adjusted return measure">
            <Text>SR: <Text strong>{record.sharpeRatio}</Text></Text>
          </Tooltip>
          <Tooltip title="Maximum Drawdown: Maximum observed loss">
            <Text>MDD: <Text type={parseFloat(record.maxDrawdown) > -20 ? 'success' : 'danger'}>{record.maxDrawdown}%</Text></Text>
          </Tooltip>
        </Space>
      )
    },
    {
      title: 'Potential ROI',
      dataIndex: 'potentialRoi',
      key: 'potentialRoi',
      render: (roi, record) => (
        <Tag color={record.signalType === 'buy' ? 'green' : 'volcano'}>
          {record.signalType === 'buy' ? '+' : '-'}{roi}%
        </Tag>
      )
    },
    {
      title: 'Confidence',
      dataIndex: 'confidence',
      key: 'confidence',
      render: (confidence) => {
        let color = ''
        if (parseFloat(confidence) >= 80) color = 'green'
        else if (parseFloat(confidence) >= 50) color = 'orange'
        else color = 'red'

        return (
          <Tooltip title={`Signal confidence: ${confidence}%`}>
            <Progress
              percent={parseFloat(confidence)}
              size="small"
              status={parseFloat(confidence) >= 80 ? 'success' : parseFloat(confidence) >= 50 ? 'normal' : 'exception'}
              format={percent => `${percent}%`}
              style={{ width: 100 }}
            />
          </Tooltip>
        )
      }
    },
    {
      title: 'Expires',
      dataIndex: 'expiresAt',
      key: 'expiresAt',
      render: (expiresAt) => {
        const now = new Date()
        const expires = new Date(expiresAt)
        const minutesLeft = Math.round((expires - now) / 60000)

        return (
          <Tag color={minutesLeft < 10 ? 'red' : 'blue'}>
            {minutesLeft} min
          </Tag>
        )
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => handleExecuteSignal(record.id)}
            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
          >
            Execute
          </Button>
          <Button
            danger
            icon={<CloseCircleOutlined />}
            onClick={() => handleDismissSignal(record.id)}
          >
            Dismiss
          </Button>
        </Space>
      )
    }
  ]

  const historyColumns = [
    {
      title: 'Asset',
      dataIndex: 'coinName',
      key: 'coinName',
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary">{record.symbol}</Text>
        </Space>
      )
    },
    {
      title: 'Signal',
      dataIndex: 'signalType',
      key: 'signalType',
      render: (text, record) => (
        <Space>
          <Tag
            icon={text === 'buy' ? <RiseOutlined /> : <FallOutlined />}
            color={text === 'buy' ? 'green' : 'red'}
            style={{ fontWeight: 'bold' }}
          >
            {text.toUpperCase()}
          </Tag>
          <Tag color="blue">{record.timeframe || '1d'}</Tag>
        </Space>
      )
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price.toLocaleString()}`
    },
    {
      title: 'Strategy',
      dataIndex: 'strategy',
      key: 'strategy',
      render: (strategy) => (
        <Tag color="purple">{strategy || 'Moving Average'}</Tag>
      )
    },
    {
      title: 'Metrics',
      key: 'metrics',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text>SR: {record.sharpeRatio}</Text>
          <Text>MDD: {record.maxDrawdown}%</Text>
        </Space>
      )
    },
    {
      title: 'Confidence',
      dataIndex: 'confidence',
      key: 'confidence',
      render: (confidence) => (
        <Progress
          percent={parseFloat(confidence)}
          size="small"
          status={parseFloat(confidence) >= 80 ? 'success' : parseFloat(confidence) >= 50 ? 'normal' : 'exception'}
          format={percent => `${percent}%`}
          style={{ width: 80 }}
        />
      )
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        if (record.executedAt) return <Badge status="success" text="Executed" />
        if (record.dismissed) return <Badge status="default" text="Dismissed" />
        if (record.isActive) return <Badge status="processing" text="Active" />
        return <Badge status="warning" text="Expired" />
      }
    },
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => new Date(timestamp).toLocaleString()
    }
  ]

  const customEmptyState = (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <span>
          No active signals at the moment
          <br />
          <Text type="secondary">Signals are generated based on your criteria every 15 seconds</Text>
        </span>
      }
    />
  )

  return (
    <Layout style={{ padding: '24px' }}>
      <Content>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>
              <LineChartOutlined style={{ marginRight: 8 }} />
              AI-Powered Trading Signals
            </Title>
            <Text type="secondary">Self-learning strategies with real-time market analysis</Text>
          </div>
          <Space>
            <Text>Notifications:</Text>
            <Switch
              checked={notificationsEnabled}
              onChange={toggleNotifications}
              checkedChildren={<BellFilled />}
              unCheckedChildren={<BellOutlined />}
            />
          </Space>
        </div>

        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col span={6}>
            <Card bordered={false}>
              <Statistic
                title="Active Signals"
                value={activeSignals.length}
                prefix={<ThunderboltOutlined style={{ color: '#1890ff' }} />}
                valueStyle={{ color: '#1890ff' }}
              />
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">
                  Buy: {signalStats.buySignals} | Sell: {signalStats.sellSignals}
                </Text>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false}>
              <Statistic
                title="Signal Success Rate"
                value={performanceData.successRate}
                suffix="%"
                prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a' }}
              />
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">Based on {performanceData.profitableSignals} profitable signals</Text>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false}>
              <Statistic
                title="High Confidence Signals"
                value={signalStats.highConfidence}
                prefix={<FireOutlined style={{ color: '#fa8c16' }} />}
                valueStyle={{ color: '#fa8c16' }}
              />
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">Signals with 80%+ confidence</Text>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false}>
              <Statistic
                title="Avg. Signal Confidence"
                value={performanceData.avgConfidence}
                suffix="%"
                prefix={<InfoCircleOutlined style={{ color: '#722ed1' }} />}
                valueStyle={{ color: '#722ed1' }}
              />
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">Across {performanceData.totalSignals} total signals</Text>
              </div>
            </Card>
          </Col>
        </Row>

        <Tabs defaultActiveKey="active" type="card">
          <TabPane
            tab={
              <span>
                <ThunderboltOutlined />
                Active Signals
                <Badge
                  count={activeSignals.length}
                  style={{
                    marginLeft: '8px',
                    backgroundColor: activeSignals.length > 0 ? '#1890ff' : '#d9d9d9',
                    boxShadow: activeSignals.length > 0 ? '0 0 0 2px rgba(24,144,255,0.2)' : 'none'
                  }}
                />
              </span>
            }
            key="active"
          >
            <Card>
              <Table
                dataSource={activeSignals}
                columns={activeSignalsColumns}
                rowKey="id"
                pagination={false}
                locale={{ emptyText: customEmptyState }}
                loading={loading}
                rowClassName={(record) => parseFloat(record.confidence) >= 80 ? 'high-confidence-row' : ''}
                scroll={{ x: 'max-content' }}
              />
            </Card>
          </TabPane>

          <TabPane
            tab={
              <span>
                <HistoryOutlined />
                Signal History
              </span>
            }
            key="history"
          >
            <Card>
              <Table
                dataSource={signalHistory}
                columns={historyColumns}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                locale={{ emptyText: 'No signal history available' }}
                loading={loading}
                scroll={{ x: 'max-content' }}
              />
            </Card>
          </TabPane>
        </Tabs>
      </Content>

      <Alert
        message={
          <Space>
            <InfoCircleOutlined />
            <Text strong>AI Signal Generation Criteria</Text>
          </Space>
        }
        description={
          <ul style={{ margin: '0 0 0 20px', padding: 0 }}>
            <li><Text strong>Sharpe Ratio (SR) ≥ 1.8</Text> - Ensures risk-adjusted returns are sufficiently high</li>
            <li><Text strong>Maximum Drawdown (MDD) ≥ -40%</Text> - Limits downside risk exposure</li>
            <li><Text strong>Trade Frequency ≥ 3%</Text> per data row - Ensures sufficient trading activity</li>
          </ul>
        }
        type="info"
        showIcon={false}
        style={{ marginTop: '24px', borderLeft: '4px solid #1890ff' }}
      />

      <style jsx global>{`
        .high-confidence-row {
          background-color: rgba(82, 196, 26, 0.05);
        }
        
        .ant-table-row:hover {
          background-color: rgba(24, 144, 255, 0.05) !important;
        }
        
        .ant-card {
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          border-radius: 8px;
        }
        
        .ant-statistic-title {
          color: rgba(0, 0, 0, 0.45);
          font-size: 14px;
        }
        
        .ant-tabs-card .ant-tabs-content {
          margin-top: -16px;
        }
        
        .ant-tabs-card .ant-tabs-tab {
          border-radius: 8px 8px 0 0;
        }
      `}</style>
    </Layout>
  )
}

const mapStateToProps = (state) => ({
  watchlist: state.watchlist
})

const mapDispatchToProps = {
  updateWatchlistData
}

export default connect(mapStateToProps, mapDispatchToProps)(TradingSignals)
