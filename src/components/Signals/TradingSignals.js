import React, { useState, useEffect } from 'react'
import { Layout, Card, Table, Badge, Tabs, Button, Alert, notification, Switch, Tooltip } from 'antd'
import { RiseOutlined, FallOutlined, BellOutlined, BellFilled, InfoCircleOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { updateWatchlistData } from '../../redux_actions'

const { Content } = Layout
const { TabPane } = Tabs

const TradingSignals = ({ watchlist, updateWatchlistData }) => {
  const [activeSignals, setActiveSignals] = useState([])
  const [signalHistory, setSignalHistory] = useState([])
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  // Mock function to generate signals based on criteria
  useEffect(() => {
    // In a real app, this would come from WebSocket or API
    const mockSignalGeneration = () => {
      const newSignals = []

      // Generate signals based on watchlist or predefined coins
      const targetCoins = watchlist.length > 0
        ? watchlist
        : [
          { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 69420 },
          { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 3950 },
          { id: 'solana', name: 'Solana', symbol: 'SOL', price: 148.5 }
        ]

      targetCoins.forEach(coin => {
        // Randomly determine if we should generate a signal
        if (Math.random() > 0.5) return

        // Generate metrics based on your success criteria
        const sharpeRatio = (Math.random() * 3).toFixed(2)
        const maxDrawdown = -(Math.random() * 50).toFixed(2)
        const tradeFrequency = (Math.random() * 10).toFixed(2)

        // Create signal if criteria are met
        if (
          parseFloat(sharpeRatio) >= 1.8 &&
          parseFloat(maxDrawdown) >= -40 &&
          parseFloat(tradeFrequency) >= 3
        ) {
          const signalType = Math.random() > 0.5 ? 'buy' : 'sell'

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
            confidence: (Math.random() * 100).toFixed(1),
            timestamp: new Date().toISOString(),
            isActive: true
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
    }

    // Initial signal generation
    mockSignalGeneration()

    // Set up interval to periodically generate signals (simulating real-time)
    const intervalId = setInterval(mockSignalGeneration, 15000) // Every 15  seconds

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

  // Handle dismissing a signal
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

  // Toggle notifications
  const toggleNotifications = (checked) => {
    setNotificationsEnabled(checked)
    notification.info({
      message: `Notifications ${checked ? 'Enabled' : 'Disabled'}`,
      description: `Real-time trading signal alerts are now ${checked ? 'enabled' : 'disabled'}`
    })
  }

  // Columns for active signals table
  const activeSignalsColumns = [
    {
      title: 'Coin',
      dataIndex: 'coinName',
      key: 'coinName',
      render: (text, record) => (
        <span>
          {text} ({record.symbol})
        </span>
      )
    },
    {
      title: 'Signal',
      dataIndex: 'signalType',
      key: 'signalType',
      render: (text) => (
        <Badge
          status={text === 'buy' ? 'success' : 'error'}
          text={text.toUpperCase()}
          style={{
            backgroundColor: text === 'buy' ? '#f6ffed' : '#fff1f0',
            padding: '4px 8px',
            borderRadius: '4px',
            color: text === 'buy' ? '#52c41a' : '#f5222d',
            border: `1px solid ${text === 'buy' ? '#b7eb8f' : '#ffa39e'}`
          }}
        />
      )
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price.toLocaleString()}`
    },
    {
      title: 'Sharpe Ratio',
      dataIndex: 'sharpeRatio',
      key: 'sharpeRatio',
      render: (sr) => (
        <Tooltip title="Risk-adjusted return measure">
          <span>{sr} <InfoCircleOutlined style={{ fontSize: '12px', color: '#1890ff' }} /></span>
        </Tooltip>
      )
    },
    {
      title: 'Max Drawdown',
      dataIndex: 'maxDrawdown',
      key: 'maxDrawdown',
      render: (mdd) => (
        <Tooltip title="Maximum observed loss from peak to trough">
          <span>{mdd}% <InfoCircleOutlined style={{ fontSize: '12px', color: '#1890ff' }} /></span>
        </Tooltip>
      )
    },
    {
      title: 'Trade Frequency',
      dataIndex: 'tradeFrequency',
      key: 'tradeFrequency',
      render: (tf) => (
        <Tooltip title="Percentage of trades per data row">
          <span>{tf}% <InfoCircleOutlined style={{ fontSize: '12px', color: '#1890ff' }} /></span>
        </Tooltip>
      )
    },
    {
      title: 'Confidence',
      dataIndex: 'confidence',
      key: 'confidence',
      render: (confidence) => {
        let color = 'orange'
        if (parseFloat(confidence) >= 80) color = 'green'
        else if (parseFloat(confidence) < 50) color = 'red'

        return (
          <span style={{ color }}>{confidence}%</span>
        )
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div>
          <Button
            type="primary"
            size="small"
            style={{ marginRight: '8px' }}
            onClick={() => handleExecuteSignal(record.id)}
          >
            Execute
          </Button>
          <Button
            size="small"
            onClick={() => handleDismissSignal(record.id)}
          >
            Dismiss
          </Button>
        </div>
      )
    }
  ]

  // Columns for signal history table
  const historyColumns = [
    {
      title: 'Coin',
      dataIndex: 'coinName',
      key: 'coinName',
      render: (text, record) => (
        <span>
          {text} ({record.symbol})
        </span>
      )
    },
    {
      title: 'Signal',
      dataIndex: 'signalType',
      key: 'signalType',
      render: (text) => (
        <Badge
          status={text === 'buy' ? 'success' : 'error'}
          text={text.toUpperCase()}
        />
      )
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price.toLocaleString()}`
    },
    {
      title: 'Sharpe Ratio',
      dataIndex: 'sharpeRatio',
      key: 'sharpeRatio'
    },
    {
      title: 'Confidence',
      dataIndex: 'confidence',
      key: 'confidence',
      render: (confidence) => `${confidence}%`
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

  return (
    <Layout style={{ padding: '24px' }}>
      <Content>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2>Trading Signal Alerts</h2>
          <div>
            <span style={{ marginRight: '12px' }}>
              Notifications:
            </span>
            <Switch
              checked={notificationsEnabled}
              onChange={toggleNotifications}
              checkedChildren={<BellFilled />}
              unCheckedChildren={<BellOutlined />}
            />
          </div>
        </div>

        <Alert
          message="Signal Criteria"
          description={
            <ul style={{ margin: '0 0 0 20px', padding: 0 }}>
              <li>Sharpe Ratio (SR) ≥ 1.8 (Ensures risk-adjusted returns are sufficiently high)</li>
              <li>Maximum Drawdown (MDD) ≥ -40% (Limits downside risk exposure)</li>
              <li>Trade Frequency ≥ 3% per data row (Ensures sufficient trading activity)</li>
            </ul>
          }
          type="info"
          showIcon
          style={{ marginBottom: '24px' }}
        />

        <Tabs defaultActiveKey="active">
          <TabPane
            tab={
              <span>
                Active Signals
                <Badge
                  count={activeSignals.length}
                  style={{ marginLeft: '8px', backgroundColor: activeSignals.length > 0 ? '#1890ff' : '#d9d9d9' }}
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
                locale={{ emptyText: 'No active trading signals' }}
              />
            </Card>
          </TabPane>

          <TabPane tab="Signal History" key="history">
            <Card>
              <Table
                dataSource={signalHistory}
                columns={historyColumns}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                locale={{ emptyText: 'No signal history available' }}
              />
            </Card>
          </TabPane>
        </Tabs>
      </Content>
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
