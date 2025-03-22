import React from 'react'
import {
  Card,
  Button,
  Typography,
  Space,
  Divider,
  Row,
  Col,
  Alert,
  Statistic
} from 'antd'
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons'
import bitcoinImage from '../../images/charts/bitcoin.png'
import ethereumImage from '../../images/charts/ethereum.jpg'
import altcoinImage from '../../images/charts/altcoin.jpg'

const { Title, Paragraph, Text } = Typography

const TradingChallenge = ({
  challenge,
  onSubmit,
  answer,
  correct,
  showFeedback,
  completed,
  onClose
}) => {
  const chartData = challenge.chartData.labels.map((label, index) => ({
    name: label,
    price: challenge.chartData.prices[index]
  }))

  const renderFeedback = () => {
    if (!showFeedback) return null

    return (
      <div style={{ marginTop: 20 }}>
        <Alert
          message={correct ? 'Correct Prediction!' : 'Incorrect Prediction'}
          description={
            <div>
              <Paragraph>
                <Text strong>Market movement: </Text>
                <Text>{challenge.correctAnswer === 'up' ? 'Uptrend' : 'Downtrend'}</Text>
              </Paragraph>
              <Paragraph>
                <Text strong>Analysis: </Text>
                <Text>{challenge.analysis}</Text>
              </Paragraph>
              {correct && (
                <Statistic
                  value={challenge.tokens}
                  prefix={<TrophyOutlined />}
                  suffix="tokens earned"
                  valueStyle={{ color: '#3f8600' }}
                />
              )}
            </div>
          }
          type={correct ? 'success' : 'error'}
          showIcon
          icon={correct ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
        />
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <Button type="primary" onClick={onClose}>Continue</Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Card>
        <Row gutter={24}>
          <Col xs={24} md={16}>
            <div style={{ height: 250, background: '#f0f2f5', padding: 10, marginBottom: 20 }}>
              <img
                src={challenge.image}
                alt={`${challenge.title} chart`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: '4px'
                }}
              />
              <div style={{ textAlign: 'center', marginTop: 5 }}>
                Price range: ${Math.min(...challenge.chartData.prices)} - ${Math.max(...challenge.chartData.prices)}
              </div>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <Card title="Challenge Details" size="small">
              <Paragraph>
                <Text strong>Difficulty: </Text>
                <Text>{challenge.difficulty}</Text>
              </Paragraph>
              <Paragraph>
                <Text strong>Time Frame: </Text>
                <Text>{challenge.timeFrame}</Text>
              </Paragraph>
              <Paragraph>
                <Text strong>Reward: </Text>
                <Text>{challenge.tokens} tokens</Text>
              </Paragraph>
            </Card>
          </Col>
        </Row>

        <Divider />

        <Title level={4}>{challenge.description}</Title>

        {!completed
          ? (
            <Space size="large" style={{ marginTop: 20 }}>
              <Button
                type="primary"
                size="large"
                icon={<ArrowUpOutlined />}
                onClick={() => onSubmit('up')}
                style={{ minWidth: 120 }}
              >
              Uptrend
              </Button>
              <Button
                type="primary"
                danger
                size="large"
                icon={<ArrowDownOutlined />}
                onClick={() => onSubmit('down')}
                style={{ minWidth: 120 }}
              >
              Downtrend
              </Button>
            </Space>
          )
          : renderFeedback()}
      </Card>
    </div>
  )
}

export default TradingChallenge
