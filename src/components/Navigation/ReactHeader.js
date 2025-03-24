import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Layout, Menu, Badge, Row, Col, Dropdown, Button, Drawer } from 'antd'
import { connect } from 'react-redux'
import { setHeaderMenuItem } from '../../redux_actions'
import {
  HomeOutlined,
  AreaChartOutlined,
  UserOutlined,
  TrophyOutlined,
  StarOutlined,
  DollarOutlined,
  RiseOutlined,
  DownOutlined,
  MenuOutlined,
  BookOutlined,
  CloseOutlined,
  TeamOutlined,
  PlayCircleOutlined,
  BellOutlined
} from '@ant-design/icons'
import logoImage from '../../images/logo/logo.png'

const { Header } = Layout

const ReactHeader = (props) => {
  const { selected, userTokens } = props
  const [visible, setVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024)

  // Monitor window size for responsive changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const showDrawer = () => {
    setVisible(true)
  }

  const onClose = () => {
    setVisible(false)
  }

  const handleMenuClick = (key) => {
    props.setHeaderMenuItem(key)
    if (isMobile) {
      setVisible(false)
    }
  }

  const iconStyle = {
    marginRight: 8,
    fontSize: '16px'
  }

  const dashboardMenu = (
    <Menu>
      <Menu.Item key="coin-list" icon={<DollarOutlined style={iconStyle} />}>
        <Link to="/coins" onClick={() => handleMenuClick('dashboard')}>
          Coin Listing
        </Link>
      </Menu.Item>
      <Menu.Item key="trending-coins" icon={<RiseOutlined style={iconStyle} />}>
        <Link to="/trending-coins" onClick={() => handleMenuClick('dashboard')}>
          Trending Coins
        </Link>
      </Menu.Item>
    </Menu>
  )

  const leftMenuItems = [
    {
      key: 'home',
      icon: <HomeOutlined style={iconStyle} />,
      label: (
        <Link to="/" onClick={() => handleMenuClick('home')}>
          Home
        </Link>
      )
    },
    {
      key: 'dashboard',
      icon: <AreaChartOutlined style={iconStyle} />,
      label: (
        <Dropdown overlay={dashboardMenu} placement="bottomCenter">
          <span className="ant-dropdown-link" onClick={e => e.preventDefault()}>
            Dashboard <DownOutlined />
          </span>
        </Dropdown>
      )
    },
    {
      key: 'watchlist',
      icon: <StarOutlined style={iconStyle} />,
      label: (
        <Link to="/watchlist" onClick={() => handleMenuClick('watchlist')}>
          Watchlist
        </Link>
      )
    },
    {
      key: 'signals',
      icon: <BellOutlined style={iconStyle} />,
      label: (
        <Link to="/signals" onClick={() => handleMenuClick('signals')}>
          Trading Signals
        </Link>
      )
    },
    {
      key: 'course',
      icon: <BookOutlined style={iconStyle} />,
      label: (
        <Link to="/course" onClick={() => handleMenuClick('course')}>
          Course
        </Link>
      )
    },
    {
      key: 'gamification',
      icon: <PlayCircleOutlined style={iconStyle} />,
      label: (
        <Link to="/game" onClick={() => handleMenuClick('gamification')}>
          Gamification
        </Link>
      )
    },
    {
      key: 'community',
      icon: <TeamOutlined style={iconStyle} />,
      label: (
        <Link to="/community" onClick={() => handleMenuClick('community')}>
          Community
        </Link>
      )
    }
  ]

  const profileItem = {
    key: 'profile',
    label: (
      <Link to="/profile" onClick={() => handleMenuClick('profile')}>
        <UserOutlined style={{ fontSize: '18px' }} />
      </Link>
    )
  }

  const mobileMenuItems = [
    ...leftMenuItems,
    { type: 'divider' },
    {
      key: 'profile',
      icon: <UserOutlined style={iconStyle} />,
      label: (
        <Link to="/profile" onClick={() => handleMenuClick('profile')}>
          Profile
        </Link>
      )
    }
  ]

  return (
    <Header className="header"
      style=
        {{
          padding: '0 20px',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          width: '100%'
        }}>
      <Row justify="space-between" align="middle" style={{ width: '100%' }}>
        <Col>
          <Row align="middle">
            <Col>
              <Link to="/" onClick={() => handleMenuClick('home')}>
                <img
                  alt="Trading Strategy App Logo"
                  style={{ maxHeight: '40px', marginRight: '16px' }}
                  src={logoImage}
                />
              </Link>
            </Col>
            {!isMobile && (
              <Col>
                <Menu
                  theme="dark"
                  mode="horizontal"
                  selectedKeys={[selected]}
                  style={{ border: 'none' }}
                  items={leftMenuItems}
                />
              </Col>
            )}
          </Row>
        </Col>
        <Col>
          {!isMobile
            ? (
              <Link to="/profile" onClick={() => handleMenuClick('profile')} className="profile-link">
                <UserOutlined style={{ fontSize: '20px', color: '#fff', marginRight: '20px' }} />
              </Link>
            )
            : (
              <Button
                type="text"
                onClick={showDrawer}
                style={{ border: 'none', padding: '0 15px' }}
              >
                <MenuOutlined style={{ fontSize: '20px', color: '#fff' }} />
              </Button>
            )}
          <Drawer
            title="Menu"
            placement="right"
            closable={true}
            onClose={onClose}
            open={visible}
            visible={visible}
            width={280}
            bodyStyle={{ padding: 0 }}
            destroyOnClose={true}
          >
            <Menu
              theme="light"
              mode="vertical"
              selectedKeys={[selected]}
              style={{ height: '100%', borderRight: 0 }}
              items={mobileMenuItems}
            />
          </Drawer>
        </Col>
      </Row>
    </Header>
  )
}

const mapStateToProps = (state) => {
  return {
    selected: state.header_selected,
    userTokens: state.user ? state.user.tokens : 0
  }
}

const mapActionsToProps = {
  setHeaderMenuItem
}

export default connect(mapStateToProps, mapActionsToProps)(ReactHeader)
