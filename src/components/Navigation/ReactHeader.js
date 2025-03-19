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
  MenuOutlined
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
          My Watchlist
        </Link>
      )
    },
    {
      key: 'rewards',
      icon: <TrophyOutlined style={iconStyle} />,
      label: (
        <Link to="/rewards" onClick={() => handleMenuClick('rewards')}>
          Rewards
        </Link>
      )
    },
    {
      key: 'gamification',
      icon: <StarOutlined style={iconStyle} />,
      label: (
        <Link to="/gamification" onClick={() => handleMenuClick('gamification')}>
          Gamification
        </Link>
      )
    }
  ]

  const profileItem = {
    key: 'profile',
    label: (
      <Link to="/profile" onClick={() => handleMenuClick('profile')}>
        {/* Badge removed from here */}
        <UserOutlined style={{ fontSize: '18px' }} />
      </Link>
    )
  }

  // All menu items for mobile drawer including profile
  const mobileMenuItems = [
    ...leftMenuItems,
    { type: 'divider' },
    {
      key: 'coin-list',
      icon: <DollarOutlined style={iconStyle} />,
      label: (
        <Link to="/coins" onClick={() => handleMenuClick('dashboard')}>
          Coin Listing
        </Link>
      )
    },
    {
      key: 'trending-coins',
      icon: <RiseOutlined style={iconStyle} />,
      label: (
        <Link to="/trending-coins" onClick={() => handleMenuClick('dashboard')}>
          Trending Coins
        </Link>
      )
    },
    { type: 'divider' },
    {
      key: 'profile',
      icon: <UserOutlined style={iconStyle} />,
      label: (
        <Link to="/profile" onClick={() => handleMenuClick('profile')}>
          Profile {/* Token count removed from here */}
        </Link>
      )
    }
  ]

  return (
    <Header className="header" style={{ padding: '0 20px' }}>
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
            {isMobile && (
              <Col>
                <Link to="/" onClick={() => handleMenuClick('home')}>
                  <Button type="text" style={{ color: '#fff', fontSize: '16px', padding: '0 10px' }}>
                    <HomeOutlined style={iconStyle} />Home
                  </Button>
                </Link>
              </Col>
            )}
          </Row>
        </Col>
        <Col>
          {!isMobile
            ? (
              <Link to="/profile" onClick={() => handleMenuClick('profile')} className="profile-link">
                {/* Badge removed from here */}
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
            width={280}
            bodyStyle={{ padding: 0 }}
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
    userTokens: state.user ? state.user.tokens : 0 // You can keep this for other uses if needed
  }
}

const mapActionsToProps = {
  setHeaderMenuItem
}

export default connect(mapStateToProps, mapActionsToProps)(ReactHeader)
