import React, { useState, useEffect } from 'react'
import { Typography, Steps, Button, Card, Tabs, Collapse, Divider } from 'antd'
import {
  PlayCircleOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  ExperimentOutlined,
  TrophyOutlined
} from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography
const { Step } = Steps
const { TabPane } = Tabs
const { Panel } = Collapse

const ModuleContent = ({ module, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    setCurrentStep(0)
  }, [module.id])

  const steps = [
    {
      title: 'Video Lesson',
      icon: <PlayCircleOutlined />,
      content: (
        <Card>
          <div style={{ background: '#f0f2f5', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PlayCircleOutlined style={{ fontSize: 64 }} />
            <Text style={{ marginLeft: 16 }}>Video player would appear here</Text>
          </div>
          <Divider />
          <Title level={4}>Key Takeaways</Title>
          <ul>
            <li>Understanding market volatility in cryptocurrency</li>
            <li>Identifying potential entry and exit points</li>
            <li>Reading and interpreting candlestick patterns</li>
            <li>Using technical indicators effectively</li>
          </ul>
        </Card>
      )
    },
    {
      title: 'Reading Material',
      icon: <FileTextOutlined />,
      content: (
        <Card>
          <Title level={4}>Essential Trading Concepts</Title>
          <Paragraph>
            Trading in cryptocurrency markets requires understanding several key concepts. This reading material
            expands on the video lesson and provides deeper insights into market dynamics.
          </Paragraph>

          <Collapse defaultActiveKey={['1']}>
            <Panel header="Market Structure" key="1">
              <Paragraph>
                Market structure refers to the organizational characteristics of a market. In cryptocurrency,
                this includes exchanges, order types, liquidity, and market participants. Understanding market
                structure is crucial for developing effective trading strategies.
              </Paragraph>
            </Panel>
            <Panel header="Technical Analysis Fundamentals" key="2">
              <Paragraph>
                Technical analysis involves studying price movements and patterns to predict future price action.
                Key components include chart patterns, support and resistance levels, and technical indicators.
              </Paragraph>
            </Panel>
            <Panel header="Risk Management Principles" key="3">
              <Paragraph>
                Proper risk management is essential for long-term trading success. This includes position sizing,
                stop-loss placement, and portfolio allocation strategies to protect capital while maximizing potential returns.
              </Paragraph>
            </Panel>
          </Collapse>
        </Card>
      )
    },
    {
      title: 'Practical Exercise',
      icon: <ExperimentOutlined />,
      content: (
        <Card>
          <Title level={4}>Trading Simulation</Title>
          <Paragraph>
            Apply what you&pos;ve learned through our virtual trading simulator. This risk-free environment
            allows you to practice implementing strategies without using real capital.
          </Paragraph>

          <div style={{ background: '#f0f2f5', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Text>Trading simulator interface would appear here</Text>
          </div>

          <Button type="primary" size="large" block>Launch Simulator</Button>
        </Card>
      )
    },
    {
      title: 'Assessment',
      icon: <QuestionCircleOutlined />,
      content: (
        <Card>
          <Title level={4}>Module Quiz</Title>
          <Paragraph>
            Test your understanding of the key concepts covered in this module. You need to score at least
            70% to successfully complete this module.
          </Paragraph>

          <div style={{ marginTop: 24 }}>
            <Title level={5}>Sample Question 1:</Title>
            <Paragraph>Which of the following is NOT a common candlestick pattern?</Paragraph>
            <Button style={{ display: 'block', marginBottom: 8 }}>A) Doji</Button>
            <Button style={{ display: 'block', marginBottom: 8 }}>B) Hammer</Button>
            <Button style={{ display: 'block', marginBottom: 8 }}>C) Triangle Reversal</Button>
            <Button style={{ display: 'block', marginBottom: 8 }}>D) Engulfing Pattern</Button>
          </div>

          <Divider />
          <Button type="primary" size="large" block>Start Full Quiz</Button>
        </Card>
      )
    }
  ]

  const next = () => {
    setCurrentStep(currentStep + 1)
  }

  const prev = () => {
    setCurrentStep(currentStep - 1)
  }

  return (
    <div className="module-content">
      <Title level={3}>{module.title}</Title>

      <Steps current={currentStep} style={{ marginBottom: 24 }}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} icon={item.icon} />
        ))}
      </Steps>

      <div className="steps-content" style={{ marginBottom: 24 }}>
        {steps[currentStep].content}
      </div>

      <div className="steps-action" style={{ display: 'flex', justifyContent: 'space-between' }}>
        {currentStep > 0 && (
          <Button onClick={prev}>Previous</Button>
        )}
        {currentStep < steps.length - 1 && (
          <Button type="primary" onClick={next}>Next</Button>
        )}
        {currentStep === steps.length - 1 && (
          <Button
            type="primary"
            onClick={onComplete}
            icon={<TrophyOutlined />}
          >
            Complete Module
          </Button>
        )}
      </div>
    </div>
  )
}

export default ModuleContent
