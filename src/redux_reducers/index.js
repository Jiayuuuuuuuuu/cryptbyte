import { combineReducers } from 'redux'
import { market_processed_table_keys } from '../constants'
import {
  GET_COIN_LIST,
  GET_COIN_DETAILS,
  GET_COIN_CHART,
  GET_EVENT_LIST,
  SET_HEADER_MENU_ITEM,
  SET_SIDER_MENU_ITEM,
  GET_TRENDING_COINS,
  SET_COIN_FETCHED_TIME
} from '../redux_actions'
import watchlistReducer from './watchlistReducer'
import userReducer from './userReducer'
import coursesReducer from './courseReducer'
import tradingSignalsReducer from './tradingSignalsReducer'

const initialState = {
  data: [],
  lastFetched: null // Store last fetch time
}

const coinsTrendingReducer = (state = [], action) => {
  switch (action.type) {
  case GET_TRENDING_COINS:
    return action.payload
  default:
    return state
  }
}

const coinsReducer = (state = initialState, action) => {
  switch (action.type) {
  case GET_COIN_LIST:
    return { ...state, data: action.payload }
  case SET_COIN_FETCHED_TIME:
    return { ...state, lastFetched: action.payload }
  default:
    return state
  }
}

const compileMarketData = (marketData) => {
  const data = {}
  for (let market_index = 0; market_index < market_processed_table_keys.length; market_index++) {
    const field = market_processed_table_keys[market_index]
    const entries = Object.entries(marketData[field])
    for (let i = 0; i < entries.length; i++) {
      const key = entries[i][0]
      const value = entries[i][1]
      if (Object.keys(data).includes(key)) {
        data[key] = { ...data[key], [field]: value, currency: key }
      } else {
        data[key] = { [field]: value, currency: key }
      }
    }
  }
  return Object.values(data)
}

const coinDetailsReducer = (state = {}, action) => {
  switch (action.type) {
  case GET_COIN_DETAILS: {
    const market_data_processed = compileMarketData(action.payload.market_data)
    return {
      ...state,
      [action.payload.id]: {
        ...action.payload,
        market_data_processed
      }
    }
  }
  default:
    return state
  }
}

const coinChartReducer = (state = {}, action) => {
  switch (action.type) {
  case GET_COIN_CHART:
    return {
      ...state,
      [action.payload.id]: action.payload.data
    }
  default:
    return state
  }
}

const eventsReducer = (state = [], action) => {
  switch (action.type) {
  case GET_EVENT_LIST:
    return action.payload
  default:
    return state
  }
}

const headerSelectedReducer = (state = 'home', action) => {
  switch (action.type) {
  case SET_HEADER_MENU_ITEM:
    return action.payload
  default:
    return state
  }
}

const siderSelectedReducer = (state = 'market', action) => {
  switch (action.type) {
  case SET_SIDER_MENU_ITEM:
    return action.payload
  default:
    return state
  }
}

export const rootReducer = combineReducers({
  coins: coinsReducer,
  coin_details: coinDetailsReducer,
  coin_chart: coinChartReducer,
  events: eventsReducer,
  header_selected: headerSelectedReducer,
  sider_selected: siderSelectedReducer,
  trending_coins: coinsTrendingReducer,
  watchlist: watchlistReducer,
  user: userReducer,
  courses: coursesReducer,
  tradingSignals: tradingSignalsReducer // Added the tradingSignals reducer
})
