import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCoinMarketDetails } from '../../redux_actions'
import { useParams } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Layout, Typography, Spin } from 'antd'

const { Content } = Layout
const { Title } = Typography

const ReactCoinDetailSummary = () => {
  const { coinId } = useParams()
  const dispatch = useDispatch()
  const chartData = useSelector(state => state.coin_market_details[coinId])

  useEffect(() => {
    dispatch(fetchCoinMarketDetails(coinId))
  }, [dispatch, coinId])

  if (!chartData) return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />

  const formattedData = chartData.prices.map(price => ({
    date: new Date(price[0]).toLocaleDateString(),
    price: price[1]
  }))

  return (
    <Layout style={{ padding: '1rem' }}>
      <Content>
        <Title level={2}>Price History (Last 7 Days)</Title>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <XAxis dataKey="date" />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Content>
    </Layout>
  )
}

export default ReactCoinDetailSummary
