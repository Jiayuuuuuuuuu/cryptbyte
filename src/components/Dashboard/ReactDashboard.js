import React, { useEffect, useState } from 'react';
import { Layout, Typography, Card, Table, Switch, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCoins } from '../../redux_actions'; // ✅ Import Redux action

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const ReactDashboard = () => {
  const dispatch = useDispatch();
  const coins = useSelector(state => state.coins.data); // ✅ Get market data from Redux
  const [tradeSignals, setTradeSignals] = useState([]);
  const [riskLevel, setRiskLevel] = useState('medium');
  const [autoTrade, setAutoTrade] = useState(false);

  useEffect(() => {
    dispatch(fetchCoins());
  }, [dispatch]);

  useEffect(() => {
    if (coins.length) {
      generateTradeSignals(coins);
    }
  }, [coins]);

  // ✅ Generate trade signals based on price trends
  const generateTradeSignals = (coins) => {
    const signals = coins.map(coin => ({
      key: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      price: `$${coin.current_price.toFixed(2)}`,
      signal: coin.price_change_percentage_24h > 0 ? 'BUY' : 'SELL'
    }));
    setTradeSignals(signals);
  };

  const tradeColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Symbol', dataIndex: 'symbol', key: 'symbol' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Signal', dataIndex: 'signal', key: 'signal', render: signal => (
      <span style={{ color: signal === 'BUY' ? 'green' : 'red' }}>{signal}</span>
    )}
  ];

  return (
    <Layout style={{ padding: '1rem' }}>
      <Content>
        <Title level={2}>📊 Market Dashboard</Title>

        {/* ✅ Real-time Market Data */}
        <Card style={{ marginBottom: '1rem' }}>
          <Title level={4}>Market Overview</Title>
          <p>Live cryptocurrency data is displayed below.</p>
          <Table
            bordered
            dataSource={tradeSignals}
            columns={tradeColumns}
            rowKey="key"
            pagination={{ pageSize: 10 }}
          />
        </Card>

        {/* ✅ Trade Signals Section */}
        <Card style={{ marginBottom: '1rem' }}>
          <Title level={4}>🔍 Trade Signals</Title>
          <p>Buy/Sell recommendations based on price trends.</p>
          <Table
            bordered
            dataSource={tradeSignals}
            columns={tradeColumns}
            rowKey="key"
            pagination={{ pageSize: 5 }}
          />
        </Card>

        {/* ✅ Settings Panel */}
        <Card>
          <Title level={4}>⚙️ Settings</Title>
          <p>Customize your trading preferences.</p>

          <div style={{ marginBottom: '1rem' }}>
            <strong>Risk Level:</strong>
            <Select value={riskLevel} onChange={setRiskLevel} style={{ width: 150, marginLeft: '1rem' }}>
              <Option value="low">Low</Option>
              <Option value="medium">Medium</Option>
              <Option value="high">High</Option>
            </Select>
          </div>

          <div>
            <strong>Auto-Trade:</strong>
            <Switch checked={autoTrade} onChange={setAutoTrade} style={{ marginLeft: '1rem' }} />
          </div>
        </Card>
      </Content>
    </Layout>
  );
};

export default ReactDashboard;
