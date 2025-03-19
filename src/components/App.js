import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom' // ✅ Import Switch
import { Layout } from 'antd'
import ReactHeader from './Navigation/ReactHeader'
import ReactFooter from './Navigation/ReactFooter'
import ReactCoinsList from './Coins/ReactCoinsList'
import ReactCoinsDetail from './Coins/ReactCoinsDetail'
import ReactHome from './General/ReactHome'
import ReactGlobal from './Global/ReactGlobal'
import ReactExchangesList from './Exchanges/ReactExchangesList'
import ReactExchangeRates from './ExchangeRates/ReactExchangeRates'
import ReactTrendingCoins from './Coins/ReactTrendingCoins'
import ReactAssetPlatforms from './AssetPlatforms/ReactAssetPlatforms'
import ReactWatchlist from './Watchlist/ReactWatchlist'
import ProfilePage from './Profile/ProfilePage'
import RewardsPage from './Rewards/RewardsPage'
import GamePage from './Gamification/GamePage'

export default class App extends Component {
  render () {
    return (
      <Layout style={{ minHeight: '100vh', lineHeight: '1.6rem' }}>
        <ReactHeader/>
        <Layout>
          <Switch> {/* ✅ Wrap Routes in Switch */}
            <Route path='/' exact component={ReactHome}/>
            <Route path='/trending-coins' exact component={ReactTrendingCoins}/>
            <Route path='/coins' exact component={ReactCoinsList}/>
            <Route path='/coins/:coinId/' exact component={ReactCoinsDetail}/>
            <Route path='/exchanges/list' exact component={ReactExchangesList}/>
            <Route path='/global' exact component={ReactGlobal}/>
            <Route path='/exchange-rates' exact component={ReactExchangeRates}/>
            <Route path='/asset-platforms' exact component={ReactAssetPlatforms}/>
            <Route path="/profile" component={ProfilePage}/>
            <Route path="/rewards" component={RewardsPage}/>
            <Route path='/watchlist' exact component={ReactWatchlist}/> {/* ✅ Watchlist page is now visible */}
            <Route path='/game' exact component={GamePage}/>
          </Switch>
        </Layout>
        <ReactFooter/>
      </Layout>
    )
  }
}
