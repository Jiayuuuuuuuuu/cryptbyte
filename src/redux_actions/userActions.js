import { ADD_TOKENS } from '../redux_actions'
export const PROCESS_LOGIN_REWARD = 'PROCESS_LOGIN_REWARD'
export const UPDATE_USER_TIER = 'UPDATE_USER_TIER'

export const updateUserTier = (tier) => {
  return {
    type: UPDATE_USER_TIER,
    payload: tier
  }
}

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

export const processLoginReward = () => {
  return (dispatch, getState) => {
    const { user } = getState()
    // Base tokens for login
    let tokenReward = 5

    // Streak bonus
    if (user.streak > 0) {
      if (user.streak % 5 === 0) {
        tokenReward += 25 // Bonus every 5 days
      }
      if (user.streak % 10 === 0) {
        tokenReward += 50 // Additional bonus every 10 days
      }
    }

    dispatch(addTokens(tokenReward))

    dispatch(incrementStreak())

    const { tokens, tier } = getState().user

    if (tier === 'bronze' && tokens >= 500) {
      dispatch(updateTier('silver'))
    } else if (tier === 'silver' && tokens >= 1500) {
      dispatch(updateTier('gold'))
    } else if (tier === 'gold' && tokens >= 5000) {
      dispatch(updateTier('premium'))
    }

    return tokenReward
  }
}
