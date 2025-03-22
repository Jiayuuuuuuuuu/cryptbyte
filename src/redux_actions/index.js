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
export const GET_COURSES = 'GET_COURSES'
export const GET_COURSE_DETAILS = 'GET_COURSE_DETAILS'
export const UPDATE_COURSE_PROGRESS = 'UPDATE_COURSE_PROGRESS'

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

// Add this to your redux_actions.js file or wherever your action creators are defined
export const fetchCourses = () => {
  // For now, we'll return a fake list of courses
  const mockCourses = [
    {
      id: 1,
      title: 'Cryptocurrency Basics',
      description: 'Learn the fundamentals of blockchain and cryptocurrency trading',
      level: 'Beginner',
      duration: '2 hours',
      modules: 5,
      unlocked: true
    },
    {
      id: 2,
      title: 'Technical Analysis',
      description: 'Master chart reading and technical indicators for crypto markets',
      level: 'Intermediate',
      duration: '4 hours',
      modules: 8,
      unlocked: true
    },
    {
      id: 3,
      title: 'Advanced Trading Strategies',
      description: 'Learn complex trading strategies for cryptocurrency markets',
      level: 'Advanced',
      duration: '6 hours',
      modules: 10,
      unlocked: false
    }
  ]

  return {
    type: 'GET_COURSES',
    payload: mockCourses
  }
}

export const getCourseDetails = (courseId) => {
  // Create different modules based on the courseId
  let modules = []

  if (courseId === 1) { // Cryptocurrency Basics
    modules = [
      {
        id: 1,
        title: 'Introduction to Blockchain',
        description: 'Understand the fundamentals of blockchain technology',
        completed: true
      },
      {
        id: 2,
        title: 'Cryptocurrency Wallets',
        description: 'Learn how to securely store your digital assets',
        completed: false
      },
      {
        id: 3,
        title: 'Exchanges and Trading Basics',
        description: 'Navigate cryptocurrency exchanges and understand order types',
        completed: false
      }
    ]
  } else if (courseId === 2) { // Technical Analysis
    modules = [
      {
        id: 1,
        title: 'Chart Patterns',
        description: 'Identify and interpret common chart patterns',
        completed: true
      },
      {
        id: 2,
        title: 'Technical Indicators',
        description: 'Learn to use RSI, MACD, and other key indicators',
        completed: false
      },
      {
        id: 3,
        title: 'Trend Analysis',
        description: 'Understand market trends and how to trade with them',
        completed: false
      }
    ]
  } else if (courseId === 3) { // Advanced Trading Strategies
    modules = [
      {
        id: 1,
        title: 'Risk Management',
        description: 'Advanced techniques for managing trading risk',
        completed: false
      },
      {
        id: 2,
        title: 'Algorithmic Trading',
        description: 'Introduction to automated trading strategies',
        completed: false
      },
      {
        id: 3,
        title: 'Portfolio Optimization',
        description: 'Balance your crypto portfolio for maximum returns',
        completed: false
      }
    ]
  }

  // Mock course details with unique modules
  const mockCourseDetails = {
    id: courseId,
    title: courseId === 1 ? 'Cryptocurrency Basics' : courseId === 2 ? 'Technical Analysis' : 'Advanced Trading Strategies',
    description: 'Comprehensive course on cryptocurrency trading fundamentals.',
    level: courseId === 1 ? 'Beginner' : courseId === 2 ? 'Intermediate' : 'Advanced',
    duration: courseId === 1 ? '2 hours' : courseId === 2 ? '4 hours' : '6 hours',
    modules
  }

  return {
    type: 'GET_COURSE_DETAILS',
    payload: mockCourseDetails
  }
}

export const updateCourseProgress = (courseId, moduleId, completed) => {
  return {
    type: 'UPDATE_COURSE_PROGRESS',
    payload: { courseId, moduleId, completed }
  }
}
