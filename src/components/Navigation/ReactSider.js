import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Layout, Menu, Button } from 'antd'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DollarOutlined
} from '@ant-design/icons'
import { connect } from 'react-redux'

const { Sider } = Layout

class ReactSider extends Component {
  state = {
    collapsed: false
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  render () {
    return (
      <React.Fragment>
        <Sider
          breakpoint="md"
          collapsedWidth="0"
          width={240}
          style={{ background: '#fff' }}
          collapsed={this.state.collapsed}
          collapsible
          trigger={null}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px' }}>
            <Button
              type="text"
              onClick={this.toggleCollapsed}
              style={{ marginBottom: 16 }}
            >
              {this.state.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
          </div>
          <Menu
            mode="inline"
            selectedKeys={[this.props.sider_selected]}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item key="coin-list" icon={<DollarOutlined />}>
              <Link to="/coins">Coin Listing</Link>
            </Menu.Item>
            <Menu.Item key="trending-coins" icon={<DollarOutlined />}>
              <Link to="/trending-coins">Trending Coins</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        {/* Add mobile-only toggle button */}
        {this.state.collapsed && (
          <Button
            type="primary"
            onClick={this.toggleCollapsed}
            style={{
              position: 'fixed',
              bottom: '20px',
              left: '20px',
              zIndex: 1000,
              display: window.innerWidth <= 768 ? 'block' : 'none'
            }}
            icon={<MenuUnfoldOutlined />}
          />
        )}
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    sider_selected: state.sider_selected
  }
}

export default connect(mapStateToProps)(ReactSider)
