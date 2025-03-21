import { PROCESS_LOGIN_REWARD, UPDATE_USER_TIER } from '../redux_actions/userActions'

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
  case PROCESS_LOGIN_REWARD:
  // In a real app, you'd check if the user already claimed a reward today
    return {
      ...state,
      tokens: state.tokens + action.payload,
      lastLoginReward: new Date().toISOString()
    }
  case UPDATE_USER_TIER:
    return {
      ...state,
      tier: action.payload
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
