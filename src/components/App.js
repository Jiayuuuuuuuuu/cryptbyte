import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { Layout } from 'antd'
import ReactHeader from './Navigation/ReactHeader'
import ReactFooter from './Navigation/ReactFooter'
import ReactCoinsList from './Coins/ReactCoinsList'
import ReactCoinsDetail from './Coins/ReactCoinsDetail'
import ReactHome from './General/ReactHome'
import ReactTrendingCoins from './Coins/ReactTrendingCoins'
import ReactWatchlist from './Watchlist/ReactWatchlist'
import ProfilePage from './Profile/ProfilePage'
import RewardsPage from './Rewards/RewardsPage'
import CoursesPage from './Courses/LearningCourses'
import GamePage from './Gamification/GamePage'
import TradingSignals from './Signals/TradingSignals'
import ReactCommunity from './Community/ReactCommunity'
import PostDetail from './Community/PostDetail'
import CreatePost from './Community/CreatePost'

export default class App extends Component {
  render () {
    return (
      <Layout style={{ minHeight: '100vh', lineHeight: '1.6rem' }}>
        <ReactHeader/>
        <Layout>
          <Switch>
            <Route path='/' exact component={ReactHome}/>
            <Route path='/trending-coins' exact component={ReactTrendingCoins}/>
            <Route path='/coins' exact component={ReactCoinsList}/>
            <Route path='/coins/:coinId/' exact component={ReactCoinsDetail}/>
            <Route path="/profile" component={ProfilePage}/>
            <Route path="/rewards" component={RewardsPage}/>
            <Route path='/watchlist' exact component={ReactWatchlist}/>
            <Route path='/course' exact component={CoursesPage}/>
            <Route path='/game' exact component={GamePage}/>
            <Route path='/signals' exact component={TradingSignals}/>
            <Route path='/community' exact component={ReactCommunity}/>
            <Route path='/community/post/:postId' component={PostDetail}/>
            <Route path='/community/create' component={CreatePost}/>
          </Switch>
        </Layout>
        <ReactFooter/>
      </Layout>
    )
  }
}
