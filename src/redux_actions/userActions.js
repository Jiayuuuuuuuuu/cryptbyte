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
