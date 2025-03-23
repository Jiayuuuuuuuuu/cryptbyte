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
export const UPDATE_WATCHLIST_DATA = 'UPDATE_WATCHLIST_DATA'
export const GET_TRADING_SIGNALS = 'GET_TRADING_SIGNALS'
export const ADD_TRADING_SIGNAL = 'ADD_TRADING_SIGNAL'
export const UPDATE_TRADING_SIGNAL = 'UPDATE_TRADING_SIGNAL'
export const REMOVE_TRADING_SIGNAL = 'REMOVE_TRADING_SIGNAL'
export const GET_COMMUNITY_POSTS = 'GET_COMMUNITY_POSTS'
export const GET_POST_DETAILS = 'GET_POST_DETAILS'
export const CREATE_POST = 'CREATE_POST'
export const ADD_COMMENT = 'ADD_COMMENT'
export const LIKE_POST = 'LIKE_POST'

export const addToWatchlist = (coin) => async (dispatch, getState) => {
  if (!coin.price || !coin.priceChange24h) {
    try {
      const response = await coinGecko.get(`/coins/${coin.id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`)

      const coinWithData = {
        id: coin.id,
        name: coin.name || response.data.name,
        symbol: coin.symbol || response.data.symbol,
        image: coin.image || response.data.image.small,
        price: coin.price || response.data.market_data.current_price.usd,
        priceChange24h: coin.priceChange24h || response.data.market_data.price_change_percentage_24h,
        priceChange7d: coin.priceChange7d || response.data.market_data.price_change_percentage_7d,
        volume: coin.volume || response.data.market_data.total_volume.usd,
        marketCap: coin.marketCap || response.data.market_data.market_cap.usd
      }

      dispatch({ type: ADD_TO_WATCHLIST, payload: coinWithData })
    } catch (error) {
      console.error('Error fetching coin data for watchlist:', error)
      dispatch({ type: ADD_TO_WATCHLIST, payload: coin })
    }
  } else {
    dispatch({ type: ADD_TO_WATCHLIST, payload: coin })
  }
}

export const removeFromWatchlist = (coinId) => (dispatch, getState) => {
  dispatch({ type: REMOVE_FROM_WATCHLIST, payload: coinId })
}

export const updateWatchlistData = (updatedData) => {
  return {
    type: UPDATE_WATCHLIST_DATA,
    payload: updatedData
  }
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

export const getTradingSignals = () => {
  // In a real app, this would fetch from an API
  // For now we'll return mock data
  const mockSignals = [
    {
      id: 'signal-1',
      coinId: 'bitcoin',
      coinName: 'Bitcoin',
      symbol: 'BTC',
      price: 69420,
      signalType: 'buy',
      sharpeRatio: '2.1',
      maxDrawdown: '-25.3',
      tradeFrequency: '4.8',
      confidence: '87.5',
      timestamp: new Date().toISOString(),
      isActive: true
    },
    {
      id: 'signal-2',
      coinId: 'ethereum',
      coinName: 'Ethereum',
      symbol: 'ETH',
      price: 3950,
      signalType: 'sell',
      sharpeRatio: '1.9',
      maxDrawdown: '-31.2',
      tradeFrequency: '3.5',
      confidence: '72.3',
      timestamp: new Date().toISOString(),
      isActive: true
    }
  ]

  return {
    type: GET_TRADING_SIGNALS,
    payload: mockSignals
  }
}

export const addTradingSignal = (signal) => {
  return {
    type: ADD_TRADING_SIGNAL,
    payload: signal
  }
}

export const updateTradingSignal = (signalId, updates) => {
  return {
    type: UPDATE_TRADING_SIGNAL,
    payload: { signalId, updates }
  }
}

export const removeTradingSignal = (signalId) => {
  return {
    type: REMOVE_TRADING_SIGNAL,
    payload: signalId
  }
}

// Community action creators
export const getCommunityPosts = () => {
  const mockPosts = [
    {
      id: 'post-1',
      title: 'My BTC Trading Strategy for Bear Markets',
      content: 'I&apos; ve found that using a combination of RSI and MACD indicators...',
      author: 'CurryLaksa',
      authorAvatar: '../images/avatar/kaizhi.jpeg',
      date: '2025-03-20T14:30:00Z',
      tags: ['Bitcoin', 'Technical Analysis', 'Bear Market'],
      likes: 42,
      comments: 15,
      views: 230
    },
    {
      id: 'post-2',
      title: 'Ethereum Staking vs. Trading: My Experience',
      content: 'After 6 months of staking ETH and comparing results with my trading performance...',
      author: 'Kaizhiiii',
      authorAvatar: '../images/avatar/qy.jpg',
      date: '2025-03-19T10:15:00Z',
      tags: ['Ethereum', 'Staking', 'Passive Income'],
      likes: 38,
      comments: 22,
      views: 187
    },
    {
      id: 'post-3',
      title: 'My AI-Based Altcoin Selection Framework',
      content: 'I&apos ve developed a framework that uses sentiment analysis and on-chain metrics...',
      author: 'AhBoon',
      authorAvatar: '../images/avatar/boon.png',
      date: '2025-03-18T16:45:00Z',
      tags: ['Altcoins', 'AI', 'Data Science'],
      likes: 56,
      comments: 19,
      views: 312
    }
  ]

  return {
    type: GET_COMMUNITY_POSTS,
    payload: mockPosts
  }
}

export const getPostDetails = (postId) => {
  const mockPostDetails = {
    id: postId,
    title: 'My BTC Trading Strategy for Bear Markets',
    content: 'I&aps ve found that using a combination of RSI and MACD indicators helps me identify good entry points during bear markets. When RSI drops below 30 and MACD shows signs of convergence, I start building a position gradually rather than going all in. This strategy has helped me accumulate Bitcoin at good prices during the last three downturns. What strategies do you use?',
    author: 'CurryLaksa',
    authorAvatar: '../images/avatar/qy.jpg',
    reputation: 1250,
    date: '2025-03-20T14:30:00Z',
    tags: ['Bitcoin', 'Technical Analysis', 'Bear Market'],
    likes: 42,
    views: 230,
    comments: [
      {
        id: 'comment-1',
        author: 'Ren Sheng',
        authorAvatar: '/api/placeholder/32/32',
        content: 'Great strategy! I also use Bollinger Bands alongside RSI for confirmation.',
        date: '2025-03-20T15:45:00Z',
        likes: 7
      },
      {
        id: 'comment-2',
        author: 'yuyu',
        authorAvatar: '/api/placeholder/32/32',
        content: 'Have you tried using volume indicators as well? I find they help confirm trend reversals.',
        date: '2025-03-20T16:30:00Z',
        likes: 4
      }
    ]
  }

  return {
    type: GET_POST_DETAILS,
    payload: mockPostDetails
  }
}

export const createPost = (post) => {
  return {
    type: CREATE_POST,
    payload: {
      ...post,
      id: `post-${Date.now()}`,
      date: new Date().toISOString(),
      likes: 0,
      comments: 0,
      views: 0
    }
  }
}

export const addComment = (postId, comment) => {
  return {
    type: ADD_COMMENT,
    payload: {
      postId,
      comment: {
        ...comment,
        id: `comment-${Date.now()}`,
        date: new Date().toISOString(),
        likes: 0
      }
    }
  }
}

export const likePost = (postId) => {
  return {
    type: LIKE_POST,
    payload: postId
  }
}
