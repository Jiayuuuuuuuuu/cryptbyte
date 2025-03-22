import {
  GET_TRADING_SIGNALS,
  ADD_TRADING_SIGNAL,
  UPDATE_TRADING_SIGNAL,
  REMOVE_TRADING_SIGNAL
} from '../redux_actions'

const initialState = {
  activeSignals: [],
  signalHistory: []
}

const tradingSignalsReducer = (state = initialState, action) => {
  switch (action.type) {
  case GET_TRADING_SIGNALS:
    return {
      ...state,
      activeSignals: action.payload.filter(signal => signal.isActive),
      signalHistory: action.payload
    }

  case ADD_TRADING_SIGNAL:
    return {
      ...state,
      activeSignals: [action.payload, ...state.activeSignals],
      signalHistory: [action.payload, ...state.signalHistory]
    }

  case UPDATE_TRADING_SIGNAL:
    const { signalId, updates } = action.payload

    // Update in active signals if it exists there
    const updatedActiveSignals = state.activeSignals.map(signal =>
      signal.id === signalId ? { ...signal, ...updates } : signal
    )

    // If the signal is no longer active, remove it from activeSignals
    const filteredActiveSignals = updates.isActive === false
      ? updatedActiveSignals.filter(signal => signal.id !== signalId)
      : updatedActiveSignals

    // Always update in history
    const updatedSignalHistory = state.signalHistory.map(signal =>
      signal.id === signalId ? { ...signal, ...updates } : signal
    )

    return {
      ...state,
      activeSignals: filteredActiveSignals,
      signalHistory: updatedSignalHistory
    }

  case REMOVE_TRADING_SIGNAL:
    return {
      ...state,
      activeSignals: state.activeSignals.filter(signal => signal.id !== action.payload),
      // We don't remove from history, just mark as inactive
      signalHistory: state.signalHistory.map(signal =>
        signal.id === action.payload
          ? { ...signal, isActive: false, dismissed: true }
          : signal
      )
    }

  default:
    return state
  }
}

export default tradingSignalsReducer
