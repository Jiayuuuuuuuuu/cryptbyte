// src/redux/reducers/userReducer.js
const initialState = {
  name: 'Trader123',
  tokens: 780,
  joinDate: '2024-11-15',
  streak: 10,
  tier: 'silver',
  achievements: [],
  tradingStats: {
    winRate: 64,
    totalTrades: 37,
    averageProfit: 2.8,
    biggestWin: 12.5,
    biggestLoss: -4.2,
    averageHoldTime: '3.2 hours'
  }
}

export default function userReducer (state = initialState, action) {
  switch (action.type) {
  case 'ADD_TOKENS':
    return {
      ...state,
      tokens: state.tokens + action.payload
    }
  case 'COMPLETE_ACHIEVEMENT':
    return {
      ...state,
      achievements: [...state.achievements, action.payload.achievement],
      tokens: state.tokens + action.payload.tokens
    }
  case 'UPDATE_TIER':
    return {
      ...state,
      tier: action.payload
    }
  case 'UPDATE_STREAK':
    return {
      ...state,
      streak: state.streak + 1
    }
  case 'RESET_STREAK':
    return {
      ...state,
      streak: 0
    }
  case 'ADD_TRADE':
    const newStats = calculateNewStats(state.tradingStats, action.payload)
    return {
      ...state,
      tradingStats: newStats
    }
  default:
    return state
  }
}

// Helper function to recalculate trading stats when a new trade is added
function calculateNewStats (currentStats, newTrade) {
  const { totalTrades, winRate } = currentStats

  // Calculate new win rate
  const totalWins = Math.floor(totalTrades * (winRate / 100))
  const newWin = newTrade.result > 0 ? 1 : 0
  const newTotalWins = totalWins + newWin
  const newTotalTrades = totalTrades + 1
  const newWinRate = (newTotalWins / newTotalTrades) * 100

  return {
    ...currentStats,
    totalTrades: newTotalTrades,
    winRate: parseFloat(newWinRate.toFixed(1)),
    biggestWin: Math.max(currentStats.biggestWin, newTrade.result > 0 ? newTrade.result : 0),
    biggestLoss: Math.min(currentStats.biggestLoss, newTrade.result < 0 ? newTrade.result : 0)
    // Other calculations can be added here
  }
}

// src/redux/actions/userActions.js
export const addTokens = (amount) => ({
  type: 'ADD_TOKENS',
  payload: amount
})

export const completeAchievement = (achievement, tokens) => ({
  type: 'COMPLETE_ACHIEVEMENT',
  payload: { achievement, tokens }
})

export const updateTier = (tier) => ({
  type: 'UPDATE_TIER',
  payload: tier
})

export const incrementStreak = () => ({
  type: 'UPDATE_STREAK'
})

export const resetStreak = () => ({
  type: 'RESET_STREAK'
})

export const addTrade = (trade) => ({
  type: 'ADD_TRADE',
  payload: trade
})

// Example function for daily login reward
export const processLoginReward = () => {
  return (dispatch, getState) => {
    const { user } = getState()
    // Base tokens for login
    let tokenReward = 5

    // Streak bonus
    if (user.streak > 0) {
      // Additional tokens for streaks at certain thresholds
      if (user.streak % 5 === 0) {
        tokenReward += 25 // Bonus every 5 days
      }
      if (user.streak % 10 === 0) {
        tokenReward += 50 // Additional bonus every 10 days
      }
    }

    // Dispatch token addition
    dispatch(addTokens(tokenReward))

    // Increment streak
    dispatch(incrementStreak())

    // Check if the user should be promoted to next tier
    const { tokens, tier } = getState().user

    if (tier === 'bronze' && tokens >= 500) {
      dispatch(updateTier('silver'))
      // Could also dispatch a notification or achievement here
    } else if (tier === 'silver' && tokens >= 1500) {
      dispatch(updateTier('gold'))
    } else if (tier === 'gold' && tokens >= 5000) {
      dispatch(updateTier('premium'))
    }

    return tokenReward
  }
}
