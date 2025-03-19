import coinGecko from '../API'
export const GET_COIN_LIST = 'GET_COIN_LIST'
export const GET_COIN_DETAILS = 'GET_COIN_DETAILS'
export const GET_COIN_CHART = 'GET_COIN_CHART'
export const GET_EVENT_LIST = 'GET_EVENT_LIST'
export const SET_HEADER_MENU_ITEM = 'SET_HEADER_MENU_ITEM'
export const SET_SIDER_MENU_ITEM = 'SET_SIDER_MENU_ITEM'
export const GET_TRENDING_COINS = 'GET_TRENDING_COINS'
export const SET_COIN_FETCHED_TIME = 'SET_COIN_FETCHED_TIME'
export const ADD_TO_WATCHLIST = 'ADD_TO_WATCHLIST'
export const REMOVE_FROM_WATCHLIST = 'REMOVE_FROM_WATCHLIST'
export * from './userActions'

export const addToWatchlist = (coin) => (dispatch, getState) => {
  dispatch({ type: ADD_TO_WATCHLIST, payload: coin })
}

export const removeFromWatchlist = (coinId) => (dispatch, getState) => {
  dispatch({ type: REMOVE_FROM_WATCHLIST, payload: coinId })
}

export const fetchTrendingCoins = () => async (dispatch, getState) => {
  const response = await coinGecko.get('/search/trending')
  dispatch({
    type: GET_TRENDING_COINS,
    payload: response.data
  })
}

export const fetchCoins = () => async (dispatch, getState) => {
  const { lastFetched } = getState().coins

  if (lastFetched && Date.now() - lastFetched < 60000) {
    console.log('Using cached coin data.')
    return
  }

  try {
    const response = await coinGecko.get('/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 50,
        page: 1,
        sparkline: false,
        price_change_percentage: '24h'
      }
    })

    dispatch({ type: GET_COIN_LIST, payload: response.data })
    dispatch({ type: SET_COIN_FETCHED_TIME, payload: Date.now() })
  } catch (error) {
    console.error('Error fetching coin list:', error)
  }
}

export const fetchCoinDetails = (coinId) => async (dispatch, getState) => {
  const response = await coinGecko.get(`coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=true&sparkline=false&developer_data=true`)
  dispatch({
    type: GET_COIN_DETAILS,
    payload: response.data
  })
}

export const fetchCoinMarketDetails = (coinId) => async (dispatch) => {
  try {
    const response = await coinGecko.get(`/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days: 7
      }
    })

    dispatch({
      type: GET_COIN_CHART,
      payload: { coinId, data: response.data }
    })
  } catch (error) {
    console.error('Error fetching coin market details:', error)
  }
}

export const fetchEvents = () => async (dispatch, getState) => {
  const response = await coinGecko.get('/events')
  dispatch({
    type: GET_EVENT_LIST,
    payload: response.data
  })
}

export const setHeaderMenuItem = (item) => {
  return {
    type: SET_HEADER_MENU_ITEM,
    payload: { item }
  }
}

export const setSiderMenuItem = (item) => {
  return {
    type: SET_SIDER_MENU_ITEM,
    payload: { item }
  }
}
