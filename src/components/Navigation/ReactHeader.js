import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Layout, Menu, Badge, Row, Col, Dropdown } from 'antd'
import { iconStyle } from '../../styles'
import {
  HomeOutlined,
  AreaChartOutlined,
  UserOutlined,
  TrophyOutlined,
  StarOutlined,
  DollarOutlined,
  RiseOutlined,
  DownOutlined
} from '@ant-design/icons'
import logoImage from '../../images/logo/logo.png'
import { connect } from 'react-redux'
import { setHeaderMenuItem } from '../../redux_actions'

const { Header } = Layout

class ReactHeader extends Component {
  render () {
    const { selected } = this.props

    const dashboardMenu = (
      <Menu>
        <Menu.Item key="coin-list" icon={<DollarOutlined style={iconStyle} />}>
          <Link to="/coins" onClick={() => this.props.setHeaderMenuItem('dashboard')}>
            Coin Listing
          </Link>
        </Menu.Item>
        <Menu.Item key="trending-coins" icon={<RiseOutlined style={iconStyle} />}>
          <Link to="/trending-coins" onClick={() => this.props.setHeaderMenuItem('dashboard')}>
            Trending Coins
          </Link>
        </Menu.Item>
      </Menu>
    )

    const leftMenuItems = [
      {
        key: 'home',
        label: (
          <Link to="/" onClick={() => this.props.setHeaderMenuItem('home')}>
            <HomeOutlined style={iconStyle} />Home
          </Link>
        )
      },
      {
        key: 'dashboard',
        label: (
          <Dropdown overlay={dashboardMenu} placement="bottomCenter">
            <span className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              <AreaChartOutlined style={iconStyle} />Dashboard <DownOutlined />
            </span>
          </Dropdown>
        )
      },
      {
        key: 'watchlist',
        label: (
          <Link to="/watchlist" onClick={() => this.props.setHeaderMenuItem('watchlist')}>
            <StarOutlined style={iconStyle} />My Watchlist
          </Link>
        )
      },
      {
        key: 'rewards',
        label: (
          <Link to="/rewards" onClick={() => this.props.setHeaderMenuItem('rewards')}>
            <TrophyOutlined style={iconStyle} />Rewards
          </Link>
        )
      },
      {
        key: 'gamification',
        label: (
          <Link to="/gamification" onClick={() => this.props.setHeaderMenuItem('gamification')}>
            <StarOutlined style={iconStyle} />Gamification
          </Link>
        )
      }
    ]

    const rightMenuItems = [
      {
        key: 'profile',
        label: (
          <Link to="/profile" onClick={() => this.props.setHeaderMenuItem('profile')}>
            <Badge count={this.props.userTokens > 0 ? this.props.userTokens : 0} offset={[10, 0]}>
              <UserOutlined style={{ ...iconStyle, fontSize: '18px' }} />
            </Badge>
          </Link>
        )
      }
    ]

    return (
      <Header className="header">
        <Row justify="space-between" align="middle">
          <Col>
            <Row align="middle">
              <Col>
                <Link to="/" onClick={() => this.props.setHeaderMenuItem('home')}>
                  <img
                    alt="daniel corcorans crypto react app logo"
                    style={{ maxHeight: '50px', marginRight: '24px' }}
                    src={logoImage}
                  />
                </Link>
              </Col>
              <Col>
                <Menu
                  theme="dark"
                  mode="horizontal"
                  selectedKeys={[selected]}
                  style={{ border: 'none' }}
                  items={leftMenuItems}
                />
              </Col>
            </Row>
          </Col>
          <Col>
            <Menu
              theme="dark"
              mode="horizontal"
              selectedKeys={[selected]}
              style={{ border: 'none' }}
              items={rightMenuItems}
            />
          </Col>
        </Row>
      </Header>
    )
  }
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
